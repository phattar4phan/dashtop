import subprocess
import json


def GetGPUData() -> dict:
    try:
        out = subprocess.check_output(
            [
                "nvidia-smi",
                "--query-gpu=name,utilization.gpu,utilization.memory,memory.used,memory.total,temperature.gpu",
                "--format=csv,noheader,nounits",
            ],
            timeout=5,
            text=True,
        ).strip()
        if not out:
            raise RuntimeError("nvidia-smi returned no data")

        parts = [x.strip() for x in out.split(",")]
        return {
            "gpu_name": parts[0],
            "utilizations": {
                "gpu_utils": int(parts[1]),
                "vram_utils": int(parts[2]),
            },
            "memory": {
                "used": float(parts[3]),
                "total": float(parts[4]),
            },
            "temperature": int(parts[5]),
        }
    except Exception:
        return {
            "gpu_name": None,
            "utilizations": {"gpu_utils": 0, "vram_utils": 0},
            "memory": {"used": 0.0, "total": 0.0},
            "temperature": 0,
        }
