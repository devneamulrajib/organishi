import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, ChevronRight } from "lucide-react";
// Import our smart API instance and the BASE_URL for images
import API, { BASE_URL } from '../api'; 

const BG_PALETTE = ["#fbeaf0", "#eeedfe", "#faeeda", "#e1f5ee", "#eeedfe", "#fbeaf0"];

export default function TrendingProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Using the smart API instance instead of raw fetch
    API.get('/products', { params: { tags: 'trending', limit: 6 } })
      .then((res) => {
        const data = res.data;
        const list = Array.isArray(data) ? data : data.products || [];
        setProducts(list);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (!loading && products.length === 0) return null;

  const rankColor = (i) =>
    i === 0 ? "#ba7517" : i === 1 ? "#888780" : i === 2 ? "#993c1d" : "#d3d1c7";

  const getPrice = (p) =>
    p.price ?? p.salePrice ?? p.sellingPrice ?? p.regularPrice ?? p.amount ?? 0;

  const getOldPrice = (p) =>
    p.originalPrice ?? p.comparePrice ?? p.mrp ?? p.regularPrice ?? null;

  const getImage = (p) =>
    p.image ?? p.bottleImg ?? p.thumbnail ?? p.img ?? p.photo ?? "";

  const getName = (p) =>
    p.name ?? p.title ?? p.productName ?? "Unnamed Product";

  const discount = (price, original) => {
    const p = Number(price);
    const op = Number(original);
    return op && op > p ? Math.round((1 - p / op) * 100) : null;
  };

  return (
    <section style={{ padding: "60px 0", background: "#f9f9f7" }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 5%" }}>

        <div style={{
          position: "relative",
          background: "#fafaf8",
          borderRadius: 20,
          padding: "40px 32px 44px",
          overflow: "hidden",
        }}>

          {/* ── Art Background (SVG) ── */}
          <svg
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
            viewBox="0 0 1320 600"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <radialGradient id="rg1" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#eeedfe" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#eeedfe" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="rg2" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fbeaf0" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#fbeaf0" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="rg3" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#e1f5ee" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#e1f5ee" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="rg4" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#faeeda" stopOpacity="0.65" />
                <stop offset="100%" stopColor="#faeeda" stopOpacity="0" />
              </radialGradient>
            </defs>

            <ellipse cx="1100" cy="90"  rx="340" ry="300" fill="url(#rg1)" />
            <ellipse cx="160"  cy="480" rx="380" ry="320" fill="url(#rg2)" />
            <ellipse cx="680"  cy="300" rx="270" ry="220" fill="url(#rg3)" />
            <ellipse cx="1240" cy="480" rx="250" ry="200" fill="url(#rg4)" />

            <circle cx="1060" cy="55"  r="4"   fill="#afa9ec" opacity="0.7" />
            <circle cx="1100" cy="88"  r="2.5" fill="#ed93b1" opacity="0.6" />
            <circle cx="1180" cy="42"  r="3"   fill="#5dcaa5" opacity="0.5" />
            <circle cx="120"  cy="130" r="3.5" fill="#ef9f27" opacity="0.5" />
            <circle cx="60"   cy="390" r="3.5" fill="#ed93b1" opacity="0.45" />
            <circle cx="1280" cy="370" r="3"   fill="#5dcaa5" opacity="0.5" />
            <circle cx="200"  cy="240" r="3"   fill="#afa9ec" opacity="0.4" />
            <circle cx="860"  cy="530" r="3.5" fill="#ed93b1" opacity="0.4" />

            <line x1="940"  y1="0" x2="1320" y2="180" stroke="#7f77dd" strokeWidth="0.8" opacity="0.15" />
            <line x1="1040" y1="0" x2="1320" y2="120" stroke="#d4537e" strokeWidth="0.6" opacity="0.14" />
            <line x1="0" y1="380" x2="420"  y2="600" stroke="#1d9e75" strokeWidth="0.7" opacity="0.14" />

            <rect   x="1148" y="22"  width="34" height="34" rx="6"  fill="none" stroke="#534ab7" strokeWidth="1"   opacity="0.12" />
            <rect   x="1156" y="30"  width="18" height="18" rx="3"  fill="none" stroke="#534ab7" strokeWidth="0.6" opacity="0.1"  />
            <circle cx="1248" cy="250" r="22" fill="none" stroke="#0f6e56" strokeWidth="0.8" opacity="0.12" />
            <circle cx="1248" cy="250" r="12" fill="none" stroke="#0f6e56" strokeWidth="0.5" opacity="0.1"  />
            <line x1="1226" y1="250" x2="1270" y2="250" stroke="#0f6e56" strokeWidth="0.5" opacity="0.1" />
            <line x1="1248" y1="228" x2="1248" y2="272" stroke="#0f6e56" strokeWidth="0.5" opacity="0.1" />
            <polygon points="78,60 100,100 56,100" fill="none" stroke="#ba7517" strokeWidth="0.8" opacity="0.12" />
            <rect x="36" y="490" width="28" height="28" rx="4" fill="none" stroke="#993556" strokeWidth="0.8" opacity="0.12" />
            <line x1="0" y1="0" x2="1320" y2="600" stroke="#534ab7" strokeWidth="0.5" strokeDasharray="5 8" opacity="0.06" />
            <line x1="1320" y1="0" x2="0" y2="600" stroke="#993556" strokeWidth="0.5" strokeDasharray="5 9" opacity="0.06" />
          </svg>

          {/* ── Header ── */}
          <div style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              padding: "7px 14px 7px 10px",
              background: "#fff",
              border: "1px solid #e8e4ff",
              borderRadius: 40,
              boxShadow: "0 2px 8px rgba(127,119,221,0.12)",
            }}>
              <TrendingUp size={16} color="#7f77dd" />
              <span style={{ fontSize: 13, fontWeight: 700, color: "#534ab7", letterSpacing: "0.2px" }}>
                Trending now
              </span>
            </div>

            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "5px 10px", background: "#eaf3de", borderRadius: 20,
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: "50%", background: "#22c55e",
                display: "inline-block",
              }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: "#3b6d11", letterSpacing: "0.4px" }}>Live</span>
            </div>
          </div>

          <h2 style={{ position: "relative", zIndex: 2, fontSize: 22, fontWeight: 700, color: "#1a1a2e", margin: "0 0 6px", letterSpacing: "-0.4px" }}>
            What everyone's buying
          </h2>
          <p style={{ position: "relative", zIndex: 2, fontSize: 13, color: "#888780", margin: "0 0 28px" }}>
            Updated every hour · {loading ? "—" : products.length} products
          </p>

          {/* ── Grid ── */}
          <div style={{
            position: "relative", zIndex: 2,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 12,
          }}>
            {loading
              ? [1, 2, 3, 4].map((i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: "14px 16px",
                  background: "#fff", border: "1px solid #eeecfb", borderRadius: 16,
                }}>
                  <div style={{ width: 64, height: 64, background: "#f1efe8", borderRadius: 12, flexShrink: 0 }} />
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ height: 10, width: 36, background: "#f1efe8", borderRadius: 5 }} />
                    <div style={{ height: 13, width: "80%", background: "#f1efe8", borderRadius: 5 }} />
                    <div style={{ height: 17, width: "50%", background: "#f1efe8", borderRadius: 5 }} />
                  </div>
                </div>
              ))
              : products.map((p, i) => {
                  const price    = getPrice(p);
                  const oldPrice = getOldPrice(p);
                  const d        = discount(price, oldPrice);
                  const imgSrc   = getImage(p);
                  const name     = getName(p);

                  return (
                    <motion.div
                      key={p._id || i}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.07 }}
                      style={{
                        display: "flex", alignItems: "center", gap: 14,
                        padding: "14px 16px",
                        background: "#fff",
                        border: "1px solid #eeecfb",
                        borderRadius: 16,
                        cursor: "pointer",
                        transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#afa9ec";
                        e.currentTarget.style.boxShadow  = "0 6px 24px rgba(127,119,221,0.12)";
                        e.currentTarget.style.transform  = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#eeecfb";
                        e.currentTarget.style.boxShadow  = "none";
                        e.currentTarget.style.transform  = "translateY(0)";
                      }}
                    >
                      {/* Rank */}
                      <span style={{
                        fontSize: 11, fontWeight: 800,
                        color: rankColor(i),
                        width: 16, textAlign: "center", flexShrink: 0,
                      }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>

                      {/* Image - Updated with BASE_URL */}
                      <div style={{
                        width: 64, height: 64, flexShrink: 0,
                        borderRadius: 12,
                        background: BG_PALETTE[i % BG_PALETTE.length],
                        display: "flex", alignItems: "center", justifyContent: "center",
                        overflow: "hidden",
                        padding: 6,
                      }}>
                        {imgSrc ? (
                          <img
                            src={imgSrc.startsWith("http") ? imgSrc : `${BASE_URL}${imgSrc}`}
                            alt={name}
                            style={{ width: "100%", height: "100%", objectFit: "contain" }}
                            onError={(e) => { e.currentTarget.style.display = "none"; }}
                          />
                        ) : (
                          <span style={{ fontSize: 22 }}>🛍️</span>
                        )}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          display: "flex", alignItems: "center", gap: 5,
                          fontSize: 10, fontWeight: 800, color: "#993556",
                          letterSpacing: "0.6px", marginBottom: 4,
                        }}>
                          <span style={{
                            width: 5, height: 5, borderRadius: "50%",
                            background: "#d4537e", display: "inline-block",
                          }} />
                          HOT
                        </div>
                        <h4 style={{
                          margin: "0 0 7px", fontSize: 14, fontWeight: 600, color: "#2c2c2a",
                          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                        }}>
                          {name}
                        </h4>
                        <div style={{ display: "flex", alignItems: "baseline", gap: 7 }}>
                          <span style={{ fontSize: 17, fontWeight: 800, color: "#534ab7" }}>
                            ৳{Number(price).toLocaleString()}
                          </span>
                          {oldPrice && Number(oldPrice) > Number(price) && (
                            <span style={{ fontSize: 12, color: "#b4b2a9", textDecoration: "line-through" }}>
                              ৳{Number(oldPrice).toLocaleString()}
                            </span>
                          )}
                          {d && (
                            <span style={{
                              fontSize: 10, fontWeight: 700, color: "#3b6d11",
                              background: "#eaf3de", padding: "2px 6px", borderRadius: 6,
                            }}>
                              -{d}%
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Arrow */}
                      <div style={{
                        width: 30, height: 30, flexShrink: 0, borderRadius: "50%",
                        background: "#f1efe8", display: "flex", alignItems: "center",
                        justifyContent: "center", color: "#b4b2a9",
                      }}>
                        <ChevronRight size={15} />
                      </div>
                    </motion.div>
                  );
                })}
          </div>
        </div>
      </div>
    </section>
  );
}