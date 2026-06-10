import { useState, useEffect } from 'react';
import API, { BASE_URL } from '../api';

/* Resolve a media URL safely — never double-prepend BASE_URL */
function resolveUrl(url) {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('//')) return url;
  return `${BASE_URL}${url}`;
}

export default function PromoBanner({ banner: bannerProp, style }) {
  const [banner, setBanner] = useState(bannerProp || null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (bannerProp) { setBanner(bannerProp); return; }
    API.get('/promo-banners')
      .then(res => {
        const data = res.data;
        if (Array.isArray(data) && data.length > 0) setBanner(data[0]);
      })
      .catch(() => {});
  }, [bannerProp]);

  if (!banner?.mediaUrl) return null;

  const src = resolveUrl(banner.mediaUrl);

  const media = banner.mediaType === 'video' ? (
    <video
      src={src}
      autoPlay loop muted playsInline
      style={{
        width: '100%', height: '100%',
        objectFit: 'cover', display: 'block',
        transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        transform: hovered ? 'scale(1.03)' : 'scale(1)',
      }}
    />
  ) : (
    <img
      src={src}
      alt="Promotional banner"
      style={{
        width: '100%', height: '100%',
        objectFit: 'cover', display: 'block',
        transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        transform: hovered ? 'scale(1.03)' : 'scale(1)',
      }}
    />
  );

  const card = (
    <div
      style={{
        /* ── Outer section padding ── */
        padding: 'clamp(16px, 3vw, 32px) clamp(16px, 5vw, 64px)',
        background: '#ffffff',
        ...style,
      }}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'relative',
          width: '100%',
          height: 'clamp(160px, 22vw, 280px)',
          borderRadius: 24,
          overflow: 'hidden',
          cursor: banner.link ? 'pointer' : 'default',
          /* Shadow that lifts on hover */
          boxShadow: hovered
            ? '0 24px 60px rgba(0,0,0,0.18), 0 8px 24px rgba(0,0,0,0.10)'
            : '0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)',
          transition: 'box-shadow 0.4s ease',
        }}
      >
        {/* Media */}
        {media}

        {/* Subtle dark vignette overlay for depth */}
        <div style={{
          position: 'absolute', inset: 0,
          background: [
            'linear-gradient(to bottom,',
            '  rgba(0,0,0,0.08) 0%,',
            '  transparent 35%,',
            '  transparent 65%,',
            '  rgba(0,0,0,0.18) 100%)',
          ].join(''),
          pointerEvents: 'none',
          borderRadius: 24,
        }} />

        {/* Top-left sheen highlight */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 50%)',
          pointerEvents: 'none',
          borderRadius: 24,
        }} />

        {/* Hover: subtle brightening */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(255,255,255,0.04)',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.4s ease',
          pointerEvents: 'none',
          borderRadius: 24,
        }} />

        {/* If banner has a link, show a small "Shop Now" pill bottom-right */}
        {banner.link && (
          <div style={{
            position: 'absolute',
            bottom: 18,
            right: 22,
            padding: '8px 18px',
            borderRadius: 100,
            background: hovered ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: '0.08em',
            color: '#111',
            textTransform: 'uppercase',
            transition: 'background 0.3s, transform 0.3s',
            transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
            boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            pointerEvents: 'none',
          }}>
            Shop Now
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <path d="M3 8H13M9 4L13 8L9 12" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
      </div>
    </div>
  );

  return banner.link
    ? <a href={banner.link} style={{ display: 'block', textDecoration: 'none' }}>{card}</a>
    : card;
}