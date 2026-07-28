import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Cpu, HardDrive, Wifi, Thermometer, Monitor, ExternalLink } from "lucide-react";
import NumberFlow from "@number-flow/react";
import MetricCard from "./MetricCard";
import CircularProgress from "./CircularProgress";
import MiniLineChart from "./MiniLineChart";

const CORES = 8;
const HIST = 30;
const FMT_2D = { minimumFractionDigits: 2, maximumFractionDigits: 2 } as const;

function walk(v: number, lo: number, hi: number, step: number) {
  return Math.max(lo, Math.min(hi, v + (Math.random() - 0.5) * step * 2));
}

function mock() {
  return {
    gpuUtil: walk(45, 5, 98, 4),
    vramUtil: walk(55, 10, 95, 3),
    vramUsed: 6200 + (Math.random() - 0.5) * 400,
    vramTotal: 12288,
    gpuTemp: walk(62, 40, 85, 1.5),
    cpuUtil: walk(38, 2, 98, 5),
    cpuFreq: 2400 + Math.random() * 2400,
    perCore: Array.from({ length: CORES }, () => 1800 + Math.random() * 3000),
    cores: CORES,
    threads: CORES * 2,
    cpuTemp: walk(52, 35, 75, 1),
    diskRead: Math.max(0, 80 + (Math.random() - 0.3) * 300),
    diskWrite: Math.max(0, 40 + (Math.random() - 0.3) * 150),
    netRecv: Math.max(0, 15 + (Math.random() - 0.3) * 60),
    netSend: Math.max(0, 5 + (Math.random() - 0.3) * 30),
    sensors: {
      k10temp: walk(52, 35, 75, 1),
      acpitz: walk(44, 30, 65, 0.8),
      spd5118: walk(38, 28, 50, 0.6),
    } as Record<string, number>,
  };
}

type Data = ReturnType<typeof mock>;

type Hist = {
  gpu: number[];
  cpu: number[];
  diskRead: number[];
  diskWrite: number[];
  netRecv: number[];
  netSend: number[];
};

function initHist(): Hist {
  return {
    gpu: Array.from({ length: HIST }, () => 40 + Math.random() * 30),
    cpu: Array.from({ length: HIST }, () => 30 + Math.random() * 40),
    diskRead: Array.from({ length: HIST }, () => Math.random() * 200),
    diskWrite: Array.from({ length: HIST }, () => Math.random() * 100),
    netRecv: Array.from({ length: HIST }, () => Math.random() * 40),
    netSend: Array.from({ length: HIST }, () => Math.random() * 20),
  };
}

function pushHist(p: Hist, d: Data): Hist {
  return {
    gpu: [...p.gpu.slice(1), d.gpuUtil],
    cpu: [...p.cpu.slice(1), d.cpuUtil],
    diskRead: [...p.diskRead.slice(1), d.diskRead],
    diskWrite: [...p.diskWrite.slice(1), d.diskWrite],
    netRecv: [...p.netRecv.slice(1), d.netRecv],
    netSend: [...p.netSend.slice(1), d.netSend],
  };
}

function VRAMBar({ pct }: { pct: number }) {
  return (
    <div className="w-full mt-2 bg-dt-border/30 rounded-full h-1.5 overflow-hidden">
      <motion.div
        className="h-full bg-dt-accent rounded-full"
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </div>
  );
}

function RingWithLine({ pct, hist, label }: { pct: number; hist: number[]; label: string }) {
  return (
    <div className="glass-light rounded-2xl p-5 flex flex-col items-center">
      <CircularProgress percentage={pct} size={100} strokeWidth={6} label={label} />
      <MiniLineChart data={hist} width={160} height={40} className="mt-3" />
    </div>
  );
}

