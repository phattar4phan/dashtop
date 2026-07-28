import { motion } from "framer-motion";
import { Cpu, Monitor, HardDrive, Wifi, Thermometer, Globe } from "lucide-react";

const FEATURES = [
  {
    icon: <Monitor className="w-6 h-6" />,
    title: "Real-Time GPU Monitoring",
    desc: "Track GPU utilization, VRAM usage, and temperature.",
  },
  {
    icon: <Cpu className="w-6 h-6" />,
    title: "CPU Performance Tracking",
    desc: "Monitor per-core frequency, overall utilization, and logical thread count in real time.",
  },
  {
    icon: <HardDrive className="w-6 h-6" />,
    title: "Disk Throughput",
    desc: "Monitor read and write speeds with live-updating throughput charts.",
  },
  {
    icon: <Wifi className="w-6 h-6" />,
    title: "Network Activity",
    desc: "Monitor send and receive speeds to understand network utilization at a glance.",
  },
  {
    icon: <Thermometer className="w-6 h-6" />,
    title: "Hardware Sensor Monitoring",
    desc: "Read temperature data from auto-detected sensors.",
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Modern Web Dashboard",
    desc: "Access your system metrics from any device through the dashboard.",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Features() {
  return (
    <section id="features" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Features</h2>
          <p className="mt-3 text-dt-muted max-w-lg mx-auto">
            Everything you need to monitor your hardware in one clean interface.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {FEATURES.map((f) => (
            <motion.div
              key={f.title}
              variants={item}
              whileHover={{ y: -4 }}
              className="glass rounded-2xl p-6 flex flex-col gap-4 group cursor-default"
            >
              <div className="w-10 h-10 rounded-xl bg-dt-accent/10 flex items-center justify-center text-dt-accent group-hover:bg-dt-accent/20 transition-colors">
                {f.icon}
              </div>
              <div>
                <h3 className="font-semibold text-dt-text mb-1.5">{f.title}</h3>
                <p className="text-sm text-dt-muted leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
