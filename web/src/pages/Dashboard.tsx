import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Monitor, Cpu, HardDrive, Wifi, Thermometer,
  ArrowLeft, WifiOff, Loader2,
} from "lucide-react";
import NumberFlow from "@number-flow/react";
import MetricCard from "../components/MetricCard";
import CircularProgress from "../components/CircularProgress";
import MiniLineChart from "../components/MiniLineChart";

const HISTORY = 30;
function wsUrl() {
  if (typeof window === "undefined") return "ws://127.0.0.1:8765";
  const proto = window.location.protocol === "https:" ? "wss" : "ws";
  return `${proto}://${window.location.hostname}:8765`;
}

type Data = {
  gpuUtil: number; vramUtil: number; vramUsed: number; vramTotal: number; gpuTemp: number;
  cpuUtil: number; cpuFreq: number; perCore: number[]; cores: number; threads: number; cpuTemp: number;
  diskRead: number; diskWrite: number; netRecv: number; netSend: number;
  sensors: Record<string, number>;
};

type Hist = {
  gpu: number[]; cpu: number[]; diskRead: number[]; diskWrite: number[]; netRecv: number[]; netSend: number[];
};

const ZERO_HIST = (): Hist => ({
  gpu: new Array(HISTORY).fill(0), cpu: new Array(HISTORY).fill(0),
  diskRead: new Array(HISTORY).fill(0), diskWrite: new Array(HISTORY).fill(0),
  netRecv: new Array(HISTORY).fill(0), netSend: new Array(HISTORY).fill(0),
});

const ZERO_DATA: Data = {
  gpuUtil: 0, vramUtil: 0, vramUsed: 0, vramTotal: 0, gpuTemp: 0,
  cpuUtil: 0, cpuFreq: 0, perCore: [], cores: 0, threads: 0, cpuTemp: 0,
  diskRead: 0, diskWrite: 0, netRecv: 0, netSend: 0, sensors: {},
};

function mapLive(raw: Record<string, unknown>): Data {
  const sensors: Record<string, number> = {};
  const rs = raw.sensors as Record<string, number> | undefined;
  if (rs) for (const k of Object.keys(rs)) sensors[k] = Number(rs[k]);

  return {
    gpuUtil: Number(raw.gpu_util) || 0, vramUtil: Number(raw.vram_util) || 0,
    vramUsed: Number(raw.vram_used) || 0, vramTotal: Number(raw.vram_total) || 0,
    gpuTemp: Number(raw.gpu_temp) || 0,
    cpuUtil: Number(raw.cpu_util) || 0, cpuFreq: Number(raw.cpu_freq) || 0,
    perCore: (raw.per_core as number[])?.map(Number) || [], cores: Number(raw.cores) || 0,
    threads: Number(raw.threads) || 0, cpuTemp: Number(raw.cpu_temp) || 0,
    diskRead: Number(raw.disk_read) || 0, diskWrite: Number(raw.disk_write) || 0,
    netRecv: Number(raw.net_recv) || 0, netSend: Number(raw.net_send) || 0,
    sensors,
  };
}

function histPush(prev: Hist, d: Data): Hist {
  return {
    gpu: [...prev.gpu.slice(1), d.gpuUtil], cpu: [...prev.cpu.slice(1), d.cpuUtil],
    diskRead: [...prev.diskRead.slice(1), d.diskRead], diskWrite: [...prev.diskWrite.slice(1), d.diskWrite],
    netRecv: [...prev.netRecv.slice(1), d.netRecv], netSend: [...prev.netSend.slice(1), d.netSend],
  };
}

const FMT_2D = { minimumFractionDigits: 2, maximumFractionDigits: 2 } as const;

function Section({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-dt-accent">{icon}</span>
      <h3 className="text-sm font-semibold text-dt-muted uppercase tracking-wider">{label}</h3>
    </div>
  );
}