function SpeedPair({ a, b, labels }: { a: number; b: number; labels: [string, string] }) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-4">
      {[a, b].map((v, i) => (
        <div key={labels[i]}>
          <span className="text-[10px] text-dt-muted uppercase tracking-wider">{labels[i]}</span>
          <div className="text-xl font-bold text-dt-text flex items-baseline gap-1">
            <NumberFlow value={Number(v.toFixed(2))} locales="en-US" format={FMT_2D} />
            <span className="text-xs text-dt-muted">MB/s</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ChartBox({
  icon,
  label,
  pair,
  histA,
  histB,
}: {
  icon: React.ReactNode;
  label: string;
  pair: [number, number];
  histA: number[];
  histB: number[];
}) {
  return (
    <div className="glass-light rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-dt-accent">{icon}</span>
        <h3 className="text-sm font-semibold text-dt-muted uppercase tracking-wider">{label}</h3>
      </div>
      <SpeedPair a={pair[0]} b={pair[1]} labels={label === "Disk I/O" ? ["Read", "Write"] : ["Receive", "Send"]} />
      <MiniLineChart data={histA} width={340} height={60} />
      <MiniLineChart data={histB} width={340} height={60} color="#A6A7A2" />
    </div>
  );
}

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      className="text-center mb-16"
    >
      {children}
    </motion.div>
  );
}

export default function DashboardPreview() {
  const [data, setData] = useState<Data>(mock);
  const [hist, setHist] = useState<Hist>(initHist);

  const tick = useCallback(() => {
    const d = mock();
    setData(d);
    setHist((p) => pushHist(p, d));
  }, []);

  useEffect(() => {
    const i = setInterval(tick, 2000);
    return () => clearInterval(i);
  }, [tick]);

  const vramGB = (mb: number) => Number((mb / 1024).toFixed(1));

  return (
    <section id="dashboard" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <Heading>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Interactive Dashboard Preview</h2>
          <p className="mt-3 text-dt-muted max-w-lg mx-auto">
            Live-updating metrics with smooth animations.
          </p>
        </Heading>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass rounded-3xl p-6 sm:p-8 border border-dt-border/40"
        >
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Monitor className="w-4 h-4 text-dt-accent" />
              <h3 className="text-sm font-semibold text-dt-muted uppercase tracking-wider">GPU</h3>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <RingWithLine pct={data.gpuUtil} hist={hist.gpu} label="Utilization" />
              <div className="glass-light rounded-2xl p-5 flex flex-col items-center">
                <CircularProgress percentage={data.vramUtil} size={100} strokeWidth={6} label="VRAM Utilization" />
                <div className="mt-3 text-xs text-dt-muted">
                  <NumberFlow value={vramGB(data.vramUsed)} /> / {vramGB(data.vramTotal)} GB
                </div>
                <VRAMBar pct={data.vramUtil} />
              </div>
              <MetricCard label="VRAM Usage" value={Math.round(data.vramUsed)} unit={`/ ${Math.round(data.vramTotal)} MB`} />
              <MetricCard label="GPU Temperature" value={Math.round(data.gpuTemp)} unit="°C" icon={<Thermometer className="w-4 h-4" />} accent />
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Cpu className="w-4 h-4 text-dt-accent" />
              <h3 className="text-sm font-semibold text-dt-muted uppercase tracking-wider">CPU</h3>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <RingWithLine pct={data.cpuUtil} hist={hist.cpu} label="Utilization" />
              <MetricCard label="CPU Frequency" value={Math.round(data.cpuFreq)} unit="MHz" />
              <MetricCard label="Cores / Threads" value={data.cores} unit={`/ ${data.threads} threads`} />
              <MetricCard label="CPU Temperature" value={Math.round(data.cpuTemp)} unit="°C" icon={<Thermometer className="w-4 h-4" />} accent />
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-semibold text-dt-muted uppercase tracking-wider mb-4">Per-Core Frequency (MHz)</h3>
            <div className="glass-light rounded-2xl p-5">
              <div className="grid grid-cols-4 lg:grid-cols-8 gap-3">
                {data.perCore.map((f, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 py-2">
                    <span className="text-[10px] text-dt-muted uppercase tracking-wider">Core {i}</span>
                    <NumberFlow value={Math.round(f)} className="text-lg font-bold text-dt-accent tabular-nums" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-4 mb-8">
            <ChartBox
              icon={<HardDrive className="w-4 h-4" />}
              label="Disk I/O"
              pair={[data.diskRead, data.diskWrite]}
              histA={hist.diskRead}
              histB={hist.diskWrite}
            />
            <ChartBox
              icon={<Wifi className="w-4 h-4" />}
              label="Network"
              pair={[data.netRecv, data.netSend]}
              histA={hist.netRecv}
              histB={hist.netSend}
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <Thermometer className="w-4 h-4 text-dt-accent" />
              <h3 className="text-sm font-semibold text-dt-muted uppercase tracking-wider">Sensor Temperatures</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {Object.entries(data.sensors).map(([s, t]) => (
                <MetricCard key={s} label={s} value={Math.round(t)} unit="°C" accent={s === "k10temp"} />
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-center mt-8"
        >
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-dt-accent text-black font-semibold rounded-xl text-sm hover:bg-dt-accent/90 transition-colors accent-glow"
          >
            <ExternalLink className="w-4 h-4" />
            Open Dashboard
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
