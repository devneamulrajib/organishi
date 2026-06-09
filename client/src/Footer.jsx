import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const COLS = [
  {
    title: 'Shop',
    links: [
      { label: 'All Products',   href: '/products'          },
      { label: 'Nut Butters',    href: '/products?cat=butters' },
      { label: 'Cold-Pressed',   href: '/products?cat=oils' },
      { label: 'Gift Sets',      href: '/products?cat=gifts'},
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us',       href: '/about'   },
      { label: 'Our Farms',      href: '/farms'   },
      { label: 'Journal',        href: '/journal' },
      { label: 'Partnership',    href: '/partner' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'Contact',        href: '/contact'  },
      { label: 'Shipping Info',  href: '/shipping' },
      { label: 'Returns',        href: '/returns'  },
      { label: 'FAQ',            href: '/faq'      },
    ],
  },
];

const SOCIALS = [
  {
    label: 'Instagram',
    href: 'https://instagram.com',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    ),
  },
  {
    label: 'Twitter / X',
    href: 'https://x.com',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    label: 'Pinterest',
    href: 'https://pinterest.com',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
      </svg>
    ),
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap" />

      <footer style={{
        background: '#070a07',
        borderTop: '0.5px solid rgba(255,255,255,0.06)',
        fontFamily: "'DM Sans', sans-serif",
        position: 'relative', overflow: 'hidden',
      }}>

        {/* Subtle glow */}
        <div style={{
          position: 'absolute', top: -120, left: '50%', transform: 'translateX(-50%)',
          width: 600, height: 300, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(200,169,110,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* ── Top section ── */}
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          padding: 'clamp(56px,6vw,96px) clamp(24px,5vw,64px) 0',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr', gap: 'clamp(32px,4vw,64px)', alignItems: 'start' }}>

            {/* Brand column */}
            <div>
              <Link to="/" style={{ textDecoration: 'none' }}>
                <h2 style={{
                  fontFamily: "'DM Serif Display', Georgia, serif",
                  fontSize: 28, fontWeight: 400, color: '#fff',
                  margin: '0 0 14px', letterSpacing: '0.5px',
                }}>
                  Organishi
                </h2>
              </Link>
              <p style={{
                fontSize: 13, color: 'rgba(255,255,255,0.35)',
                lineHeight: 1.8, maxWidth: 240, margin: '0 0 28px', fontWeight: 300,
              }}>
                Pure ingredients, ancient techniques, zero compromise. Crafted for those who care about what goes into their body.
              </p>

              {/* Newsletter */}
              <div style={{ marginBottom: 32 }}>
                <div style={{ fontSize: 10, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 12 }}>
                  Stay in the loop
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    style={{
                      flex: 1, padding: '10px 16px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '0.5px solid rgba(255,255,255,0.12)',
                      borderRadius: 100, color: '#fff', fontSize: 12,
                      outline: 'none', fontFamily: "'DM Sans', sans-serif",
                      minWidth: 0,
                    }}
                    onFocus={e => e.target.style.borderColor = 'rgba(200,169,110,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                  />
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    style={{
                      padding: '10px 18px', borderRadius: 100,
                      background: '#c8a96e', border: 'none',
                      color: '#0d2318', fontSize: 11, fontWeight: 600,
                      letterSpacing: '1px', cursor: 'pointer',
                      fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap',
                    }}
                  >
                    Join
                  </motion.button>
                </div>
              </div>

              {/* Socials */}
              <div style={{ display: 'flex', gap: 10 }}>
                {SOCIALS.map(({ label, href, icon }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -2 }}
                    title={label}
                    style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: 'rgba(255,255,255,0.05)',
                      border: '0.5px solid rgba(255,255,255,0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'rgba(255,255,255,0.45)', textDecoration: 'none',
                      transition: 'color 0.2s, border-color 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#c8a96e'; e.currentTarget.style.borderColor = 'rgba(200,169,110,0.4)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                  >
                    {icon}
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Nav columns */}
            {COLS.map(({ title, links }) => (
              <div key={title}>
                <div style={{
                  fontSize: 10, fontWeight: 600, letterSpacing: '2.5px',
                  textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)',
                  marginBottom: 20,
                }}>
                  {title}
                </div>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {links.map(({ label, href }) => (
                    <li key={label}>
                      <Link to={href} style={{ textDecoration: 'none' }}>
                        <span
                          style={{
                            fontSize: 13, color: 'rgba(255,255,255,0.42)',
                            fontWeight: 300, transition: 'color 0.2s',
                            display: 'inline-block',
                          }}
                          onMouseEnter={e => e.target.style.color = '#fff'}
                          onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.42)'}
                        >
                          {label}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ── Divider ── */}
        <div style={{
          maxWidth: 1200, margin: '56px auto 0',
          borderTop: '0.5px solid rgba(255,255,255,0.06)',
        }} />

        {/* ── Bottom bar ── */}
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          padding: 'clamp(20px,3vw,28px) clamp(24px,5vw,64px)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 16,
        }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.5px' }}>
            © {year} Organishi. All rights reserved.
          </span>

          {/* Certifications */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            {['100% Organic', 'No Additives', 'Cold Pressed'].map(tag => (
              <span key={tag} style={{
                fontSize: 9, fontWeight: 600, letterSpacing: '1.5px',
                textTransform: 'uppercase', color: 'rgba(200,169,110,0.5)',
                padding: '4px 10px', borderRadius: 100,
                border: '0.5px solid rgba(200,169,110,0.2)',
              }}>
                {tag}
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy Policy', 'Terms of Service'].map(l => (
              <Link key={l} to="#" style={{ textDecoration: 'none' }}>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,0.55)'}
                  onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.2)'}>
                  {l}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Big ghost word */}
        <div style={{
          textAlign: 'center', padding: '0 0 clamp(20px,3vw,36px)',
          fontFamily: "'DM Serif Display', Georgia, serif",
          fontSize: 'clamp(56px,10vw,120px)', fontWeight: 400,
          color: 'rgba(255,255,255,0.025)', letterSpacing: '-4px',
          userSelect: 'none', lineHeight: 1, pointerEvents: 'none',
        }}>
          Organishi
        </div>
      </footer>
    </>
  );
}