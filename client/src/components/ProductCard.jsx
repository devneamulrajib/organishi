import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductCard({ product, index = 0, badge }) {
  const [hovered, setHovered] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [qty, setQty] = useState(0);
  const [justAdded, setJustAdded] = useState(false);

  const handleAddFirst = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setQty(1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 900);
  };
  const handleIncrease = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setQty((q) => q + 1);
  };
  const handleDecrease = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setQty((q) => Math.max(0, q - 1));
  };
  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlisted((w) => !w);
  };

  const name = product.name || product.title || product.productName || "Product";
  const price = product.price ?? product.salePrice ?? product.sellingPrice ?? 0;
  const originalPrice = product.originalPrice ?? product.comparePrice ?? product.mrp ?? null;
  const rawImage = product.bottleImg || product.image || product.thumbnail || product.img || "";
  const category = product.category || "Fresh Product";

  /* ── Smart image URL: if already absolute, use as-is; otherwise it's empty ── */
  const image = /^https?:\/\//i.test(rawImage) || rawImage.startsWith('//')
    ? rawImage          // Cloudinary or any full URL → use directly
    : rawImage          // relative path or empty → just use as-is (BASE_URL handled upstream)
  ;

  const discount =
    originalPrice && price
      ? Math.round(((Number(originalPrice) - Number(price)) / Number(originalPrice)) * 100)
      : null;

  const displayBadge =
    badge ||
    (product.tags?.includes("sale") ? "Sale" : null) ||
    (product.tags?.includes("new") ? "New" : null);

  return (
    <motion.a
      href={`/products/${product._id || product.id}`}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.38, delay: index * 0.05 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        background: "#fff",
        borderRadius: 18,
        border: hovered ? "1.5px solid #e0e7ff" : "1.5px solid #ececec",
        overflow: "hidden",
        cursor: "pointer",
        textDecoration: "none",
        transition: "border-color 0.25s, box-shadow 0.28s, transform 0.28s cubic-bezier(0.34,1.2,0.64,1)",
        boxShadow: hovered
          ? "0 18px 50px rgba(26,35,126,0.12), 0 4px 14px rgba(0,0,0,0.06)"
          : "0 2px 10px rgba(0,0,0,0.05)",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
      }}
    >

      {/* ── IMAGE AREA ── */}
      <div
        style={{
          position: "relative",
          aspectRatio: "1",
          background: hovered ? "#eef2ff" : "#f8fafc",
          transition: "background 0.35s",
          overflow: "hidden",
          padding: 20,
          flexShrink: 0,
        }}
      >
        {/* ✅ Fixed: use image directly, no BASE_URL prepended */}
        <img
          src={image}
          alt={name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            transform: hovered ? "scale(1.08) translateY(-3px)" : "scale(1)",
            transition: "transform 0.45s cubic-bezier(0.34,1.56,0.64,1)",
          }}
          onError={(e) => {
            e.target.style.opacity = 0.3;
          }}
        />

        {/* Soft radial tint on hover */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at center, transparent 60%, rgba(26,35,126,0.04) 100%)",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.3s",
            pointerEvents: "none",
          }}
        />

        {/* ── BADGES top-left ── */}
        <div
          style={{
            position: "absolute",
            top: 11,
            left: 11,
            display: "flex",
            flexDirection: "column",
            gap: 5,
            zIndex: 2,
          }}
        >
          {discount && discount > 0 && (
            <div
              style={{
                background: "#ef4444",
                color: "#fff",
                fontSize: 10,
                fontWeight: 800,
                padding: "3px 8px",
                borderRadius: 6,
                letterSpacing: "0.3px",
                boxShadow: "0 2px 6px rgba(239,68,68,0.35)",
              }}
            >
              -{discount}%
            </div>
          )}
          {displayBadge === "New" && (
            <div
              style={{
                background: "linear-gradient(135deg,#0ea5e9,#00bcd4)",
                color: "#fff",
                fontSize: 10,
                fontWeight: 800,
                padding: "3px 8px",
                borderRadius: 6,
                letterSpacing: "0.3px",
                boxShadow: "0 2px 6px rgba(0,188,212,0.35)",
              }}
            >
              NEW
            </div>
          )}
          {displayBadge === "Sale" && (
            <div
              style={{
                background: "#f59e0b",
                color: "#fff",
                fontSize: 10,
                fontWeight: 800,
                padding: "3px 8px",
                borderRadius: 6,
                letterSpacing: "0.3px",
              }}
            >
              SALE
            </div>
          )}
        </div>

        {/* ── WISHLIST button ── */}
        <button
          onClick={toggleWishlist}
          aria-label="Add to wishlist"
          style={{
            position: "absolute",
            top: 11,
            right: 11,
            zIndex: 2,
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: wishlisted ? "#fee2e2" : "#fff",
            border: wishlisted ? "1.5px solid #fca5a5" : "1.5px solid #ececec",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(0,0,0,0.07)",
            transition: "all 0.2s",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill={wishlisted ? "#ef4444" : "none"}
            stroke={wishlisted ? "#ef4444" : "#9ca3af"}
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      {/* ── INFO AREA ── */}
      <div
        style={{
          padding: "14px 15px 15px",
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        {/* Category */}
        <div
          style={{
            fontSize: 10,
            color: "#00bcd4",
            fontWeight: 700,
            marginBottom: 5,
            textTransform: "uppercase",
            letterSpacing: "1.5px",
          }}
        >
          {category}
        </div>

        {/* Product name */}
        <div
          style={{
            fontWeight: 600,
            fontSize: 13.5,
            color: "#111827",
            lineHeight: 1.45,
            flex: 1,
            marginBottom: 12,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {name}
        </div>

        {/* Price */}
        <div style={{ marginBottom: 12 }}>
          <div
            style={{
              fontSize: 19,
              fontWeight: 800,
              color: "#1a237e",
              lineHeight: 1,
            }}
          >
            ৳{price}
          </div>
          {originalPrice && (
            <div
              style={{
                fontSize: 11,
                color: "#9ca3af",
                textDecoration: "line-through",
                marginTop: 2,
              }}
            >
              ৳{originalPrice}
            </div>
          )}
        </div>

        {/* ── Add to Cart / Stepper ── */}
        <AnimatePresence mode="wait">
          {qty === 0 ? (
            <motion.button
              key="add-btn"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.18 }}
              onClick={handleAddFirst}
              style={{
                width: "100%",
                padding: "11px 0",
                borderRadius: 11,
                background: justAdded ? "#00bcd4" : "#1a237e",
                color: "#fff",
                border: "none",
                fontSize: 12.5,
                fontWeight: 700,
                letterSpacing: "0.6px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
                boxShadow: "0 4px 14px rgba(26,35,126,0.25)",
                transition: "background 0.2s",
                flexShrink: 0,
              }}
              onMouseEnter={(e) =>
                !justAdded && (e.currentTarget.style.background = "#283593")
              }
              onMouseLeave={(e) =>
                !justAdded && (e.currentTarget.style.background = "#1a237e")
              }
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.8"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add to Cart
            </motion.button>
          ) : (
            <motion.div
              key="stepper"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.18 }}
              style={{
                width: "100%",
                height: 42,
                borderRadius: 11,
                background: "#1a237e",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 5px",
                boxShadow: "0 4px 14px rgba(26,35,126,0.25)",
                flexShrink: 0,
              }}
            >
              <button
                onClick={handleDecrease}
                style={{
                  border: "none",
                  background: "rgba(255,255,255,0.12)",
                  color: "#fff",
                  cursor: "pointer",
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  fontSize: 20,
                  fontWeight: 300,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: 1,
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.22)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.12)")
                }
              >
                −
              </button>
              <span
                style={{
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: 15,
                  minWidth: 24,
                  textAlign: "center",
                }}
              >
                {qty}
              </span>
              <button
                onClick={handleIncrease}
                style={{
                  border: "none",
                  background: "rgba(255,255,255,0.12)",
                  color: "#fff",
                  cursor: "pointer",
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  fontSize: 20,
                  fontWeight: 300,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: 1,
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.22)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.12)")
                }
              >
                +
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Bottom accent line on hover ── */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 3,
          background: "linear-gradient(to right, #1a237e, #00bcd4)",
          borderRadius: "0 0 18px 18px",
          transform: hovered ? "scaleX(1)" : "scaleX(0)",
          transformOrigin: "left",
          transition: "transform 0.3s ease",
        }}
      />
    </motion.a>
  );
}