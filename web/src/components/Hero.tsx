import { motion } from "framer-motion";
import { Download, BookOpen, Github, Terminal } from "lucide-react";

const CMDS = [
  { label: "curl", cmd: "curl -fsSL https://dashtop.phattar4phan.workers.dev/install.sh | sh" },
  { label: "wget", cmd: "wget -qO- https://dashtop.phattar4phan.workers.dev/install.sh | sh" },
];

export default function Hero() {
  return (
    <section id="download" className="relative min-h-screen flex items-center justify-center pt-16">
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 sm:py-32 lg:py-40">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-2xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 border-2 border-dt-border text-xs font-bold text-dt-accent mb-8"
          >
            <span className="w-1.5 h-1.5 bg-dt-accent" />
            Opened Source
          </motion.div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-dt-text leading-[1.05]">
            Dashtop
          </h1>

          <p className="mt-6 text-xl sm:text-2xl font-medium text-dt-muted">
            A modern web dashboard for real-time hardware monitoring.
          </p>

          <p className="mt-4 text-base text-dt-muted leading-relaxed">
            Dashtop provides a fast, lightweight, browser-based interface for
            monitoring essential hardware metrics without the complexity of
            traditional monitoring suites.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <motion.a
              href="#download"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-dt-accent text-dt-accent-text font-bold border-2 border-dt-border text-sm hover:bg-dt-accent/90 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </motion.a>
            <motion.a
              href="https://github.com/phattar4phan/dashtop"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-dt-border text-dt-text font-bold text-sm hover:bg-dt-surface transition-colors"
            >
              <Github className="w-4 h-4" />
              GitHub
            </motion.a>
            <motion.a
              href="https://github.com/phattar4phan/dashtop/blob/main/README.md"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-dt-border text-dt-text font-bold text-sm hover:bg-dt-surface transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              Documentation
            </motion.a>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-12"
          >
            <div className="flex items-center gap-2 mb-3">
              <Terminal className="w-4 h-4 text-dt-accent" />
              <span className="text-sm font-semibold text-dt-text">Linux</span>
            </div>

            <div className="space-y-3">
              {CMDS.map((c) => (
                <div key={c.label} className="brutal-card p-4 font-mono text-xs sm:text-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-dt-muted uppercase tracking-wider">{c.label}</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(c.cmd)}
                      className="text-[10px] text-dt-accent hover:text-dt-accent/80 transition-colors uppercase tracking-wider font-bold"
                    >
                      Copy
                    </button>
                  </div>
                  <code className="text-dt-text break-all">{c.cmd}</code>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
