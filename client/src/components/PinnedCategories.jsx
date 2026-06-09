import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";

const API = 'http://localhost:5000';

function PinnedCategorySection({ category, index }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    fetch(`${API}/api/products?category=${encodeURIComponent(category.name)}&limit=${category.productLimit || 6}`)
      .then((r) => r.json())
      .then((data) => { setProducts(data.products || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [category.name]);

  if (!loading && products.length === 0) return null;

  return (
    <section className={`home-section pinned-category${index % 2 !== 0 ? " pinned-category--tinted" : ""}`}>
      <div className="home-section__container">
        <motion.div className="home-section__header"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
        >
          {category.icon && <span className="pinned-category__icon">{category.icon}</span>}
          <div className="home-section__label">{category.label || "Featured Category"}</div>
          <h2 className="home-section__title">{category.displayName || category.name}</h2>
          {category.description && <p className="home-section__sub">{category.description}</p>}
          <a href={`/products?category=${encodeURIComponent(category.name)}`} className="home-section__link">
            Shop {category.displayName || category.name} <span>→</span>
          </a>
        </motion.div>

        {category.bannerImage && (
          <motion.div className="pinned-category__banner"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          >
            <img src={category.bannerImage} alt={category.displayName || category.name} />
          </motion.div>
        )}

        {loading ? (
          <div className="product-grid">
            {Array.from({ length: category.productLimit || 6 }).map((_, i) => <div key={i} className="product-card skeleton" />)}
          </div>
        ) : (
          <div className={`product-grid product-grid--${category.gridCols || 4}`}>
            {products.map((product, i) => <ProductCard key={product._id} product={product} index={i} />)}
          </div>
        )}
      </div>
    </section>
  );
}

export default function PinnedCategories() {
  const [pinnedCats, setPinnedCats] = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    fetch(`${API}/api/homepage/pinned-categories`)
      .then((r) => r.json())
      .then((data) => { setPinnedCats(data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading || pinnedCats.length === 0) return null;

  return (
    <>
      {pinnedCats.map((cat, i) => (
        <PinnedCategorySection key={cat._id || cat.name} category={cat} index={i} />
      ))}
    </>
  );
}