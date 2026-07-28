import { motion } from "framer-motion";
import { Download as DownloadIcon, Github, BookOpen, Terminal } from "lucide-react";

const CMDS = [
  { label: "curl", cmd: "curl -fsSL https://dashtop.phattar4phan.workers.dev/install.sh | sh" },
  { label: "wget", cmd: "wget -qO- https://dashtop.phattar4phan.workers.dev/install.sh | sh" },
];

const Btn = ({ href, children, primary }: { href: string; children: React.ReactNode; primary?: boolean }) => (
  <motion.a
    href={href}
    target={href.startsWith("http") ? "_blank" : undefined}
    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
    className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-colors ${
      primary
        ? "bg-dt-accent text-black font-semibold hover:bg-dt-accent/90 accent-glow"
        : "glass text-dt-text hover:border-dt-accent/50"
    }`}
  >
    {children}
  </motion.a>
);

export default function Download() {
  return (
    <section id="download" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Download</h2>
          <p className="mt-3 text-dt-muted max-w-lg mx-auto">Available on Linux. Free and open source.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="glass rounded-3xl p-6 sm:p-8 border border-dt-border/40 max-w-2xl mx-auto"
        >
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-dt-border/30">
            <Terminal className="w-4 h-4 text-dt-accent" />
            <span className="text-sm font-semibold text-dt-text">Linux</span>
          </div>

          <div className="space-y-3">
            {CMDS.map((c) => (
              <div key={c.label} className="glass-light rounded-xl p-4 font-mono text-xs sm:text-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-dt-muted uppercase tracking-wider">{c.label}</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(c.cmd)}
                    className="text-[10px] text-dt-accent hover:text-dt-accent/80 transition-colors uppercase tracking-wider"
                  >
                    Copy
                  </button>
                </div>
                <code className="text-dt-text break-all">{c.cmd}</code>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <Btn href="#" primary><DownloadIcon className="w-4 h-4" />Download Latest</Btn>
            <Btn href="https://github.com/phattar4phan/dashtop"><Github className="w-4 h-4" />GitHub</Btn>
            <Btn href="https://github.com/phattar4phan/dashtop/blob/main/README.md"><BookOpen className="w-4 h-4" />Documentation</Btn>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
