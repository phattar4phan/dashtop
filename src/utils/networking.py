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
    
    return {
        'receive_speed': net_speed_recv,
        'sent_speed': net_speed_sent
    }
    
networking = GetNetworkingData(1)
print(f'Receive: {networking['receive_speed']:.2f} MB/s')
print(f'Sent: {networking['sent_speed']:.2f} MB/s')
