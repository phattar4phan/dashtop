import pynvml

def GetGPUData() -> dict[str, str | int | float]:
    # intialize pyNVML
    pynvml.nvmlInit()
    
    device_count = pynvml.nvmlDeviceGetCount()
    
    for i in range(device_count):
        handle = pynvml.nvmlDeviceGetHandleByIndex(i)
        
        name = pynvml.nvmlDeviceGetName(handle)
        utils = pynvml.nvmlDeviceGetUtilizationRates(handle)
        memory = pynvml.nvmlDeviceGetMemoryInfo(handle)
        temperature = pynvml.nvmlDeviceGetTemperature(handle, pynvml.NVML_TEMPERATURE_GPU)
        
    return {
        'gpu_name': name,
        'utilizations': {
            'gpu_utils': utils.gpu,
            'vram_utils': utils.memory
        },
        'memory': {
            'used': memory.used / 1024 ** 2,
            'total': memory.total / 1024 ** 2,
        },
        'temperature': temperature
    }
    
# metrics = GetGPUData()
# print(f'GPU: {metrics['gpu_name']}')
# print(f'Utilization: {metrics['utilizations']['gpu_utils']}%')
# print(f'Memory: {(metrics['memory']['used']):.2f} MB / {(metrics['memory']['total']):.2f} MB')
# print(f'Temperature: {metrics['temperature']}°C')
