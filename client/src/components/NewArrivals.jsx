import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import API, { BASE_URL } from '../api';

/* ── Utility: strip accidental BASE_URL prefix from Cloudinary / absolute URLs ── */
function cleanImageUrl(url) {
  if (!url) return url;
  // If it's already a full URL (starts with http/https), return as-is
  if (/^https?:\/\//i.test(url)) return url;
  // If it starts with //, return as-is (protocol-relative)
  if (url.startsWith('//')) return url;
  // Otherwise it's a relative path — prepend BASE_URL
  return `${BASE_URL}${url}`;
}

/* ── Sanitize every product's image fields ── */
function sanitizeProduct(p) {
  return {
    ...p,
    // handle both `image` and `images` array patterns
    image:  cleanImageUrl(p.image),
    images: Array.isArray(p.images) ? p.images.map(cleanImageUrl) : p.images,
    imageUrl: cleanImageUrl(p.imageUrl),
  };
}

export default function NewArrivals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    API.get('/products', { params: { tags: 'new', limit: 8 } })
      .then((res) => {
        const data = res.data;
        const list = Array.isArray(data) ? data : (data.products || []);
        // Sanitize all image URLs before storing
        setProducts(list.map(sanitizeProduct));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    setTimeout(checkScroll, 100);
  }, [products]);

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (el) el.scrollBy({ left: dir * 280, behavior: "smooth" });
  };

  if (!loading && products.length === 0) return null;

  return (
    <section style={{
      position: "relative",
      padding: "80px 0 90px",
      background: "#ffffff",
      borderTop: "1px solid #f0f0f0",
      overflow: "hidden",
    }}>

      {/* ══ BOTANICAL BACKGROUND ══ */}
      <svg
        aria-hidden="true"
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          pointerEvents: "none",
        }}
        viewBox="0 0 1400 650"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g stroke="#b8d4c2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M-30 620 C40 560 80 480 100 400 C120 320 115 250 130 180 C145 110 170 60 190 20" strokeWidth="2.5" opacity="0.6"/>
          <path d="M65 510 C30 490 5 465 -15 445" strokeWidth="1.8" opacity="0.55"/>
          <path d="M-15 445 C-35 425 -40 400 -25 385 C-10 370 10 378 15 395 C20 412 5 435 -15 445Z" strokeWidth="1.5" opacity="0.5"/>
          <path d="M-15 445 C-18 420 -12 400 -5 390" strokeWidth="1" opacity="0.4"/>
          <path d="M78 475 C110 455 135 430 155 405" strokeWidth="1.8" opacity="0.55"/>
          <path d="M155 405 C178 385 192 358 180 342 C168 326 148 332 142 350 C136 368 145 390 155 405Z" strokeWidth="1.5" opacity="0.5"/>
          <path d="M155 405 C158 380 162 358 168 345" strokeWidth="1" opacity="0.4"/>
          <path d="M90 420 C55 400 30 378 10 358" strokeWidth="1.8" opacity="0.5"/>
          <path d="M10 358 C-12 338 -18 310 -5 296 C8 282 28 290 32 308 C36 326 24 348 10 358Z" strokeWidth="1.5" opacity="0.45"/>
          <path d="M100 360 C132 338 158 312 172 285" strokeWidth="1.8" opacity="0.5"/>
          <path d="M172 285 C192 262 196 234 184 220 C172 206 153 214 150 232 C147 250 158 272 172 285Z" strokeWidth="1.5" opacity="0.45"/>
          <path d="M112 295 C78 274 52 250 35 228" strokeWidth="1.6" opacity="0.45"/>
          <path d="M35 228 C15 208 10 182 22 168 C34 154 52 162 54 180 C56 198 46 218 35 228Z" strokeWidth="1.4" opacity="0.4"/>
          <path d="M122 230 C150 208 168 182 175 155" strokeWidth="1.6" opacity="0.45"/>
          <path d="M175 155 C192 132 195 106 184 93 C173 80 156 88 154 106 C152 124 162 142 175 155Z" strokeWidth="1.4" opacity="0.4"/>
          <circle cx="60" cy="200" r="4" strokeWidth="1.3" opacity="0.4"/>
          <circle cx="70" cy="192" r="3.5" strokeWidth="1.3" opacity="0.38"/>
          <circle cx="50" cy="188" r="3" strokeWidth="1.3" opacity="0.36"/>
        </g>
        <g stroke="#b8d4c2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1430 650 C1370 590 1340 510 1320 440 C1300 370 1295 300 1280 230 C1265 160 1240 90 1220 30" strokeWidth="2.5" opacity="0.6"/>
          <path d="M1335 520 C1300 500 1270 475 1248 450" strokeWidth="1.8" opacity="0.55"/>
          <path d="M1248 450 C1224 428 1218 400 1232 386 C1246 372 1268 382 1270 400 C1272 418 1260 440 1248 450Z" strokeWidth="1.5" opacity="0.5"/>
          <path d="M1348 480 C1382 460 1410 434 1430 408" strokeWidth="1.8" opacity="0.55"/>
          <path d="M1430 408 C1452 384 1455 356 1442 342 C1429 328 1410 338 1408 356 C1406 374 1418 396 1430 408Z" strokeWidth="1.5" opacity="0.5"/>
          <path d="M1305 400 C1270 380 1245 355 1228 330" strokeWidth="1.8" opacity="0.5"/>
          <path d="M1228 330 C1208 308 1204 280 1218 266 C1232 252 1252 262 1252 280 C1252 298 1240 318 1228 330Z" strokeWidth="1.5" opacity="0.45"/>
          <path d="M1318 360 C1350 336 1372 308 1382 278" strokeWidth="1.8" opacity="0.5"/>
          <path d="M1382 278 C1400 254 1402 226 1390 212 C1378 198 1360 208 1360 226 C1360 244 1372 264 1382 278Z" strokeWidth="1.5" opacity="0.45"/>
          <circle cx="1360" cy="210" r="4" strokeWidth="1.3" opacity="0.4"/>
          <circle cx="1372" cy="202" r="3.5" strokeWidth="1.3" opacity="0.38"/>
          <circle cx="1352" cy="198" r="3" strokeWidth="1.3" opacity="0.36"/>
        </g>
        <g stroke="#c5dfd0" fill="none" strokeLinecap="round" opacity="0.45">
          <path d="M400 30 C410 50 415 75 418 100" strokeWidth="1.4"/>
          <path d="M406 55 C394 48 384 52 382 62" strokeWidth="1"/>
          <path d="M410 72 C422 65 430 68 428 78" strokeWidth="1"/>
          <ellipse cx="380" cy="65" rx="9" ry="14" transform="rotate(-25 380 65)" strokeWidth="1.1"/>
          <ellipse cx="430" cy="80" rx="9" ry="14" transform="rotate(20 430 80)" strokeWidth="1.1"/>
          <path d="M980 20 C972 42 968 68 966 95" strokeWidth="1.4"/>
          <path d="M975 46 C987 38 996 42 994 53" strokeWidth="1"/>
          <path d="M971 68 C959 62 952 66 954 76" strokeWidth="1"/>
          <ellipse cx="996" cy="56" rx="9" ry="14" transform="rotate(20 996 56)" strokeWidth="1.1"/>
          <ellipse cx="952" cy="78" rx="9" ry="14" transform="rotate(-25 952 78)" strokeWidth="1.1"/>
        </g>
        <g fill="#a8c8b6" opacity="0.4">
          {[
            [280,80],[340,45],[500,60],[660,30],[820,55],[900,35],
            [1060,70],[1120,40],[1180,85],[230,450],[310,520],
            [480,580],[700,540],[920,560],[1100,510],[450,150],
            [620,120],[800,140],[1000,110],
          ].map(([x,y],i) => (
            <circle key={i} cx={x} cy={y} r={i%4===0?2.2:1.5}/>
          ))}
        </g>
      </svg>

      {/* ══ CONTENT ══ */}
      <div style={{
        maxWidth: 1320,
        margin: "0 auto",
        padding: "0 5%",
        position: "relative",
        zIndex: 1,
      }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 40,
            flexWrap: "wrap",
            gap: 14,
          }}
        >
          {/* Left */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ position: "relative", display: "inline-flex" }}>
              <span style={{
                width: 10, height: 10, borderRadius: "50%",
                background: "#00bcd4", display: "block",
              }}/>
              <span style={{
                position: "absolute", inset: 0, borderRadius: "50%",
                background: "rgba(0,188,212,0.35)",
                animation: "na-ping 1.8s ease infinite",
              }}/>
            </span>
            <h2 style={{
              fontSize: 22, fontWeight: 800,
              color: "#1a1a1a", margin: 0,
              letterSpacing: "-0.3px",
            }}>
              New Arrivals
            </h2>
          </div>

          {/* Right: arrows + view all */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {[-1, 1].map((dir) => (
              <button
                key={dir}
                onClick={() => scroll(dir)}
                aria-label={dir === -1 ? "Scroll left" : "Scroll right"}
                style={{
                  width: 34, height: 34, borderRadius: "50%",
                  border: "1.5px solid #e5e7eb",
                  background: "#fff",
                  cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#1a237e",
                  transition: "all 0.18s",
                  opacity: (dir === -1 && !canScrollLeft) || (dir === 1 && !canScrollRight) ? 0.32 : 1,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#1a237e";
                  e.currentTarget.style.borderColor = "#1a237e";
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#fff";
                  e.currentTarget.style.borderColor = "#e5e7eb";
                  e.currentTarget.style.color = "#1a237e";
                }}
              >
                <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
                  {dir === -1
                    ? <path d="M6 1L1 6L6 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    : <path d="M1 1L6 6L1 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  }
                </svg>
              </button>
            ))}
            <a
              href="/products?tags=new"
              style={{
                marginLeft: 4,
                display: "inline-flex", alignItems: "center", gap: 5,
                fontSize: 14, fontWeight: 700, color: "#00bcd4",
                textDecoration: "none", transition: "color 0.2s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#0097a7"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#00bcd4"}
            >
              View All
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </motion.div>

        {/* Product row */}
        {loading ? (
          <div style={{ display: "flex", gap: 20 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} style={{
                minWidth: 230, aspectRatio: "0.8", borderRadius: 12,
                background: "#f3f4f6",
                animation: "na-shimmer 1.5s ease infinite",
                animationDelay: `${i * 0.08}s`,
                flexShrink: 0,
              }} />
            ))}
          </div>
        ) : (
          <div style={{ position: "relative" }}>
            <div
              ref={scrollRef}
              onScroll={checkScroll}
              style={{
                display: "flex", gap: 20,
                overflowX: "auto", paddingBottom: 8,
                scrollbarWidth: "none", msOverflowStyle: "none",
              }}
            >
              {products.map((product, i) => (
                <motion.div
                  key={product._id || i}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.42 }}
                  style={{ minWidth: 230, maxWidth: 230, flexShrink: 0, position: "relative" }}
                >
                  {/* NEW badge */}
                  <div style={{
                    position: "absolute", top: 10, left: 10, zIndex: 3,
                    padding: "3px 9px", borderRadius: 6,
                    background: "#00bcd4",
                    fontSize: 9, fontWeight: 800, letterSpacing: "1.2px",
                    color: "#fff", textTransform: "uppercase",
                    boxShadow: "0 2px 6px rgba(0,188,212,0.3)",
                  }}>
                    NEW
                  </div>
                  {/*
                    Pass the sanitized product — image URLs are already cleaned.
                    ProductCard should use product.image / product.images directly,
                    NOT prepend BASE_URL again.
                  */}
                  <ProductCard
                    product={product}
                    index={i}
                    badge={product.tags?.includes("sale") ? "Sale" : "New"}
                  />
                </motion.div>
              ))}
            </div>

            {/* Fade right */}
            <div style={{
              position: "absolute", right: 0, top: 0, bottom: 8, width: 90,
              background: "linear-gradient(to left, #ffffff, transparent)",
              pointerEvents: "none",
            }}/>
            {/* Fade left */}
            <div style={{
              position: "absolute", left: 0, top: 0, bottom: 8, width: 90,
              background: "linear-gradient(to right, #ffffff, transparent)",
              pointerEvents: "none",
              opacity: canScrollLeft ? 1 : 0,
              transition: "opacity 0.25s",
            }}/>
          </div>
        )}
      </div>

      <style>{`
        @keyframes na-shimmer { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes na-ping {
          0%{transform:scale(1);opacity:0.8}
          70%,100%{transform:scale(2.4);opacity:0}
        }
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
}