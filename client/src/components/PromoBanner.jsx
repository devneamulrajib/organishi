import { useState, useEffect } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * PromoBanner
 * Full-width promotional banner — matches the style of the reference site.
 * Accepts either a single `banner` object prop (from homepage config)
 * or fetches the latest active banner automatically.
 *
 * Props:
 *   banner  — optional: { mediaUrl, mediaType, link } (passed from HomePage)
 *   style   — optional extra styles on the wrapper
 */
export default function PromoBanner({ banner: bannerProp, style }) {
  const [banner, setBanner] = useState(bannerProp || null);

  useEffect(() => {
    if (bannerProp) { setBanner(bannerProp); return; }
    fetch(`${API}/api/promo-banners`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data) && data.length > 0) setBanner(data[0]); })
      .catch(() => {});
  }, [bannerProp]);

  if (!banner?.mediaUrl) return null;

  const inner = banner.mediaType === 'video' ? (
    <video
      src={`${API}${banner.mediaUrl}`}
      autoPlay
      loop
      muted
      playsInline
      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
    />
  ) : (
    <img
      src={`${API}${banner.mediaUrl}`}
      alt="Promotional banner"
      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
    />
  );

  const wrapper = (
    <div
      style={{
        width: '100%',
        height: 'clamp(180px, 28vw, 320px)', /* same proportions as reference */
        overflow: 'hidden',
        borderRadius: 0,
        cursor: banner.link ? 'pointer' : 'default',
        ...style,
      }}
    >
      {inner}
    </div>
  );

  return banner.link
    ? <a href={banner.link} style={{ display: 'block', textDecoration: 'none' }}>{wrapper}</a>
    : wrapper;
}