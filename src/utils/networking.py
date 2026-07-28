import time
import psutil

def GetNetworkingData(interval: float) -> dict:
    # take initial snapshot
    net_first_snapshot = psutil.net_io_counters()
    
    time.sleep(interval)
    
    # take second snapshot
    net_secnd_snapshot = psutil.net_io_counters()
    
    net_speed_recv = ((net_secnd_snapshot.bytes_recv - net_first_snapshot.bytes_recv) / (1024 ** 2)) / interval
    net_speed_sent = ((net_secnd_snapshot.bytes_sent - net_first_snapshot.bytes_sent) / (1024 ** 2)) / interval
    
    result = {
        'receive_speed': net_speed_recv,
        'sent_speed': net_speed_sent
    }
    
    return result
