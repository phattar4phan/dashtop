import { motion } from "framer-motion";
import { Monitor, Cpu, HardDrive, Wifi, Thermometer, CheckCircle } from "lucide-react";

const CATS = [
  {
    icon: <Monitor className="w-5 h-5" />,
    title: "GPU",
    metrics: ["GPU utilization (%)", "VRAM utilization (%)", "VRAM usage and total capacity", "GPU temperature"],
  },
  {
    icon: <Cpu className="w-5 h-5" />,
    title: "CPU",
    metrics: ["CPU utilization (%)", "CPU frequency (MHz)", "Per-core CPU frequency (MHz)", "Physical cores", "Logical threads"],
  },
  {
    icon: <HardDrive className="w-5 h-5" />,
    title: "Disk",
    metrics: ["Disk read speed", "Disk write speed"],
  },
  {
    icon: <Wifi className="w-5 h-5" />,
    title: "Network",
    metrics: ["Network receive speed", "Network send speed"],
  },
  {
    icon: <Thermometer className="w-5 h-5" />,
    title: "Sensors",
    metrics: ["Auto-detected system sensors"],
  },
];

export default function SupportedMetrics() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Supported Metrics</h2>
          <p className="mt-3 text-dt-muted max-w-xl mx-auto">
            Dashtop intentionally focuses on a concise set of high-value hardware statistics.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATS.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className={`p-5 border-2 border-dt-border ${i % 2 === 0 ? "bg-dt-surface" : "bg-dt-bg"}`}
            >
              <div className="flex items-center gap-2.5 mb-4">
                <span className="text-dt-accent">{c.icon}</span>
                <h3 className="font-semibold text-dt-text">{c.title}</h3>
              </div>
              <ul className="space-y-2">
                {c.metrics.map((m) => (
                  <li key={m} className="flex items-start gap-2 text-sm text-dt-muted">
                    <CheckCircle className="w-3.5 h-3.5 text-dt-accent mt-0.5 flex-shrink-0" />
                    {m}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
