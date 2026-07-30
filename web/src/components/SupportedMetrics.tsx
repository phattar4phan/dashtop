import { motion } from "framer-motion";
import { Monitor, Cpu, HardDrive, Wifi, Thermometer } from "lucide-react";

const CATS = [
  {
    icon: <Monitor className="w-5 h-5" />,
    title: "GPU",
    metrics: ["- GPU utilization (%)", "- VRAM utilization (%)", "- VRAM usage and total capacity", "- GPU temperature"],
  },
  {
    icon: <Cpu className="w-5 h-5" />,
    title: "CPU",
    metrics: ["- CPU utilization (%)", "- CPU frequency (MHz)", "- Per-core frequency (MHz)", "- Physical cores", "- Logical threads"],
  },
  {
    icon: <HardDrive className="w-5 h-5" />,
    title: "Disk",
    metrics: ["- Disk read speed", "- Disk write speed"],
  },
  {
    icon: <Wifi className="w-5 h-5" />,
    title: "Network",
    metrics: ["- Network receive speed", "- Network send speed"],
  },
  {
    icon: <Thermometer className="w-5 h-5" />,
    title: "Sensors",
    metrics: ["- Auto-detected system sensors"],
  },
];

export default function SupportedMetrics() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Supported Metrics</h2>
          <p className="mt-3 text-dt-muted max-w-xl">
            Dashtop intentionally focuses on a concise set of high-value hardware statistics.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row">
          {CATS.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className={`flex-1 p-5 border-2 border-dt-border sm:[&:not(:last-child)]:border-r-0 [&:not(:last-child)]:border-b-0 sm:[&:not(:last-child)]:border-b-2 ${
                i % 2 === 0 ? "bg-dt-surface" : "bg-dt-bg"
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-dt-accent">{c.icon}</span>
                <h3 className="font-bold text-dt-text uppercase tracking-wide">{c.title}</h3>
              </div>
              <ul className="space-y-1">
                {c.metrics.map((m) => (
                  <li key={m} className="text-sm text-dt-muted">{m}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
