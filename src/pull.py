import asyncio
import json
import pathlib
import sys
import threading
import time
from datetime import datetime, timezone

import psutil
import websockets
from websockets.asyncio.server import ServerConnection

from .utils.cpu import GetCPUData
from .utils.gpu import GetGPUData
from .utils.temps import GetSensorsTemperatureData

INTERVAL = 1.0
POLL = 2.0

clients: set[ServerConnection] = set()
last_payload: str | None = None
DEFAULT_HOST = "127.0.0.1"
DEFAULT_PORT = 8765

CONFIG_DIR = pathlib.Path.home() / ".dashtop"
LOG_FILE = CONFIG_DIR / "_logs.txt"

def _load_config() -> tuple[str, int]:
    path = CONFIG_DIR / "settings.json"
    if path.exists():
        try:
            cfg = json.loads(path.read_text())
            return str(cfg.get("HOST", DEFAULT_HOST)), DEFAULT_PORT
        except Exception:
            pass
    return DEFAULT_HOST, DEFAULT_PORT


def _log(msg: str) -> None:
    CONFIG_DIR.mkdir(parents=True, exist_ok=True)
    with open(LOG_FILE, "a") as f:
        f.write(msg + "\n")

def _delta() -> tuple[dict[str, float], dict[str, float]]:
    disk1 = psutil.disk_io_counters()
    net1 = psutil.net_io_counters()
    time.sleep(INTERVAL)
    disk2 = psutil.disk_io_counters()
    net2 = psutil.net_io_counters()
    m = 1024**2
    dr = max(0, (disk2.read_bytes - disk1.read_bytes) / m / INTERVAL)
    dw = max(0, (disk2.write_bytes - disk1.write_bytes) / m / INTERVAL)
    nr = max(0, (net2.bytes_recv - net1.bytes_recv) / m / INTERVAL)
    ns = max(0, (net2.bytes_sent - net1.bytes_sent) / m / INTERVAL)
    return {"read_speed": dr, "write_speed": dw}, {"receive_speed": nr, "sent_speed": ns}

def _rnd(v: float) -> float:
    return 0.0 if abs(v) < 0.005 else round(v, 2)

def _flatten(sensors: dict) -> dict[str, int]:
    out: dict[str, int] = {}
    for k, v in sensors.items():
        if isinstance(v, dict):
            for sk, sv in v.items():
                out[f"{k}/{sk}"] = int(sv)
        else:
            out[k] = int(v)
    return out

def collect() -> dict:
    start = time.monotonic()

    disk_result: dict[str, float] = {}
    net_result: dict[str, float] = {}

    def io_job():
        nonlocal disk_result, net_result
        try:
            disk_result, net_result = _delta()
        except Exception as e:
            if getattr(collect, "_io_warned", False) is False:
                _log(f"io error: {e}")
                collect._io_warned = True

    t = threading.Thread(target=io_job, daemon=True)
    t.start()

    try:
        g = GetGPUData()
        gu = g.get("utilizations", {}).get("gpu_utils", 0)
        vu = g.get("utilizations", {}).get("vram_utils", 0)
        mem = g.get("memory", {})
        vm_u = mem.get("used", 0.0)
        vm_t = mem.get("total", 0.0)
        gt = g.get("temperature", 0)
    except Exception as e:
        if getattr(collect, "_gpu_warned", False) is False:
            _log(f"gpu unavailable: {e}")
            collect._gpu_warned = True
        gu = vu = 0
        vm_u = vm_t = 0.0
        gt = 0

    try:
        c = GetCPUData()
        cu = c.get("cpu_usage", 0.0)
        cf = getattr(c.get("cpu_frequency"), "current", 0) or 0
        pc = [int(f) for f in c.get("freq_per_cpu", [])]
        cores = c.get("cores", 0)
        threads = c.get("threads", 0)
        ct = int(c.get("cpu_temp") or 0)
    except Exception as e:
        if getattr(collect, "_cpu_warned", False) is False:
            _log(f"cpu error: {e}")
            collect._cpu_warned = True
        cu = 0.0
        cf = 0
        pc = []
        cores = threads = ct = 0

    try:
        s = _flatten(GetSensorsTemperatureData())
    except Exception as e:
        if getattr(collect, "_sensors_warned", False) is False:
            _log(f"sensors error: {e}")
            collect._sensors_warned = True
        s = {}

    t.join()
    time.sleep(max(0, POLL - (time.monotonic() - start)))

    return {
        "gpu_util": gu,
        "vram_util": vu,
        "vram_used": int(vm_u),
        "vram_total": int(vm_t),
        "gpu_temp": gt,
        "cpu_util": cu,
        "cpu_freq": round(cf),
        "per_core": pc,
        "cores": cores,
        "threads": threads,
        "cpu_temp": ct,
        "disk_read": _rnd(disk_result.get("read_speed", 0)),
        "disk_write": _rnd(disk_result.get("write_speed", 0)),
        "net_recv": _rnd(net_result.get("receive_speed", 0)),
        "net_send": _rnd(net_result.get("sent_speed", 0)),
        "sensors": s,
    }

async def handler(ws: ServerConnection) -> None:
    clients.add(ws)
    print(f"connected ({len(clients)})")
    if last_payload:
        try:
            await ws.send(last_payload)
        except websockets.exceptions.ConnectionClosed:
            pass
    try:
        async for _ in ws:
            pass
    finally:
        clients.discard(ws)

async def broadcast(data: dict) -> None:
    global last_payload
    if not clients:
        return
    msg = json.dumps(data, separators=(",", ":"))
    last_payload = msg
    dead = []
    for ws in clients:
        try:
            await ws.send(msg)
        except websockets.exceptions.ConnectionClosed:
            dead.append(ws)
    for ws in dead:
        clients.discard(ws)

async def main(host: str, port: int) -> None:
    print(f"starting server on {host}:{port}...")
    async with websockets.serve(handler, host, port):
        print(f"ws://{host}:{port}")
        try:
            while True:
                d = await asyncio.to_thread(collect)
                await broadcast(d)
                if clients:
                    t = datetime.now(timezone.utc).strftime("%H:%M:%S")
                    _log(
                        f"[{t}]:"
                        f"gpu({d['gpu_util']}/{d['vram_util']}/{d['gpu_temp']}),"
                        f"cpu({d['cpu_util']}/{d['cpu_freq']}/{d['cpu_temp']}),"
                        f"disk({d['disk_read']}/{d['disk_write']}),"
                        f"net({d['net_recv']}/{d['net_send']})"
                    )
        except KeyboardInterrupt:
            print()

if __name__ == "__main__":
    host, port = _load_config()
    host = sys.argv[1] if len(sys.argv) > 1 else host
    port = int(sys.argv[2]) if len(sys.argv) > 2 else port
    asyncio.run(main(host, port))
