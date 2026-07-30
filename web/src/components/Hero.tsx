import { motion } from "framer-motion";
import { Download, BookOpen, Check } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 sm:py-32 lg:py-40">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto"
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

          <p className="mt-4 text-base text-dt-muted max-w-xl mx-auto leading-relaxed">
            Dashtop provides a fast, lightweight, browser-based interface for
            monitoring essential hardware metrics without the complexity of
            traditional monitoring suites.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
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
            className="mt-12 max-w-lg mx-auto"
          >
            <div className="brutal-card p-4 font-mono text-xs sm:text-sm text-left overflow-x-auto">
              <div className="flex items-center gap-2 mb-3 pb-3 border-b-2 border-dt-border">
                <span className="w-2.5 h-2.5 bg-red-500/80" />
                <span className="w-2.5 h-2.5 bg-yellow-500/80" />
                <span className="w-2.5 h-2.5 bg-green-500/80" />
                <span className="ml-2 text-dt-muted text-[10px]">Terminal</span>
              </div>
              <div className="space-y-1.5">
                <div>
                  <span className="text-dt-accent font-bold">$ </span>
                  <span className="text-dt-text">
                    curl -fsSL https://dashtop.phattar4phan.workers.dev/install.sh | sh
                  </span>
                </div>
                <div className="text-dt-muted text-xs leading-relaxed">
                  <div className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-dt-accent flex-shrink-0" />
                    Cloning git repository...
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-dt-accent flex-shrink-0" />
                    Installing daemon...
                  </div>
                  <div className="flex items-center gap-2 text-dt-accent font-bold">
                    <Check className="w-3 h-3 flex-shrink-0" />
                    Dashtop installed successfully!
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
