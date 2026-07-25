import psutil

def GetRAMData() -> dict[str, float]:
    ram = psutil.virtual_memory()
    ram_total = ram.total / (1024 ** 3)
    ram_used = ram.used / (1024 ** 3)
    ram_percent = ram.percent
    
    return {
        'percent': ram_percent,
        'used': ram_used,
        'total': ram_total,
        'available': (ram_total - ram_used)
    }
    
# ram = GetRAMData()
# print(f'RAM Usage: {ram['percent']:.2f}%')
# print(f'RAM Used: {ram['used']:.2f} GB')
# print(f'RAM Total: {ram['total']:.2f} GB')
# print(f'Available: {ram['available']:.2f} GB')
