import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const NAV = [
  { label: "Preview", href: "#dashboard" },
  { label: "Download", href: "#download" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkClass =
    "px-3 py-2 text-sm text-dt-muted hover:text-dt-text transition-colors rounded-lg hover:bg-dt-border/20";
  const mobileLinkClass =
    "py-2 text-sm text-dt-muted hover:text-dt-text transition-colors";

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass border-b border-dt-border/30" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 flex items-center justify-between h-16">
        <a
          href="#"
          className="flex items-center gap-2.5 text-dt-text font-bold text-lg tracking-tight"
        >
          <img src="/default.svg" alt="" className="w-5 h-5" />
          <span>Dashtop</span>
        </a>

        <div className="hidden md:flex items-center gap-1">
          {NAV.map((l) => (
            <a key={l.label} href={l.href} className={linkClass}>
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/dashboard" className="text-sm text-dt-muted hover:text-dt-text transition-colors">
            Dashboard
          </Link>
          <a
            href="https://github.com/phattar4phan/dashtop"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-dt-muted hover:text-dt-text transition-colors"
          >
            GitHub
          </a>
          <a
            href="#download"
            className="px-4 py-2 text-sm font-medium bg-dt-accent text-black rounded-lg hover:bg-dt-accent/90 transition-colors"
          >
            Download
          </a>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-dt-muted hover:text-dt-text transition-colors"
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-dt-border/30 overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-2">
              {NAV.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={mobileLinkClass}
                >
                  {l.label}
                </a>
              ))}
              <Link
                to="/dashboard"
                onClick={() => setOpen(false)}
                className={mobileLinkClass}
              >
                Dashboard
              </Link>
              <a
                href="https://github.com/phattar4phan/dashtop"
                target="_blank"
                rel="noopener noreferrer"
                className={mobileLinkClass}
              >
                GitHub
              </a>
              <a
                href="#download"
                onClick={() => setOpen(false)}
                className="mt-2 px-4 py-2 text-sm font-medium bg-dt-accent text-black rounded-lg text-center hover:bg-dt-accent/90 transition-colors"
              >
                Download
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
