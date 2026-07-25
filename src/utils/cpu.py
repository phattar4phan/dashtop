import psutil

def GetCPUData() -> float:
    # block for 0.1s to calculate accurate percentage
    cpu_usage = psutil.cpu_percent(interval=0.1)
    
    return cpu_usage

cpu = GetCPUData()
print(f'CPU: {cpu:.2f}%')