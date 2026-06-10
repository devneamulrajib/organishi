import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronRight, ArrowRight } from "lucide-react";
import API, { BASE_URL } from "../api";

const RANK_COLOR = (i) =>
  i === 0 ? "#ba7517" : i === 1 ? "#5f5e5a" : i === 2 ? "#712b13" : "#b4b2a9";

export default function TrendingProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/products", { params: { tags: "trending", limit: 6 } })
      .then((res) => {
        const data = res.data;
        const list = Array.isArray(data) ? data : data.products || [];
        setProducts(list);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (!loading && products.length === 0) return null;

  const getPrice = (p) =>
    p.price ?? p.salePrice ?? p.sellingPrice ?? p.regularPrice ?? 0;

  const getOldPrice = (p) =>
    p.originalPrice ?? p.comparePrice ?? p.mrp ?? null;

  const getImage = (p) => {
    const raw = p.image ?? p.bottleImg ?? p.thumbnail ?? p.img ?? p.photo ?? "";
    return /^https?:\/\//i.test(raw) || raw.startsWith("//")
      ? raw
      : raw ? `${BASE_URL}${raw}` : "";
  };

  const getName = (p) =>
    p.name ?? p.title ?? p.productName ?? "Unnamed Product";

  const discount = (price, original) => {
    const p = Number(price);
    const op = Number(original);
    return op && op > p ? Math.round((1 - p / op) * 100) : null;
  };

  return (
    <section style={{ padding: "28px 0 32px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>

        {/* ── Header ── */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 18,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{
              width: 6, height: 6, borderRadius: "50%",
              background: "#22c55e", display: "inline-block",
            }} />
            <span style={{
              fontSize: 11, fontWeight: 600, color: "#888780",
              letterSpacing: "1.5px", textTransform: "uppercase",
            }}>
              Trending now
            </span>
          </div>

          <a
            href="/products?tags=trending"
            style={{
              fontSize: 12,
              color: "#5f5e5a",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 4,
              border: "0.5px solid #d3d1c7",
              borderRadius: 20,
              padding: "5px 12px",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f1efe8")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            See all <ArrowRight size={12} />
          </a>
        </div>

        {/* ── Grid ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 10,
        }}>
          {loading
            ? [1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "12px 14px",
                  background: "#fff",
                  border: "0.5px solid #e5e5e5",
                  borderRadius: 14,
                }}
              >
                <div style={{ width: 16, height: 10, background: "#f1efe8", borderRadius: 4, flexShrink: 0 }} />
                <div style={{ width: 56, height: 56, background: "#f1efe8", borderRadius: 12, flexShrink: 0 }} />
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ height: 11, width: "75%", background: "#f1efe8", borderRadius: 4 }} />
                  <div style={{ height: 14, width: "45%", background: "#f1efe8", borderRadius: 4 }} />
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
                  <motion.a
                    key={p._id || i}
                    href={`/products/${p._id || p.id}`}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.28 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px 14px",
                      background: "#fff",
                      border: "0.5px solid #e5e5e5",
                      borderRadius: 14,
                      cursor: "pointer",
                      textDecoration: "none",
                      transition: "border-color 0.2s, transform 0.2s",
                      position: "relative",
                      overflow: "hidden",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#c8c6be";
                      e.currentTarget.style.transform   = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#e5e5e5";
                      e.currentTarget.style.transform   = "translateY(0)";
                    }}
                  >
                    {/* Rank */}
                    <span style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: RANK_COLOR(i),
                      width: 16,
                      textAlign: "center",
                      flexShrink: 0,
                      letterSpacing: "0.5px",
                    }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    {/* Image */}
                    <div style={{
                      width: 56, height: 56, flexShrink: 0,
                      borderRadius: 12,
                      background: "#f9f9f7",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      overflow: "hidden",
                      padding: 6,
                    }}>
                      {imgSrc ? (
                        <img
                          src={imgSrc}
                          alt={name}
                          style={{ width: "100%", height: "100%", objectFit: "contain" }}
                          onError={(e) => { e.currentTarget.style.opacity = 0.2; }}
                        />
                      ) : (
                        <span style={{ fontSize: 20, opacity: 0.4 }}>—</span>
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: "#1a1a1a",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        marginBottom: 5,
                      }}>
                        {name}
                      </div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                        <span style={{ fontSize: 15, fontWeight: 500, color: "#1a1a1a" }}>
                          ৳{Number(price).toLocaleString()}
                        </span>
                        {oldPrice && Number(oldPrice) > Number(price) && (
                          <span style={{ fontSize: 11, color: "#b4b2a9", textDecoration: "line-through" }}>
                            ৳{Number(oldPrice).toLocaleString()}
                          </span>
                        )}
                        {d && (
                          <span style={{
                            fontSize: 10, fontWeight: 600, color: "#3b6d11",
                            background: "#eaf3de", padding: "2px 6px", borderRadius: 5,
                          }}>
                            -{d}%
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Arrow */}
                    <ChevronRight size={14} color="#b4b2a9" style={{ flexShrink: 0 }} />
                  </motion.a>
                );
              })}
        </div>
      </div>
    </section>
  );
}