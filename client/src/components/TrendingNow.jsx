import { ArrowRight } from "lucide-react";

export default function TrendingNow({ products }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
      {products.slice(0, 6).map((item, idx) => (
        <div key={item._id} style={{
          display: "flex",
          alignItems: "center",
          padding: "8px 10px",
          border: "1px solid #f0ece8",
          borderRadius: 10,
          background: "#fff",
          gap: 10,
        }}>
          <span style={{
            fontSize: 11, fontWeight: 700, color: "#b0a090",
            minWidth: 18, flexShrink: 0,
          }}>
            {String(idx + 1).padStart(2, '0')}
          </span>

          {/* image is already a full Cloudinary URL */}
          <img
            src={item.image || item.bottleImg}
            alt={item.name}
            style={{ width: 40, height: 40, objectFit: "contain", flexShrink: 0 }}
          />

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 12, fontWeight: 600, color: "#1a1410",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>
              {item.name}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#B07D4A" }}>
                ৳{item.price}
              </span>
              {item.originalPrice && item.originalPrice > item.price && (
                <span style={{ fontSize: 10, color: "#b0a090", textDecoration: "line-through" }}>
                  ৳{item.originalPrice}
                </span>
              )}
            </div>
          </div>

          <button style={{ background: "none", border: "none", color: "#d0c8c0", cursor: "pointer", flexShrink: 0, padding: 0 }}>
            <ArrowRight size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}