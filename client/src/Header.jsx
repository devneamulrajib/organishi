import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import API, { BASE_URL } from './api';

const NAV_LINKS = [
  { label: 'Products', href: '/products' },
  { label: 'About',    href: '/about'    },
  { label: 'Journal',  href: '/journal'  },
  { label: 'Contact',  href: '/contact'  },
];

export default function Header() {
  const [collapsed, setCollapsed]           = useState(false);
  const [scrolled, setScrolled]             = useState(false);
  const [cartCount, setCartCount]           = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [logoUrl, setLogoUrl]               = useState(null);
  const location = useLocation();

  useEffect(() => { setCollapsed(false); }, [location.pathname]);

  useEffect(() => {
    const fn = () => {
      setScrolled(window.scrollY > 20);
      const doc = document.documentElement;
      const progress = window.scrollY / (doc.scrollHeight - doc.clientHeight);
      setScrollProgress(isNaN(progress) ? 0 : Math.min(progress, 1));
    };
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    API.get('/settings')
      .then(res => {
        if (res.data?.logoUrl) setLogoUrl(`${BASE_URL}${res.data.logoUrl}`);
      })
      .catch(() => {});
  }, []);

  const isActive = (href) => location.pathname === href;

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap"
      />
      <style>{`
        * { box-sizing: border-box; }
        .hdr-navlink { text-decoration: none; }
        .hdr-btn { all: unset; cursor: pointer; }
        @media (max-width: 640px) {
          .hdr-root {
            left: 12px !important;
            right: 12px !important;
            transform: none !important;
            width: auto !important;
          }
          .hdr-pill { border-radius: 22px !important; }
          .hdr-top-row { padding: 11px 14px 11px 20px !important; }
          .hdr-logo-text { font-size: 15px !important; }
          .hdr-logo-img { height: 26px !important; }
          .hdr-desktop-nav { display: none !important; }
          .hdr-mobile-nav { display: flex !important; }
          .hdr-icon-btn { width: 40px !important; height: 40px !important; }
        }
        @media (min-width: 641px) {
          .hdr-mobile-nav { display: none !important; }
        }
      `}</style>

      <div
        className="hdr-root"
        style={{
          position: 'fixed',
          top: 18,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          width: 'max-content',
          maxWidth: 'calc(100vw - 32px)',
        }}
      >
        <motion.div
          className="hdr-pill"
          layout
          transition={{ type: 'spring', stiffness: 340, damping: 34 }}
          style={{
            background: 'rgba(10,10,10,0.92)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            border: '0.5px solid rgba(255,255,255,0.12)',
            borderRadius: 100,
            overflow: 'hidden',
            boxShadow: '0 12px 48px rgba(0,0,0,0.55), 0 1px 0 rgba(255,255,255,0.07) inset',
          }}
        >
          {/* ── Top row ── */}
          <div
            className="hdr-top-row"
            style={{ display: 'flex', alignItems: 'center', padding: '10px 14px 10px 18px', gap: 0 }}
          >
            {/* Logo: image + text */}
            <Link to="/" style={{ textDecoration: 'none', flexShrink: 0, marginRight: 20, display: 'flex', alignItems: 'center', gap: 9 }}>
              {logoUrl && (
                <img
                  src={logoUrl}
                  alt="Logo"
                  className="hdr-logo-img"
                  style={{ height: 30, width: 'auto', objectFit: 'contain', display: 'block' }}
                />
              )}
              <span
                className="hdr-logo-text"
                style={{
                  fontFamily: "'DM Serif Display', Georgia, serif",
                  fontSize: 17, fontWeight: 400, color: '#fff',
                  letterSpacing: '0.6px', whiteSpace: 'nowrap', lineHeight: 1,
                }}
              >
                Organishi
              </span>
            </Link>

            {/* Divider */}
            <div className="hdr-desktop-nav" style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.12)', marginRight: 12, flexShrink: 0 }} />

            {/* Desktop nav */}
            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.div
                  className="hdr-desktop-nav"
                  key="nav"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  style={{ display: 'flex', alignItems: 'center', gap: 2, overflow: 'hidden', whiteSpace: 'nowrap', flexShrink: 0, marginRight: 12 }}
                >
                  {NAV_LINKS.map(({ label, href }) => (
                    <Link key={href} to={href} className="hdr-navlink">
                      <motion.div
                        whileHover={{ background: 'rgba(255,255,255,0.09)' }}
                        style={{
                          padding: '7px 16px', borderRadius: 100, cursor: 'pointer',
                          background: isActive(href) ? 'rgba(200,169,110,0.18)' : 'transparent',
                          transition: 'background 0.2s',
                        }}
                      >
                        <span style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 13, fontWeight: 500,
                          color: isActive(href) ? '#c8a96e' : 'rgba(255,255,255,0.62)',
                          letterSpacing: '0.2px',
                        }}>
                          {label}
                        </span>
                      </motion.div>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Divider 2 */}
            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.div
                  className="hdr-desktop-nav"
                  key="div2"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.12)', marginRight: 12, flexShrink: 0 }}
                />
              )}
            </AnimatePresence>

            {/* Right icons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, marginLeft: 'auto' }}>

              {/* Collapse toggle */}
              <motion.button
                className="hdr-btn hdr-icon-btn"
                whileHover={{ background: 'rgba(255,255,255,0.12)' }}
                whileTap={{ scale: 0.90 }}
                onClick={() => setCollapsed(c => !c)}
                style={{
                  width: 38, height: 38, borderRadius: '50%',
                  background: collapsed ? 'rgba(200,169,110,0.18)' : 'rgba(255,255,255,0.07)',
                  border: `0.5px solid ${collapsed ? 'rgba(200,169,110,0.35)' : 'rgba(255,255,255,0.12)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: collapsed ? '#c8a96e' : 'rgba(255,255,255,0.7)',
                  transition: 'background 0.2s, border 0.2s, color 0.2s',
                }}
              >
                <AnimatePresence mode="wait">
                  {collapsed ? (
                    <motion.svg key="expand"
                      initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      width="15" height="15" viewBox="0 0 15 15" fill="none">
                      <path d="M2 4h11M2 7.5h11M2 11h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </motion.svg>
                  ) : (
                    <motion.svg key="collapse"
                      initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </motion.svg>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Cart */}
              <motion.button
                className="hdr-btn hdr-icon-btn"
                whileHover={{ background: 'rgba(255,255,255,0.12)' }}
                whileTap={{ scale: 0.90 }}
                style={{
                  width: 38, height: 38, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.07)',
                  border: '0.5px solid rgba(255,255,255,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', position: 'relative',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.div
                      initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                      style={{
                        position: 'absolute', top: 5, right: 5,
                        width: 8, height: 8, borderRadius: '50%',
                        background: '#c8a96e', border: '1.5px solid rgba(10,10,10,0.9)',
                      }}
                    />
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Gold dot when collapsed */}
              <AnimatePresence>
                {collapsed && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                    style={{
                      width: 7, height: 7, borderRadius: '50%',
                      background: '#c8a96e', boxShadow: '0 0 10px #c8a96eaa',
                      flexShrink: 0, marginLeft: 2,
                    }}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ── Mobile nav ── */}
          <div
            className="hdr-mobile-nav"
            style={{
              display: 'none',
              flexDirection: 'column',
              padding: '0 12px 12px', gap: 2,
              borderTop: '0.5px solid rgba(255,255,255,0.08)',
            }}
          >
            {NAV_LINKS.map(({ label, href }) => (
              <Link key={href} to={href} style={{ textDecoration: 'none' }}>
                <motion.div
                  whileHover={{ background: 'rgba(255,255,255,0.07)' }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    padding: '12px 16px', borderRadius: 14,
                    background: isActive(href) ? 'rgba(200,169,110,0.14)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer',
                  }}
                >
                  <span style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14, fontWeight: 500,
                    color: isActive(href) ? '#c8a96e' : 'rgba(255,255,255,0.72)',
                    letterSpacing: '0.2px',
                  }}>
                    {label}
                  </span>
                  {isActive(href) && (
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#c8a96e', boxShadow: '0 0 6px #c8a96e99' }} />
                  )}
                </motion.div>
              </Link>
            ))}
          </div>

          {/* ── Scroll progress bar ── */}
          <AnimatePresence>
            {scrolled && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ height: 2, background: 'rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden' }}
              >
                <motion.div
                  style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(90deg, transparent, #c8a96e 40%, #e8c98e, #c8a96e 60%, transparent)',
                    transformOrigin: 'left', scaleX: scrollProgress,
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
}