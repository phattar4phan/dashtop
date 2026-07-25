import psutil

def GetModulesTemperatureData() -> dict:
    temps = psutil.sensors_temperatures()
    
    # todo: turn temps [json] into variables and return them