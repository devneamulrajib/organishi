import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import API from '../api';

export default function TrendingProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    API.get('/products', { params: { tags: 'trending', limit: 6 } })
      .then(r => {
        const d = r.data;
        setProducts(Array.isArray(d) ? d : (d.products || []));
      })
      .catch(() => {});
  }, []);

  if (!products.length) return null;

  return (
    <div style={{ padding: "16px" }}>
      {/* Header — only "Trending now" */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        marginBottom: 12,
      }}>
        <span style={{
          fontSize: 11, fontWeight: 700, letterSpacing: "1.5px",
          textTransform: "uppercase", color: "#B07D4A",
          fontFamily: "'Jost', sans-serif",
        }}>
          Trending now
        </span>
        <span style={{
          width: 6, height: 6, borderRadius: "50%",
          background: "#22c55e", boxShadow: "0 0 6px #22c55e",
          flexShrink: 0,
        }} />
      </div>

      {/* Compact product grid */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {products.map((item, idx) => (
          <div key={item._id} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "8px 10px", borderRadius: 10,
            border: "1px solid #f0ece8", background: "#fff",
          }}>
            <span style={{
              fontSize: 10, fontWeight: 700, color: "#c8a96e",
              minWidth: 16, flexShrink: 0,
            }}>
              {String(idx + 1).padStart(2, '0')}
            </span>

            <img
              src={item.image || item.bottleImg}
              alt={item.name}
              style={{ width: 36, height: 36, objectFit: "contain", flexShrink: 0 }}
            />

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 12, fontWeight: 600, color: "#1a1410",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                fontFamily: "'Jost', sans-serif",
              }}>
                {item.name}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#B07D4A", fontFamily: "'Jost', sans-serif" }}>
                  ৳{item.price}
                </span>
                {item.originalPrice && item.originalPrice > item.price && (
                  <span style={{ fontSize: 10, color: "#b0a090", textDecoration: "line-through" }}>
                    ৳{item.originalPrice}
                  </span>
                )}
              </div>
            </div>

            <button style={{
              background: "none", border: "none",
              color: "#d0c8c0", cursor: "pointer",
              flexShrink: 0, padding: 0,
            }}>
              <ArrowRight size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}