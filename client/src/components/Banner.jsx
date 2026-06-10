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
function BannerTile({ banner, height = "100%", radius = 14, large = false, style = {} }) {
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
      style={{
        display: "block",
        position: "relative",
        borderRadius: radius,
        overflow: "hidden",
        height,
        textDecoration: "none",
        flexShrink: 0,
        ...style,
      }}
    >
      <img
        src={imgSrc(banner.image)}
        alt={banner.title || "Banner"}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          transform: hovered ? "scale(1.04)" : "scale(1)",
          transition: "transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)",
        }}
      />
      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: large
            ? "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)"
            : "linear-gradient(to top, rgba(0,0,0,0.50) 0%, rgba(0,0,0,0.05) 55%, transparent 100%)",
        }}
      />
      {(banner.title || banner.subtitle || banner.buttonText) && (
        <div
          style={{
            position: "absolute",
            bottom: large ? 20 : 14,
            left: large ? 20 : 14,
            right: large ? 20 : 14,
          }}
        >
          {banner.subtitle && (
            <p style={{
              fontSize: 9, fontWeight: 700, letterSpacing: "1.8px",
              textTransform: "uppercase", color: "rgba(255,255,255,0.75)", margin: "0 0 4px",
            }}>
              {banner.subtitle}
            </p>
          )}
          {banner.title && (
            <h3 style={{
              fontSize: large ? 18 : 13, fontWeight: 700, color: "#fff",
              margin: "0 0 10px", lineHeight: 1.25,
            }}>
              {banner.title}
            </h3>
          )}
          {banner.buttonText && (
            <span style={{
              display: "inline-block",
              padding: large ? "7px 16px" : "5px 12px",
              background: "rgba(255,255,255,0.92)",
              color: "#1a1a1a",
              borderRadius: 6,
              fontSize: large ? 11 : 10,
              fontWeight: 700,
            }}>
              {banner.buttonText}
            </span>
          )}
        </div>
      )}
    </motion.a>
  );
}

// ─── Single Banner ─────────────────────────────────────────────────────────────
// Designed to fill whatever container it's placed in — use it inside a sized wrapper.
// Pass `height` prop to control height (default 240px).
export function SingleBanner({ banner, height = 240, radius = 14 }) {
  if (!banner || banner.isActive === false || !banner.image) return null;
  return (
    <BannerTile
      banner={banner}
      height={height}
      radius={radius}
      large
      style={{ width: "100%" }}
    />
  );
}

// ─── Multi Banner ─────────────────────────────────────────────────────────────
// 1 banner  → full-width tall tile
// 2 banners → two equal columns, side-by-side, full-width
// 3 banners → large left + two stacked right (matches screenshot 1)
// 4+        → 2×2 grid
export function MultiBanner({ banners, height = 460 }) {
  if (!Array.isArray(banners) || banners.length === 0) return null;
  const active = banners.filter((b) => b.isActive !== false && b.image);
  if (active.length === 0) return null;

  if (active.length === 1) {
    return (
      <BannerTile
        banner={active[0]}
        height={height}
        radius={14}
        large
        style={{ width: "100%" }}
      />
    );
  }

  if (active.length === 2) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, height }}>
        {active.map((b, i) => (
          <BannerTile key={b.id || i} banner={b} height="100%" radius={14} large />
        ))}
      </div>
    );
  }

  if (active.length === 3) {
    const smallH = (height - 10) / 2; // two small tiles + gap
    return (
      <div style={{ display: "grid", gridTemplateColumns: "1.55fr 1fr", gap: 10, height }}>
        {/* Large left */}
        <BannerTile banner={active[0]} height="100%" radius={14} large />
        {/* Two stacked right */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <BannerTile banner={active[1]} height={smallH} radius={14} />
          <BannerTile banner={active[2]} height={smallH} radius={14} />
        </div>
      </div>
    );
  }

  // 4+ → 2×2 grid
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
      gap: 10,
    }}>
      {active.map((b, i) => (
        <BannerTile key={b.id || i} banner={b} height={200} radius={14} />
      ))}
    </div>
  );
}

// ─── Slideshow Banner ─────────────────────────────────────────────────────────
export function SlideshowBanner({ banners, autoPlay = true, interval = 4000, height = 260 }) {
  const [current, setCurrent] = useState(0);
  const active = Array.isArray(banners)
    ? banners.filter((b) => b.isActive !== false && b.image)
    : [];

  useEffect(() => { setCurrent(0); }, [banners]);
  useEffect(() => {
    if (!autoPlay || active.length <= 1) return;
    const t = setInterval(() => setCurrent((c) => (c + 1) % active.length), interval);
    return () => clearInterval(t);
  }, [active.length, autoPlay, interval]);

  if (active.length === 0) return null;
  const b = active[current];

  return (
    <div style={{ position: "relative", borderRadius: 14, overflow: "hidden", height }}>
      <AnimatePresence mode="wait">
        <motion.a
          key={current}
          href={b.link || "#"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{ display: "block", width: "100%", height: "100%", textDecoration: "none" }}
        >
          <img
            src={imgSrc(b.image)}
            alt={b.title || "Banner"}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to right, rgba(0,0,0,0.50) 0%, rgba(0,0,0,0.08) 60%, transparent 100%)",
          }} />
          {(b.title || b.subtitle || b.buttonText) && (
            <div style={{ position: "absolute", bottom: 22, left: 22, maxWidth: 320 }}>
              {b.subtitle && (
                <p style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: "2px",
                  textTransform: "uppercase", color: "rgba(255,255,255,0.75)", margin: "0 0 5px",
                }}>
                  {b.subtitle}
                </p>
              )}
              {b.title && (
                <h2 style={{
                  fontSize: 20, fontWeight: 700, color: "#fff",
                  margin: "0 0 12px", lineHeight: 1.2,
                }}>
                  {b.title}
                </h2>
              )}
              {b.buttonText && (
                <span style={{
                  display: "inline-block", padding: "7px 18px",
                  background: "#fff", color: "#1a1a1a", borderRadius: 7,
                  fontSize: 11, fontWeight: 700,
                }}>
                  {b.buttonText}
                </span>
              )}
            </div>
          )}
        </motion.a>
      </AnimatePresence>

      {active.length > 1 && (
        <div style={{
          position: "absolute", bottom: 14, right: 16,
          display: "flex", gap: 6, zIndex: 10,
        }}>
          {active.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                width: i === current ? 20 : 6,
                height: 6,
                borderRadius: 3,
                background: i === current ? "#fff" : "rgba(255,255,255,0.4)",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "all 0.3s",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}