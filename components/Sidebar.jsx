'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from '@/components/SidebarContext';

export default function Sidebar() {
  const pathname = usePathname();
  const { isOpen, close } = useSidebar();

  const isActive = (path) => pathname === path || pathname?.startsWith(path + '/');

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'show' : ''}`} onClick={close}></div>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-mark">
            <div className="logo-icon"><i className="fa-solid fa-paper-plane"></i></div>
            <div>
              <div className="logo-text">MailForge Pro</div>
              <div className="logo-sub">Email Automation</div>
            </div>
          </div>
          <div className="mobile-close-btn" onClick={close} title="Close sidebar">
             <i className="fa-solid fa-xmark"></i>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Overview</div>

          <Link href="/dashboard" onClick={close} className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}>
            <i className="fa-solid fa-gauge-high nav-icon"></i>
            Dashboard
          </Link>

          <div className="nav-section-label">Email</div>

          <Link href="/compose" onClick={close} className={`nav-item ${isActive('/compose') ? 'active' : ''}`}>
          <i className="fa-solid fa-pen-to-square nav-icon"></i>
          Compose & Send
        </Link>

          <Link href="/campaigns" onClick={close} className={`nav-item ${isActive('/campaigns') ? 'active' : ''}`}>
            <i className="fa-solid fa-layer-group nav-icon"></i>
            Campaigns
            <span className="nav-badge green">0</span>
          </Link>

          <Link href="/recipients" onClick={close} className={`nav-item ${isActive('/recipients') ? 'active' : ''}`}>
            <i className="fa-solid fa-users nav-icon"></i>
            Recipients
          </Link>

          <Link href="/templates" onClick={close} className={`nav-item ${isActive('/templates') ? 'active' : ''}`}>
            <i className="fa-solid fa-file-code nav-icon"></i>
            Templates
          </Link>

          <div className="nav-section-label">Analytics</div>

          <Link href="/reports" onClick={close} className={`nav-item ${isActive('/reports') ? 'active' : ''}`}>
            <i className="fa-solid fa-chart-line nav-icon"></i>
            Reports
          </Link>

          <Link href="/logs" onClick={close} className={`nav-item ${isActive('/logs') ? 'active' : ''}`}>
            <i className="fa-solid fa-scroll nav-icon"></i>
            Activity Logs
            <span className="nav-badge">0</span>
          </Link>

          <div className="nav-section-label">System</div>

          <Link href="/ai-assistant" onClick={close} className={`nav-item ${isActive('/ai-assistant') ? 'active' : ''}`}>
            <i className="fa-solid fa-wand-magic-sparkles nav-icon"></i>
            AI Assistant
          </Link>

          <Link href="/settings" onClick={close} className={`nav-item ${isActive('/settings') ? 'active' : ''}`}>
          <i className="fa-solid fa-gear nav-icon"></i>
          Settings
        </Link>
      </nav>

        <div className="sidebar-footer">
          <div className="user-card">
            <div className="user-avatar">AC</div>
            <div>
              <div className="user-name">Acme Corp</div>
              <div className="user-email">info@acmecorp.com</div>
            </div>
            <i className="fa-solid fa-ellipsis" style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: '12px' }}></i>
          </div>
        </div>
      </aside>
    </>
  );
}
