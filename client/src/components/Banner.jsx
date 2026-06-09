import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const API = "http://localhost:5000";

function imgSrc(url) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/uploads"))
    return url.startsWith("/") ? `${API}${url}` : url;
  return url;
}

// ─── Reusable banner tile ─────────────────────────────────────────────────────
function BannerTile({ banner, height = 180, radius = 12, large = false }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.a
      href={banner.link || "#"}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ display: "block", position: "relative", borderRadius: radius, overflow: "hidden", height, textDecoration: "none", flexShrink: 0 }}
    >
      <img
        src={imgSrc(banner.image)}
        alt={banner.title || "Banner"}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transform: hovered ? "scale(1.04)" : "scale(1)", transition: "transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)" }}
      />
      <div style={{ position: "absolute", inset: 0, background: large ? "linear-gradient(to right, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.1) 65%, transparent 100%)" : "linear-gradient(to top, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.05) 60%, transparent 100%)" }} />
      {(banner.title || banner.subtitle || banner.buttonText) && (
        <div style={{ position: "absolute", ...(large ? { bottom: 20, left: 20, right: 20 } : { bottom: 14, left: 14, right: 14 }) }}>
          {banner.subtitle && <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase", color: "rgba(255,255,255,0.75)", margin: "0 0 4px" }}>{banner.subtitle}</p>}
          {banner.title    && <h3 style={{ fontSize: large ? 20 : 14, fontWeight: 800, color: "#fff", margin: "0 0 10px", lineHeight: 1.25 }}>{banner.title}</h3>}
          {banner.buttonText && (
            <span style={{ display: "inline-block", padding: large ? "8px 18px" : "5px 12px", background: "rgba(255,255,255,0.92)", color: "#1a1a1a", borderRadius: 6, fontSize: large ? 11 : 10, fontWeight: 700 }}>
              {banner.buttonText}
            </span>
          )}
        </div>
      )}
    </motion.a>
  );
}

// ─── Single Banner ────────────────────────────────────────────────────────────
export function SingleBanner({ banner }) {
  if (!banner || banner.isActive === false || !banner.image) return null;
  return <BannerTile banner={banner} height={200} radius={12} />;
}

// ─── Multi Banner ─────────────────────────────────────────────────────────────
export function MultiBanner({ banners }) {
  if (!Array.isArray(banners) || banners.length === 0) return null;
  const active = banners.filter(b => b.isActive !== false && b.image);
  if (active.length === 0) return null;

  if (active.length === 1) return <BannerTile banner={active[0]} height={200} radius={12} />;

  if (active.length === 2) return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      {active.map((b, i) => <BannerTile key={b.id || i} banner={b} height={180} radius={12} />)}
    </div>
  );

  if (active.length === 3) return (
    <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 12, alignItems: "stretch" }}>
      <BannerTile banner={active[0]} height={280} radius={12} large />
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <BannerTile banner={active[1]} height={134} radius={12} />
        <BannerTile banner={active[2]} height={134} radius={12} />
      </div>
    </div>
  );

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
      {active.map((b, i) => <BannerTile key={b.id || i} banner={b} height={160} radius={12} />)}
    </div>
  );
}

// ─── Slideshow Banner ─────────────────────────────────────────────────────────
export function SlideshowBanner({ banners, autoPlay = true, interval = 4000 }) {
  const [current, setCurrent] = useState(0);
  const active = Array.isArray(banners) ? banners.filter(b => b.isActive !== false && b.image) : [];

  useEffect(() => { setCurrent(0); }, [banners]);
  useEffect(() => {
    if (!autoPlay || active.length <= 1) return;
    const t = setInterval(() => setCurrent(c => (c + 1) % active.length), interval);
    return () => clearInterval(t);
  }, [active.length, autoPlay, interval]);

  if (active.length === 0) return null;
  const b = active[current];

  return (
    <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", height: 220 }}>
      <AnimatePresence mode="wait">
        <motion.a
          key={current}
          href={b.link || "#"}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{ display: "block", width: "100%", height: "100%", textDecoration: "none" }}
        >
          <img src={imgSrc(b.image)} alt={b.title || "Banner"} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.50) 0%, rgba(0,0,0,0.08) 60%, transparent 100%)" }} />
          {(b.title || b.subtitle || b.buttonText) && (
            <div style={{ position: "absolute", bottom: 20, left: 20, maxWidth: 300 }}>
              {b.subtitle  && <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.75)", margin: "0 0 5px" }}>{b.subtitle}</p>}
              {b.title     && <h2 style={{ fontSize: 18, fontWeight: 800, color: "#fff", margin: "0 0 10px", lineHeight: 1.2 }}>{b.title}</h2>}
              {b.buttonText && <span style={{ display: "inline-block", padding: "6px 16px", background: "#fff", color: "#1a1a1a", borderRadius: 6, fontSize: 11, fontWeight: 700 }}>{b.buttonText}</span>}
            </div>
          )}
        </motion.a>
      </AnimatePresence>
      {active.length > 1 && (
        <div style={{ position: "absolute", bottom: 12, right: 14, display: "flex", gap: 6, zIndex: 10 }}>
          {active.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} style={{ width: i === current ? 18 : 6, height: 6, borderRadius: 3, background: i === current ? "#fff" : "rgba(255,255,255,0.4)", border: "none", cursor: "pointer", padding: 0, transition: "all 0.3s" }} />
          ))}
        </div>
      )}
    </div>
  );
}