export default function Dashboard() {
  const [connected, setConnected] = useState(false);
  const [ever, setEver] = useState(false);
  const [data, setData] = useState<Data>(ZERO_DATA);
  const [history, setHistory] = useState<Hist>(ZERO_HIST);
  const pushRef = useRef<(d: Data) => void>(() => {});

  pushRef.current = useCallback((d: Data) => {
    setHistory((p) => histPush(p, d));
  }, []);

  useEffect(() => {
    let ws: WebSocket | null = null;
    let retry: ReturnType<typeof setTimeout> | null = null;

    const connect = () => {
      const s = new WebSocket(wsUrl());
      ws = s;
      s.onopen = () => { setConnected(true); setEver(true); };
      s.onmessage = (e) => {
        try {
          const d = mapLive(JSON.parse(e.data));
          setData(d);
          pushRef.current(d);
        } catch { /* skip */ }
      };
      s.onclose = () => { setConnected(false); ws = null; retry = setTimeout(connect, 3000); };
      s.onerror = () => s.close();
    };

    connect();
    return () => {
      if (ws) { ws.onclose = null; ws.close(); }
      if (retry) clearTimeout(retry);
    };
  }, []);

  const status = connected
    ? <span className="flex items-center gap-1.5 text-[10px] text-dt-accent uppercase tracking-wider"><span className="w-1.5 h-1.5 rounded-full bg-dt-accent animate-pulse" />Live</span>
    : ever
    ? <span className="flex items-center gap-1.5 text-[10px] text-yellow-500 uppercase tracking-wider"><WifiOff className="w-3 h-3" />Reconnecting</span>
    : <span className="flex items-center gap-1.5 text-[10px] text-dt-muted uppercase tracking-wider"><Loader2 className="w-3 h-3 animate-spin" />Connecting</span>;

  return (
    <div className="min-h-screen bg-dt-bg text-dt-text font-sans">
      <header className="glass border-b border-dt-border/30 sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-1.5 text-dt-muted hover:text-dt-text transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm hidden sm:inline">Back</span>
            </Link>
            <div className="flex items-center gap-2">
              <Monitor className="w-4 h-4 text-dt-accent" />
              <span className="font-semibold text-sm tracking-tight">Dashtop</span>
            </div>
          </div>
          <div className="flex items-center gap-3">{status}</div>
        </div>
      </header>

      <motion.main
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
        className="mx-auto max-w-7xl px-4 sm:px-6 py-6"
      >
        <div className="glass rounded-3xl p-6 sm:p-8 border border-dt-border/40">

          <div className="mb-8">
            <Section icon={<Monitor className="w-4 h-4" />} label="GPU" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass-light rounded-2xl p-5 flex flex-col items-center">
                <CircularProgress percentage={data.gpuUtil} size={100} strokeWidth={6} label="Utilization" />
                <MiniLineChart data={history.gpu} width={160} height={40} className="mt-3" />
              </div>
              <div className="glass-light rounded-2xl p-5 flex flex-col items-center">
                <CircularProgress percentage={data.vramUtil} size={100} strokeWidth={6} label="VRAM Utilization" />
                <div className="mt-3 text-xs text-dt-muted">
                  <NumberFlow value={Number((data.vramUsed / 1024).toFixed(1))} /> /{" "}
                  {Number((data.vramTotal / 1024).toFixed(1))} GB
                </div>
                <div className="w-full mt-2 bg-dt-border/30 rounded-full h-1.5 overflow-hidden">
                  <motion.div
                    className="h-full bg-dt-accent rounded-full"
                    animate={{ width: `${data.vramUtil}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </div>
              <MetricCard label="VRAM Usage" value={data.vramUsed} unit={`/ ${data.vramTotal} MB`} />
              <MetricCard label="GPU Temperature" value={data.gpuTemp} unit="°C" icon={<Thermometer className="w-4 h-4" />} accent />
            </div>
          </div>

          <div className="mb-8">
            <Section icon={<Cpu className="w-4 h-4" />} label="CPU" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass-light rounded-2xl p-5 flex flex-col items-center">
                <CircularProgress percentage={data.cpuUtil} size={100} strokeWidth={6} label="Utilization" />
                <MiniLineChart data={history.cpu} width={160} height={40} className="mt-3" />
              </div>
              <MetricCard label="CPU Frequency" value={data.cpuFreq} unit="MHz" />
              <MetricCard label="Cores / Threads" value={data.cores} unit={`/ ${data.threads} threads`} />
              <MetricCard label="CPU Temperature" value={data.cpuTemp} unit="°C" icon={<Thermometer className="w-4 h-4" />} accent />
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-semibold text-dt-muted uppercase tracking-wider mb-4">
              Per-Core Frequency (MHz)
            </h3>
            <div className="glass-light rounded-2xl p-5">
              <div className="grid grid-cols-4 lg:grid-cols-8 gap-3">
                {data.perCore.length > 0
                  ? data.perCore.map((f, i) => (
                      <div key={i} className="flex flex-col items-center gap-1 py-2">
                        <span className="text-[10px] text-dt-muted uppercase tracking-wider">Core {i}</span>
                        <NumberFlow value={f} className="text-lg font-bold text-dt-accent tabular-nums" />
                      </div>
                    ))
                  : <div className="col-span-full text-center py-4 text-xs text-dt-muted">Waiting for data...</div>}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-4 mb-8">
            <div className="glass-light rounded-2xl p-5">
              <Section icon={<HardDrive className="w-4 h-4" />} label="Disk I/O" />
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-[10px] text-dt-muted uppercase tracking-wider">Read</span>
                  <div className="text-xl font-bold text-dt-text flex items-baseline gap-1">
                    <NumberFlow value={data.diskRead} locales="en-US" format={FMT_2D} />
                    <span className="text-xs text-dt-muted">MB/s</span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-dt-muted uppercase tracking-wider">Write</span>
                  <div className="text-xl font-bold text-dt-text flex items-baseline gap-1">
                    <NumberFlow value={data.diskWrite} locales="en-US" format={FMT_2D} />
                    <span className="text-xs text-dt-muted">MB/s</span>
                  </div>
                </div>
              </div>
              <MiniLineChart data={history.diskRead} width={340} height={60} />
              <MiniLineChart data={history.diskWrite} width={340} height={60} color="#A6A7A2" />
            </div>
            <div className="glass-light rounded-2xl p-5">
              <Section icon={<Wifi className="w-4 h-4" />} label="Network" />
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-[10px] text-dt-muted uppercase tracking-wider">Receive</span>
                  <div className="text-xl font-bold text-dt-text flex items-baseline gap-1">
                    <NumberFlow value={data.netRecv} locales="en-US" format={FMT_2D} />
                    <span className="text-xs text-dt-muted">MB/s</span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-dt-muted uppercase tracking-wider">Send</span>
                  <div className="text-xl font-bold text-dt-text flex items-baseline gap-1">
                    <NumberFlow value={data.netSend} locales="en-US" format={FMT_2D} />
                    <span className="text-xs text-dt-muted">MB/s</span>
                  </div>
                </div>
              </div>
              <MiniLineChart data={history.netRecv} width={340} height={60} />
              <MiniLineChart data={history.netSend} width={340} height={60} color="#A6A7A2" />
            </div>
          </div>

          <div>
            <Section icon={<Thermometer className="w-4 h-4" />} label="Sensor Temperatures" />
            {Object.keys(data.sensors).length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {Object.entries(data.sensors).map(([s, t]) => (
                  <MetricCard key={s} label={s} value={t} unit="°C" accent={s.includes("k10temp")} />
                ))}
              </div>
            ) : (
              <div className="glass-light rounded-2xl p-6 text-center text-xs text-dt-muted">No sensor data available</div>
            )}
          </div>
        </div>
      </motion.main>
    </div>
  );
}
