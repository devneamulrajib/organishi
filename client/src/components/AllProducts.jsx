import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "./ProductCard";
// Import our smart API instance
import API from '../api'; 

const SORT_OPTIONS = [
  { value: "newest",     label: "Newest First" },
  { value: "price_asc",  label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
];

const TAG_FILTERS = [
  { value: "",          label: "All" },
  { value: "new",       label: "New Arrivals" },
  { value: "trending",  label: "Trending" },
  { value: "featured",  label: "Featured" },
  { value: "sale",      label: "On Sale" },
  { value: "organic",   label: "Organic" },
];

export default function AllProducts() {
  const [products, setProducts]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [sort, setSort]               = useState("newest");
  const [tagFilter, setTagFilter]     = useState("");
  const [page, setPage]               = useState(1);
  const [total, setTotal]             = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const limit = 12;

  useEffect(() => {
    setLoading(true);
    
    // Prepare the exact same parameters as your original fetch
    const params = {
      sort,
      page,
      limit,
      ...(tagFilter && { tags: tagFilter }) // Add tags only if filter is active
    };

    // Swapped fetch for API.get while keeping logic identical
    API.get('/products', { params })
      .then((res) => {
        const data = res.data;
        const list = Array.isArray(data) ? data : data.products || [];
        setProducts(list);
        setTotal(data.total || list.length);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, [sort, tagFilter, page]);

  const totalPages = Math.ceil(total / limit);
  const handleTagChange = (tag) => { setTagFilter(tag); setPage(1); };

  return (
    <section
      style={{
        position: "relative",
        padding: "clamp(72px, 9vw, 112px) 0 clamp(80px, 10vw, 120px)",
        background: "linear-gradient(170deg, #f5f2ee 0%, #ede8e2 50%, #f0ebe4 100%)",
        overflow: "hidden",
      }}
    >
      {/* Dot matrix */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle, rgba(176,125,74,0.16) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
          pointerEvents: "none",
          opacity: 0.5,
        }}
      />

      {/* Top accent line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background:
            "linear-gradient(to right, transparent, #c8a96e 30%, #B07D4A 60%, transparent)",
        }}
      />

      {/* Corner glow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 400,
          height: 400,
          background:
            "radial-gradient(circle at top right, rgba(200,169,110,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Watermark */}
      <div
        style={{
          position: "absolute",
          bottom: "6%",
          left: "-1%",
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(80px, 12vw, 160px)",
          fontWeight: 700,
          color: "transparent",
          WebkitTextStroke: "1px rgba(176,125,74,0.06)",
          letterSpacing: "-2px",
          pointerEvents: "none",
          userSelect: "none",
          lineHeight: 1,
        }}
      >
        EXPLORE
      </div>

      <div
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding: "0 clamp(20px, 4vw, 56px)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: 40 }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 20,
              marginBottom: 28,
            }}
          >
            <div>
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  background: "rgba(176,125,74,0.1)",
                  color: "#B07D4A",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "2.5px",
                  textTransform: "uppercase",
                  padding: "7px 16px",
                  borderRadius: 99,
                  marginBottom: 16,
                  fontFamily: "'Jost', sans-serif",
                  border: "1px solid rgba(176,125,74,0.22)",
                }}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <circle cx="5" cy="5" r="4" stroke="#B07D4A" strokeWidth="1.5" />
                  <path d="M5 2.5V5L6.5 6.5" stroke="#B07D4A" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                Explore
              </motion.div>

              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(36px, 4.5vw, 58px)",
                  fontWeight: 400,
                  color: "#1a1410",
                  margin: 0,
                  lineHeight: 1,
                  letterSpacing: "-1px",
                }}
              >
                All{" "}
                <em style={{ fontStyle: "italic", color: "#B07D4A" }}>Products</em>
              </h2>
              {total > 0 && (
                <p
                  style={{
                    color: "#a09080",
                    fontSize: 13,
                    marginTop: 10,
                    fontFamily: "'Jost', sans-serif",
                    fontWeight: 300,
                  }}
                >
                  Showing {products.length} of {total} products
                </p>
              )}
            </div>

            {/* Sort + filter toggle */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              {/* Filter toggle */}
              <button
                onClick={() => setShowFilters((s) => !s)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "10px 18px",
                  borderRadius: 10,
                  border: showFilters
                    ? "1.5px solid #1a1410"
                    : "1.5px solid rgba(176,125,74,0.3)",
                  background: showFilters ? "#1a1410" : "rgba(176,125,74,0.06)",
                  color: showFilters ? "#c8a96e" : "#6a5a4a",
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: "'Jost', sans-serif",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  letterSpacing: "0.5px",
                }}
              >
                <svg width="14" height="12" viewBox="0 0 14 12" fill="none">
                  <path d="M1 1H13M3 6H11M5 11H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Filter
                {tagFilter && (
                  <span
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: "#c8a96e",
                      color: "#1a1410",
                      fontSize: 10,
                      fontWeight: 800,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    1
                  </span>
                )}
              </button>

              {/* Sort */}
              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1); }}
                style={{
                  padding: "10px 36px 10px 14px",
                  borderRadius: 10,
                  border: "1.5px solid rgba(176,125,74,0.3)",
                  background: "rgba(176,125,74,0.06)",
                  color: "#3a2e24",
                  fontSize: 12,
                  fontWeight: 500,
                  fontFamily: "'Jost', sans-serif",
                  cursor: "pointer",
                  appearance: "none",
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23B07D4A' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 12px center",
                  outline: "none",
                }}
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Divider */}
          <div
            style={{
              height: 1,
              background:
                "linear-gradient(to right, #1a1410 0%, rgba(26,20,16,0.15) 50%, transparent 100%)",
            }}
          />

          {/* Tag filter pills */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                style={{ overflow: "hidden" }}
              >
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                    paddingTop: 20,
                  }}
                >
                  {TAG_FILTERS.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => handleTagChange(f.value)}
                      style={{
                        padding: "8px 18px",
                        borderRadius: 99,
                        border: `1.5px solid ${tagFilter === f.value ? "#1a1410" : "rgba(176,125,74,0.25)"}`,
                        background:
                          tagFilter === f.value
                            ? "#1a1410"
                            : "rgba(176,125,74,0.05)",
                        color: tagFilter === f.value ? "#c8a96e" : "#6a5a4a",
                        fontSize: 12,
                        fontWeight: 600,
                        fontFamily: "'Jost', sans-serif",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Product grid */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 24 }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                style={{
                  borderRadius: 24,
                  aspectRatio: "0.82",
                  background: "linear-gradient(135deg, #f0ece7, #e8e2db)",
                  animation: "shimmer 1.6s ease infinite",
                  animationDelay: `${i * 0.06}s`,
                }}
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              textAlign: "center",
              padding: "80px 20px",
              color: "#b0a090",
              fontFamily: "'Jost', sans-serif",
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: "rgba(176,125,74,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
                border: "1px solid rgba(176,125,74,0.2)",
              }}
            >
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none" opacity="0.5">
                <path d="M3 3h3.5l2.5 14h14l2.5-10H8" stroke="#B07D4A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="13" cy="25" r="2" fill="#B07D4A" />
                <circle cx="21" cy="25" r="2" fill="#B07D4A" />
              </svg>
            </div>
            <p style={{ fontSize: 18, color: "#5a4a3a", fontFamily: "'Cormorant Garamond', serif", marginBottom: 8 }}>
              No products found
            </p>
            <p style={{ fontSize: 13, color: "#a09080" }}>
              Try clearing the filter or browse all products.
            </p>
            {tagFilter && (
              <button
                onClick={() => handleTagChange("")}
                style={{
                  marginTop: 20,
                  padding: "10px 24px",
                  borderRadius: 99,
                  background: "#1a1410",
                  color: "#c8a96e",
                  border: "none",
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: "'Jost', sans-serif",
                  cursor: "pointer",
                  letterSpacing: "1px",
                }}
              >
                Clear Filter
              </button>
            )}
          </motion.div>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 24 }}>
              {products.map((product, i) => (
                <ProductCard key={product._id} product={product} index={i} />
              ))}
            </div>

            {/* Pagination - Exact Logic Restored */}
            {totalPages > 1 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 6,
                  marginTop: 64,
                }}
              >
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  aria-label="Previous page"
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    border: "1.5px solid rgba(176,125,74,0.3)",
                    background: "rgba(176,125,74,0.06)",
                    cursor: page === 1 ? "not-allowed" : "pointer",
                    opacity: page === 1 ? 0.35 : 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#3a2e24",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (page !== 1) {
                      e.currentTarget.style.background = "#1a1410";
                      e.currentTarget.style.borderColor = "#1a1410";
                      e.currentTarget.style.color = "#c8a96e";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(176,125,74,0.06)";
                    e.currentTarget.style.borderColor = "rgba(176,125,74,0.3)";
                    e.currentTarget.style.color = "#3a2e24";
                  }}
                >
                  <svg width="8" height="13" viewBox="0 0 8 13" fill="none">
                    <path d="M7 1L1 6.5L7 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                <div style={{ display: "flex", gap: 5 }}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => Math.abs(p - page) <= 2)
                    .map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 12,
                          border: `1.5px solid ${p === page ? "#1a1410" : "rgba(176,125,74,0.25)"}`,
                          background: p === page ? "#1a1410" : "rgba(176,125,74,0.06)",
                          color: p === page ? "#c8a96e" : "#6a5a4a",
                          cursor: "pointer",
                          fontSize: 13,
                          fontWeight: p === page ? 700 : 400,
                          fontFamily: "'Jost', sans-serif",
                          transition: "all 0.2s ease",
                          boxShadow: p === page ? "0 4px 16px rgba(26,20,16,0.18)" : "none",
                        }}
                        onMouseEnter={(e) => {
                          if (p !== page) {
                            e.currentTarget.style.borderColor = "#1a1410";
                            e.currentTarget.style.background = "rgba(176,125,74,0.12)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (p !== page) {
                            e.currentTarget.style.borderColor = "rgba(176,125,74,0.25)";
                            e.currentTarget.style.background = "rgba(176,125,74,0.06)";
                          }
                        }}
                      >
                        {p}
                      </button>
                    ))}
                </div>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  aria-label="Next page"
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    border: "1.5px solid rgba(176,125,74,0.3)",
                    background: "rgba(176,125,74,0.06)",
                    cursor: page === totalPages ? "not-allowed" : "pointer",
                    opacity: page === totalPages ? 0.35 : 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#3a2e24",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (page !== totalPages) {
                      e.currentTarget.style.background = "#1a1410";
                      e.currentTarget.style.borderColor = "#1a1410";
                      e.currentTarget.style.color = "#c8a96e";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(176,125,74,0.06)";
                    e.currentTarget.style.borderColor = "rgba(176,125,74,0.3)";
                    e.currentTarget.style.color = "#3a2e24";
                  }}
                >
                  <svg width="8" height="13" viewBox="0 0 8 13" fill="none">
                    <path d="M1 1L7 6.5L1 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        @keyframes shimmer {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.45; }
        }
      `}</style>
    </section>
  );
}