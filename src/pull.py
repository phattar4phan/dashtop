import asyncio
import json
import os
import pathlib
import re
import shutil
import subprocess
import sys
import threading
import time
from contextlib import asynccontextmanager

import psutil
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from .utils.cpu import GetCPUData
from .utils.gpu import GetGPUData
from .utils.temps import GetSensorsTemperatureData

INTERVAL = 1.0
POLL = 2.0
CONFIG_DIR = pathlib.Path.home() / ".dashtop"
DEFAULT_HOST = "127.0.0.1"
DEFAULT_PORT = 8765

_last: dict = {}


def _load_config() -> tuple[str, int]:
    p = CONFIG_DIR / "settings.json"
    if p.exists():
        try:
            c = json.loads(p.read_text())
            return str(c.get("HOST", DEFAULT_HOST)), DEFAULT_PORT
        except Exception:
            pass
    return DEFAULT_HOST, DEFAULT_PORT


def _delta() -> tuple[dict[str, float], dict[str, float]]:
    d1 = psutil.disk_io_counters()
    n1 = psutil.net_io_counters()
    time.sleep(INTERVAL)
    d2 = psutil.disk_io_counters()
    n2 = psutil.net_io_counters()
    m = 1024**2
    return (
        {
            "read_speed": max(0, (d2.read_bytes - d1.read_bytes) / m / INTERVAL),
            "write_speed": max(0, (d2.write_bytes - d1.write_bytes) / m / INTERVAL),
        },
        {
            "receive_speed": max(0, (n2.bytes_recv - n1.bytes_recv) / m / INTERVAL),
            "sent_speed": max(0, (n2.bytes_sent - n1.bytes_sent) / m / INTERVAL),
        },
    )


def _rnd(v: float) -> float:
    return 0.0 if abs(v) < 0.005 else round(v, 2)


def _flatten(sensors: dict) -> dict[str, int]:
    o: dict[str, int] = {}
    for k, v in sensors.items():
        if isinstance(v, dict):
            for sk, sv in v.items():
                o[f"{k}/{sk}"] = int(sv)
        else:
            o[k] = int(v)
    return o


def collect() -> dict:
    start = time.monotonic()
    dr: dict[str, float] = {}
    nr: dict[str, float] = {}

    def io():
        nonlocal dr, nr
        try:
            dr, nr = _delta()
        except Exception:
            pass

    t = threading.Thread(target=io, daemon=True)
    t.start()

    try:
        g = GetGPUData()
        gu = g.get("utilizations", {}).get("gpu_utils", 0)
        vu = g.get("utilizations", {}).get("vram_utils", 0)
        m = g.get("memory", {})
        vm_u = m.get("used", 0.0)
        vm_t = m.get("total", 0.0)
        gt = g.get("temperature", 0)
    except Exception:
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
    except Exception:
        cu = 0.0
        cf = 0
        pc = []
        cores = threads = ct = 0

    try:
        s = _flatten(GetSensorsTemperatureData())
    except Exception:
        s = {}

    t.join()
    time.sleep(max(0, POLL - (time.monotonic() - start)))

    return {
        "gpu_util": gu, "vram_util": vu,
        "vram_used": int(vm_u), "vram_total": int(vm_t),
        "gpu_temp": gt,
        "cpu_util": cu, "cpu_freq": round(cf),
        "per_core": pc, "cores": cores, "threads": threads,
        "cpu_temp": ct,
        "disk_read": _rnd(dr.get("read_speed", 0)),
        "disk_write": _rnd(dr.get("write_speed", 0)),
        "net_recv": _rnd(nr.get("receive_speed", 0)),
        "net_send": _rnd(nr.get("sent_speed", 0)),
        "sensors": s,
    }


@asynccontextmanager
async def lifespan(app):
    collect()
    yield

app = FastAPI(lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])


@app.get("/api/data")
async def data():
    return await asyncio.to_thread(collect)


dist = CONFIG_DIR / "dist"
if dist.exists():
    app.mount("/assets", StaticFiles(directory=str(dist / "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def spa(full_path: str):
        p = dist / full_path
        if p.is_file():
            return FileResponse(p)
        return FileResponse(dist / "index.html")


if __name__ == "__main__":
    host, port = _load_config()
    host = sys.argv[1] if len(sys.argv) > 1 else host
    port = int(sys.argv[2]) if len(sys.argv) > 2 else port

    tunnel = os.environ.get("DASHTOP_NOTUNNEL") is None and shutil.which("cloudflared")
    if tunnel:
        proc = subprocess.Popen(
            ["cloudflared", "tunnel", "--url", f"http://{host}:{port}", "--protocol", "http2"],
            stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True,
        )
        url_pattern = re.compile(r"https://[a-z0-9-]+\.trycloudflare\.com")
        for line in proc.stdout:
            m = url_pattern.search(line)
            if m:
                url = f"{m.group()}/dashboard"
                (CONFIG_DIR / "tunnel_url").write_text(url)
                print(f"tunnel: {url}")
                break

    print(f"local:  http://{host}:{port}/dashboard")
    uvicorn.run(app, host=host, port=port, log_level="warning")
