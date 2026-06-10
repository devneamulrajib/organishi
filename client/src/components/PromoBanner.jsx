import { useState, useEffect } from 'react';
// Import our smart API instance and the BASE_URL for images/videos
import API, { BASE_URL } from '../api'; 

/**
 * PromoBanner
 * Full-width promotional banner — matches the style of the reference site.
 * Accepts either a single `banner` object prop (from homepage config)
 * or fetches the latest active banner automatically.
 */
export default function PromoBanner({ banner: bannerProp, style }) {
  const [banner, setBanner] = useState(bannerProp || null);

  useEffect(() => {
    if (bannerProp) { 
      setBanner(bannerProp); 
      return; 
    }
    
    // Using the smart API instance instead of raw fetch
    API.get('/promo-banners')
      .then(res => { 
        const data = res.data;
        if (Array.isArray(data) && data.length > 0) setBanner(data[0]); 
      })
      .catch(() => {});
  }, [bannerProp]);

  if (!banner?.mediaUrl) return null;

  // Updated to use BASE_URL for both video and image sources
  const inner = banner.mediaType === 'video' ? (
    <video
      src={`${BASE_URL}${banner.mediaUrl}`}
      autoPlay
      loop
      muted
      playsInline
      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
    />
  ) : (
    <img
      src={`${BASE_URL}${banner.mediaUrl}`}
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