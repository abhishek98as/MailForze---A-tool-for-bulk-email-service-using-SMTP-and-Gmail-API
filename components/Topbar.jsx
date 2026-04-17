'use client';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSidebar } from '@/components/SidebarContext';
import { useTheme } from '@/components/ThemeContext';

export default function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { toggle } = useSidebar();
  const { theme, toggleTheme } = useTheme();

  const getPageTitle = () => {
    if (pathname === '/dashboard')             return { title: 'Dashboard',      sub: 'Overview of your email automation activity' };
    if (pathname === '/compose')              return { title: 'Compose & Send',  sub: 'Create a new campaign or send individual emails' };
    if (pathname === '/campaigns')            return { title: 'Campaigns',       sub: 'Track and manage all your sending campaigns' };
    if (pathname?.startsWith('/campaigns/')) return { title: 'Campaign Detail',  sub: 'Detailed stats and recipient list for this campaign' };
    if (pathname === '/recipients')           return { title: 'Recipients',       sub: 'Browse, filter and manage all recipients' };
    if (pathname === '/templates')            return { title: 'Templates',        sub: 'Create and reuse beautifully crafted email templates' };
    if (pathname === '/reports')              return { title: 'Reports',          sub: 'Deep dive into performance metrics and export data' };
    if (pathname === '/logs')                 return { title: 'Activity Logs',    sub: 'Full audit trail of every email event' };
    if (pathname === '/ai-assistant')         return { title: 'AI Assistant',     sub: 'Gemini-powered spam detection and email optimization' };
    if (pathname === '/settings')             return { title: 'Settings',         sub: 'Configure SMTP, IMAP, and application preferences' };
    return { title: 'MailForge Pro', sub: 'Enterprise Email Automation' };
  };

  const { title, sub } = getPageTitle();
  const isDark = theme === 'dark';

  return (
    <div className="topbar">
      <div className="mobile-menu-btn icon-btn" onClick={toggle} title="Menu">
        <i className="fa-solid fa-bars"></i>
      </div>
      <div>
        <div className="topbar-title" id="page-title">{title}</div>
        <div className="topbar-sub" id="page-sub">{sub}</div>
      </div>
      <div className="topbar-actions">
        <div className="info-chip">
          <i className="fa-solid fa-circle pulse" style={{ color: 'var(--success)', fontSize: '6px' }}></i>
          Live
        </div>
        <div className="icon-btn" title="Notifications">
          <i className="fa-solid fa-bell"></i>
          <span className="notif-dot"></span>
        </div>
        <div className="icon-btn" title="Refresh" onClick={() => router.refresh()}>
          <i className="fa-solid fa-rotate"></i>
        </div>

        {/* ─── THEME TOGGLE ─────────────────────────────── */}
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme"
        >
          <span className="theme-toggle-track">
            <span className="theme-toggle-thumb">
              {isDark
                ? <i className="fa-solid fa-moon"></i>
                : <i className="fa-solid fa-sun"></i>}
            </span>
          </span>
          <span className="theme-toggle-label">
            {isDark ? 'Dark' : 'Light'}
          </span>
        </button>

        <Link href="/compose" className="btn btn-primary">
          <i className="fa-solid fa-plus"></i> New Campaign
        </Link>
      </div>
    </div>
  );
}
