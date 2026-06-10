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
    setJustAdded(true);
    setTimeout(() => {
      setQty(1);
      setJustAdded(false);
    }, 160);
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

  const image = /^https?:\/\//i.test(rawImage) || rawImage.startsWith("//")
    ? rawImage
    : rawImage;

  const discount =
    originalPrice && price
      ? Math.round(((Number(originalPrice) - Number(price)) / Number(originalPrice)) * 100)
      : null;

  const displayBadge =
    badge ||
    (product.tags?.includes("sale") ? "Sale" : null) ||
    (product.tags?.includes("new") ? "New" : null);

  /* ── Shared dark color ── */
  const dark = "#1a1a1a";
  const darkHover = "#333333";

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
        borderRadius: 20,
        border: hovered ? "0.5px solid #d1d5db" : "0.5px solid #e5e7eb",
        overflow: "hidden",
        cursor: "pointer",
        textDecoration: "none",
        transition:
          "border-color 0.25s, box-shadow 0.3s ease, transform 0.3s cubic-bezier(0.34,1.2,0.64,1)",
        boxShadow: hovered
          ? "0 20px 48px rgba(0,0,0,0.10)"
          : "0 2px 8px rgba(0,0,0,0.04)",
        transform: hovered ? "translateY(-7px)" : "translateY(0)",
      }}
    >
      {/* ── IMAGE AREA ── */}
      <div
        style={{
          position: "relative",
          aspectRatio: "1",
          background: hovered ? "#f3f4f6" : "#f9fafb",
          transition: "background 0.3s",
          overflow: "hidden",
          padding: 24,
          flexShrink: 0,
        }}
      >
        <img
          src={image}
          alt={name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            transform: hovered ? "scale(1.09) translateY(-3px)" : "scale(1)",
            transition: "transform 0.45s cubic-bezier(0.34,1.56,0.64,1)",
            display: "block",
          }}
          onError={(e) => {
            e.target.style.opacity = 0.2;
          }}
        />

        {/* ── BADGES top-left ── */}
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            display: "flex",
            flexDirection: "column",
            gap: 5,
            zIndex: 2,
          }}
        >
          {discount && discount > 0 && (
            <div
              style={{
                background: dark,
                color: "#e8e0d4",
                fontSize: 9,
                fontWeight: 700,
                padding: "3px 8px",
                borderRadius: 6,
                letterSpacing: "0.8px",
                textTransform: "uppercase",
              }}
            >
              -{discount}%
            </div>
          )}
          {displayBadge === "New" && (
            <div
              style={{
                background: "#f1f1f1",
                color: dark,
                fontSize: 9,
                fontWeight: 700,
                padding: "3px 8px",
                borderRadius: 6,
                letterSpacing: "0.8px",
                textTransform: "uppercase",
                border: "0.5px solid #d1d1d1",
              }}
            >
              New
            </div>
          )}
          {displayBadge === "Sale" && (
            <div
              style={{
                background: dark,
                color: "#fff",
                fontSize: 9,
                fontWeight: 700,
                padding: "3px 8px",
                borderRadius: 6,
                letterSpacing: "0.8px",
                textTransform: "uppercase",
              }}
            >
              Sale
            </div>
          )}
        </div>

        {/* ── WISHLIST button ── */}
        <button
          onClick={toggleWishlist}
          aria-label="Add to wishlist"
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 2,
            width: 30,
            height: 30,
            borderRadius: "50%",
            background: wishlisted ? "#fcebeb" : "#fff",
            border: wishlisted ? "0.5px solid #f09595" : "0.5px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill={wishlisted ? "#e24b4a" : "none"}
            stroke={wishlisted ? "#e24b4a" : "#9ca3af"}
            strokeWidth="2"
            style={{
              transition: "transform 0.2s cubic-bezier(0.34,1.5,0.64,1)",
              transform: wishlisted ? "scale(1.2)" : "scale(1)",
            }}
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      {/* ── INFO AREA ── */}
      <div
        style={{
          padding: "14px 15px 16px",
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        {/* Category */}
        <div
          style={{
            fontSize: 9,
            color: "#9ca3af",
            fontWeight: 600,
            marginBottom: 6,
            textTransform: "uppercase",
            letterSpacing: "1.8px",
          }}
        >
          {category}
        </div>

        {/* Product name */}
        <div
          style={{
            fontWeight: 500,
            fontSize: 13,
            color: "#111827",
            lineHeight: 1.5,
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
        <div
          style={{
            marginBottom: 14,
            display: "flex",
            alignItems: "baseline",
            gap: 7,
          }}
        >
          <div
            style={{
              fontSize: 18,
              fontWeight: 500,
              color: "#111827",
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
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.18 }}
              onClick={handleAddFirst}
              style={{
                width: "100%",
                height: 40,
                borderRadius: 12,
                background: justAdded ? darkHover : dark,
                color: "#fff",
                border: "none",
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: "0.5px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
                transition: "background 0.2s, transform 0.15s",
                flexShrink: 0,
              }}
              onMouseEnter={(e) =>
                !justAdded && (e.currentTarget.style.background = darkHover)
              }
              onMouseLeave={(e) =>
                !justAdded && (e.currentTarget.style.background = dark)
              }
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add to cart
            </motion.button>
          ) : (
            <motion.div
              key="stepper"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.18 }}
              style={{
                width: "100%",
                height: 40,
                borderRadius: 12,
                background: dark,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 4px",
                flexShrink: 0,
              }}
            >
              <button
                onClick={handleDecrease}
                style={{
                  border: "none",
                  background: "transparent",
                  color: "#fff",
                  cursor: "pointer",
                  width: 32,
                  height: 32,
                  borderRadius: 9,
                  fontSize: 18,
                  fontWeight: 300,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: 1,
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.12)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                −
              </button>
              <span
                style={{
                  color: "#fff",
                  fontWeight: 500,
                  fontSize: 15,
                  minWidth: 28,
                  textAlign: "center",
                }}
              >
                {qty}
              </span>
              <button
                onClick={handleIncrease}
                style={{
                  border: "none",
                  background: "transparent",
                  color: "#fff",
                  cursor: "pointer",
                  width: 32,
                  height: 32,
                  borderRadius: 9,
                  fontSize: 18,
                  fontWeight: 300,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: 1,
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.12)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
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
          height: 2,
          background: dark,
          borderRadius: "0 0 20px 20px",
          transform: hovered ? "scaleX(1)" : "scaleX(0)",
          transformOrigin: "left",
          transition: "transform 0.3s ease",
        }}
      />
    </motion.a>
  );
}