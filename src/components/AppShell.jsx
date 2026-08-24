import { BarChart3, Columns3, Sparkles } from "lucide-react";

const NAV_ITEMS = [
  { id: "board", label: "Kanban board", icon: Columns3 },
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
];

export default function AppShell({ page, onNavigate, children }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#board" onClick={() => onNavigate("board")}>
          <span className="brand-mark"><Sparkles size={19} /></span>
          <span>taskflow</span>
        </a>

        <nav className="main-nav" aria-label="Main navigation">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <a
              href={`#${id}`}
              className={page === id ? "nav-item active" : "nav-item"}
              aria-current={page === id ? "page" : undefined}
              key={id}
              onClick={() => onNavigate(id)}
            >
              <Icon size={19} />
              <span>{label}</span>
            </a>
          ))}
        </nav>

        <div className="sidebar-note">
          <span className="note-icon"><Sparkles size={17} /></span>
          <div>
            <strong>Your work is saved</strong>
            <p>Changes stay on this device.</p>
          </div>
        </div>
      </aside>

      <div className="app-main">
        <header className="mobile-header">
          <a className="brand" href="#board" onClick={() => onNavigate("board")}>
            <span className="brand-mark"><Sparkles size={17} /></span>
            <span>taskflow</span>
          </a>
          <nav aria-label="Mobile navigation">
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
              <a
                href={`#${id}`}
                className={page === id ? "mobile-nav-link active" : "mobile-nav-link"}
                aria-label={label}
                key={id}
                onClick={() => onNavigate(id)}
              >
                <Icon size={19} />
              </a>
            ))}
          </nav>
        </header>
        {children}
      </div>
    </div>
  );
}
