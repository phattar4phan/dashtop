import { motion } from "framer-motion";
import { Github, Users } from "lucide-react";

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

export default function Community() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Community</h2>
          <p className="mt-3 text-dt-muted max-w-lg mx-auto">Dashtop is completely free and open to everyone.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="glass rounded-3xl p-8 sm:p-12 border border-dt-border/40 max-w-3xl mx-auto text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-dt-accent/10 flex items-center justify-center text-dt-accent mx-auto mb-6">
            <Github className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold tracking-tight mb-4">Open Source</h3>
          <p className="text-dt-muted leading-relaxed max-w-md mx-auto mb-8">
            Dashtop is and always will be free and open source. Star the repo, submit a PR, or open an issue — every contribution helps.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Btn href="https://github.com/phattar4phan/dashtop" primary><Github className="w-4 h-4" />Star on GitHub</Btn>
            <Btn href="https://github.com/phattar4phan/dashtop"><Users className="w-4 h-4" />Contribute</Btn>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
