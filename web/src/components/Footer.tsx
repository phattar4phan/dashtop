import { Github, BookOpen, Download } from "lucide-react";

const LINKS = [
  {
    title: "Product",
    items: [
      { label: "Download", href: "#download", icon: <Download className="w-3.5 h-3.5" /> },
      { label: "Documentation", href: "https://github.com/phattar4phan/dashtop/blob/main/README.md", icon: <BookOpen className="w-3.5 h-3.5" /> },
    ],
  },
  {
    title: "Community",
    items: [
      { label: "GitHub", href: "https://github.com/phattar4phan/dashtop", icon: <Github className="w-3.5 h-3.5" /> },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-dt-border/30">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <img src="/default.svg" alt="" className="w-6 h-6" />
              <span className="font-bold text-dt-text text-lg">Dashtop</span>
            </div>
            <p className="text-sm text-dt-muted leading-relaxed max-w-xs">
              Real-time hardware monitoring for the modern web.
            </p>
          </div>
          {LINKS.map((g) => (
            <div key={g.title}>
              <h4 className="text-xs font-semibold text-dt-muted uppercase tracking-wider mb-4">{g.title}</h4>
              <ul className="space-y-2.5">
                {g.items.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      target={l.href.startsWith("http") ? "_blank" : undefined}
                      rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="inline-flex items-center gap-2 text-sm text-dt-muted hover:text-dt-text transition-colors"
                    >
                      <span className="text-dt-accent/70">{l.icon}</span>
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-dt-border/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-dt-muted/60">
            &copy; {new Date().getFullYear()} Dashtop. Open source under the MIT License.
          </p>
          <div className="flex items-center gap-4">
            <a href="https://github.com/phattar4phan/dashtop" target="_blank" rel="noopener noreferrer" className="text-xs text-dt-muted/60 hover:text-dt-muted transition-colors">GitHub</a>
            <a href="https://github.com/phattar4phan/dashtop/blob/main/README.md" className="text-xs text-dt-muted/60 hover:text-dt-muted transition-colors">Documentation</a>
            <a href="#download" className="text-xs text-dt-muted/60 hover:text-dt-muted transition-colors">Download</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
