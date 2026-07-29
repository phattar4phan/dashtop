import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "Which operating systems are supported?",
    a: "Dashtop supports only Linux. The monitoring daemon runs natively on Linux, and the web dashboard can be accessed from any browser on any device.",
  },
  {
    q: "How do I install Dashtop?",
    a: "Installation is a single command via curl or wget. Visit the Download section above for installation guidance.",
  },
  {
    q: "How often does the dashboard update?",
    a: "The dashboard updates in real time through a WebSocket connection. Refresh at every 2000ms (2s), not too much workload and is still real-time.",
  },
  {
    q: "Can I monitor a remote system?",
    a: "Yes. Dashtop can be configured to bind the dashboard to a network interface, allowing you to monitor any system from another device on your local network. Remote access over the internet is supported with appropriate firewall and authentication configuration.",
  },
  {
    q: "Does Dashtop collect or send any data?",
    a: "No. Dashtop does not collect any of your data nor sending any telemetry data for analytic. Unless you host the app to third-party platform to access the site remotely, they might be collecting some of your data specified in their Terms of Use and Privacy Policy.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 sm:py-28 pb-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">FAQ</h2>
          <p className="mt-3 text-dt-muted max-w-lg mx-auto">Frequently Asked Questions</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto space-y-3"
        >
          {FAQS.map((faq, i) => (
            <div key={i} className="glass rounded-2xl overflow-hidden border border-dt-border/30">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-medium text-dt-text pr-4">{faq.q}</span>
                <motion.span
                  animate={{ rotate: open === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-dt-muted flex-shrink-0"
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.span>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 text-sm text-dt-muted leading-relaxed border-t border-dt-border/20 pt-4">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
