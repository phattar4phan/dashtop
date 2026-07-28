import psutil


def _get_cpu_temperature() -> float | None:
    temps = psutil.sensors_temperatures()
    if not temps:
        return None
    for sensor_name in ("k10temp", "coretemp", "cpu_thermal", "acpitz"):
        if sensor_name in temps:
            for entry in temps[sensor_name]:
                label = getattr(entry, "label", "") or ""
                current = getattr(entry, "current", None)
                if current is not None and (
                    "tdie" in label.lower()
                    or "tctl" in label.lower()
                    or "cpu" in label.lower()
                    or "package" in label.lower()
                    or label == ""
                ):
                    return current
    for sensor_name, entries in temps.items():
        for entry in entries:
            current = getattr(entry, "current", None)
            if current is not None:
                return current
    return None


def GetCPUData() -> float:
    # block for 0.1s to calculate accurate percentage
    cpu_usage = psutil.cpu_percent(interval=0.1)
    cpu_frequency = psutil.cpu_freq()
    cpu_frequency_per = psutil.cpu_freq(percpu=True)
    cpu_logical = psutil.cpu_count(logical=True)
    cpu_physcial = psutil.cpu_count(logical=False)
    cpu_temp = _get_cpu_temperature()

    result = {
        "cpu_usage": cpu_usage,
        "cpu_frequency": cpu_frequency,
        "freq_per_cpu": [f.current for f in cpu_frequency_per],
        "cores": cpu_physcial,
        "threads": cpu_logical,
        "cpu_temp": cpu_temp,
    }

    return result
