import time
import psutil

def GetDiskIOData(interval: float) -> dict:
    # record first io snapshot
    disk_first_snapshot = psutil.disk_io_counters()
    
    time.sleep(interval)
    
    # record second io snapshot
    disk_second_snapshot = psutil.disk_io_counters()
    
    disk_speed_read = (disk_second_snapshot.read_bytes - disk_first_snapshot.read_bytes / (1024 ** 2)) / interval
    disk_speed_write = (disk_second_snapshot.write_bytes - disk_first_snapshot.write_bytes / (1024 ** 2)) / interval
    
    result = {
        'read_speed': disk_speed_read,
        'write_speed': disk_speed_write
    }
    
    return result
