import psutil

def GetRAMData() -> dict[str, float]:
    ram = psutil.virtual_memory()
    ram_total = ram.total / (1024 ** 3)
    ram_used = ram.used / (1024 ** 3)
    ram_percent = ram.percent
    
    result = {
        'percent': ram_percent,
        'used': ram_used,
        'total': ram_total,
        'available': (ram_total - ram_used)
    }
    return result
