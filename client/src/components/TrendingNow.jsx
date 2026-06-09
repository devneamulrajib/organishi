import { ArrowRight } from "lucide-react";

export default function TrendingNow({ products }) {
  const API = "http://localhost:5000";

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
      {products.slice(0, 6).map((item) => (
        <div key={item._id} style={{
          display: "flex", 
          alignItems: "center", 
          padding: "10px", 
          border: "1px solid #f5f5f5", 
          borderRadius: "10px",
          background: "#fff"
        }}>
          <img src={`${API}${item.image}`} style={{ width: "50px", height: "50px", marginRight: "15px" }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "13px", fontWeight: "600" }}>{item.name}</div>
            <div style={{ fontSize: "14px", color: "#000", fontWeight: "700" }}>৳{item.price}</div>
          </div>
          <button style={{ background: "none", border: "none", color: "#ccc" }}>
            <ArrowRight size={20} />
          </button>
        </div>
      ))}
    </div>
  );
}