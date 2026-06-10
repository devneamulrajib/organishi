import { useState, useEffect } from 'react';
import API, { BASE_URL } from '../api';

function resolveUrl(url) {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('//')) return url;
  return `${BASE_URL}${url}`;
}

/* ── Typewriter hook — must be called at the top level of a component ── */
function useTypewriter(text = '', delay = 300, speed = 50) {
  const [displayText, setDisplayText] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!text) { setDisplayText(''); setDone(true); return; }
    setDisplayText('');
    setDone(false);
    let index = 0;
    let timer;
    const start = setTimeout(() => {
      timer = setInterval(() => {
        index += 1;
        setDisplayText(text.slice(0, index));
        if (index >= text.length) { clearInterval(timer); setDone(true); }
      }, speed);
    }, delay);
    return () => { clearTimeout(start); clearInterval(timer); };
  }, [text, delay, speed]);

  return { displayText, done };
}

/* ── FadeUp — no hooks, just style based on prop ── */
function FadeUp({ children, visible, transitionDelay = '0s' }) {
  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(12px)',
      transition: `opacity 0.5s ease ${transitionDelay}, transform 0.5s ease ${transitionDelay}`,
    }}>
      {children}
    </div>
  );
}

export default function PromoBanner({ banner: bannerProp, style }) {
  const [banner, setBanner] = useState(bannerProp || null);
  const [hovered, setHovered] = useState(false);
  const [textVisible, setTextVisible] = useState(false);

  /* Typewriter called unconditionally at top level — safe */
  const { displayText, done } = useTypewriter(banner?.title || '', 300, 50);

  useEffect(() => {
    if (bannerProp) { setBanner(bannerProp); return; }
    API.get('/promo-banners')
      .then(res => {
        const data = res.data;
        if (Array.isArray(data) && data.length > 0) setBanner(data[0]);
      })
      .catch(() => {});
  }, [bannerProp]);

  /* Trigger text entrance after mount */
  useEffect(() => {
    if (!banner) return;
    const t = setTimeout(() => setTextVisible(true), 80);
    return () => clearTimeout(t);
  }, [banner]);

  if (!banner?.mediaUrl) return null;

  const src = resolveUrl(banner.mediaUrl);
  const isVideo = banner.mediaType === 'video'
    || /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(src);

  const align = banner.textAlign || 'left';
  const color = banner.textColor || '#ffffff';

  const gradientDir = align === 'right' ? 'to left'
    : align === 'center' ? 'to bottom'
    : 'to right';

  const posStyle = align === 'center'
    ? { left: '50%', top: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }
    : align === 'right'
    ? { right: 32, left: 'auto', bottom: 28, textAlign: 'right' }
    : { left: 32, right: 'auto', bottom: 28, textAlign: 'left' };

  const hasText = banner.title || banner.subtitle;

  const card = (
    <div style={{ padding: 'clamp(12px, 2vw, 28px) clamp(16px, 5vw, 64px)', background: '#ffffff', ...style }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'relative',
          width: '100%',
          height: 'clamp(160px, 22vw, 280px)',
          borderRadius: 22,
          overflow: 'hidden',
          cursor: banner.link ? 'pointer' : 'default',
          boxShadow: hovered
            ? '0 24px 60px rgba(0,0,0,0.18), 0 8px 24px rgba(0,0,0,0.10)'
            : '0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)',
          transition: 'box-shadow 0.4s ease',
        }}
      >
        {/* ── Media ── */}
        {isVideo ? (
          <video
            src={src}
            autoPlay loop muted playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <img
            src={src}
            alt={banner.title || 'Banner'}
            style={{
              width: '100%', height: '100%', objectFit: 'cover', display: 'block',
              transform: hovered ? 'scale(1.03)' : 'scale(1)',
              transition: 'transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)',
            }}
          />
        )}

        {/* ── Gradient scrim ── */}
        {hasText && (
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: `linear-gradient(${gradientDir}, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.18) 55%, transparent 100%)`,
          }} />
        )}

        {/* ── Text block ── */}
        {hasText && (
          <div style={{ position: 'absolute', zIndex: 3, maxWidth: 460, ...posStyle }}>

            {/* Subtitle */}
            {banner.subtitle && (
              <FadeUp visible={textVisible} transitionDelay="0.1s">
                <p style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: '2.5px',
                  textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)',
                  margin: '0 0 8px',
                }}>
                  {banner.subtitle}
                </p>
              </FadeUp>
            )}

            {/* Title — typewriter */}
            {banner.title && (
              <FadeUp visible={textVisible} transitionDelay="0.2s">
                <h2 style={{
                  fontSize: 'clamp(18px, 2.6vw, 30px)',
                  fontWeight: 700,
                  color,
                  lineHeight: 1.2,
                  margin: 0,
                  letterSpacing: '-0.2px',
                }}>
                  {displayText}
                  {!done && (
                    <span style={{
                      display: 'inline-block',
                      width: 2,
                      height: '0.85em',
                      background: color,
                      marginLeft: 2,
                      verticalAlign: 'middle',
                      animation: 'twblink 0.7s step-end infinite',
                    }} />
                  )}
                </h2>
              </FadeUp>
            )}
          </div>
        )}

        {/* Sheen */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 22, pointerEvents: 'none',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%)',
        }} />

        <style>{`@keyframes twblink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
      </div>
    </div>
  );

  return banner.link
    ? <a href={banner.link} style={{ display: 'block', textDecoration: 'none' }}>{card}</a>
    : card;
}