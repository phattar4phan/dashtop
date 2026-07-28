import psutil

def GetSensorsTemperatureData() -> dict[str | dict[str, int | float]]:
    result = {}
    temps = psutil.sensors_temperatures()
    
    if not temps:
        return result
    
    for sensor, entries in temps.items():
        values = {}
        for entry in entries:
            current = getattr(entry, "current", None)
            if current is None:
                continue
            
            label = getattr(entry, "label", None) or f"channel_{len(values)}"
            values[label] = current
            
        if not values:
            continue
        
        result[sensor] = values if len(values) > 1 else next(iter(values.values()))
        
    return result
