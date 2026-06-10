import { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronRight, Package, TrendingUp, Sparkles, Truck, ShieldCheck, Clock, RefreshCcw } from 'lucide-react';

import ProductCard from './ProductCard';
import Hero from './Hero';
import FeaturedCategories from './FeaturedCategories';
import TrendingProducts from './TrendingProducts';
import NewArrivals from './NewArrivals';
import PromoBanner from './PromoBanner';
import { SingleBanner, MultiBanner, SlideshowBanner } from './Banner';
import { BASE_URL } from '../api';

const API = BASE_URL;

function TrustBadges() {
  const badges = [
    { icon: <ShieldCheck size={24} />, title: '100% Genuine',   sub: 'Quality Assured' },
    { icon: <Truck size={24} />,       title: 'Fast Delivery',  sub: 'In 24 Hours' },
    { icon: <Clock size={24} />,       title: 'High Quality',   sub: 'Handpicked' },
    { icon: <RefreshCcw size={24} />,  title: '30 Days Return', sub: 'Money Back' },
  ];
  return (
    <div style={{ background: '#f9fafb', borderTop: '1px solid #f3f4f6', borderBottom: '1px solid #f3f4f6' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '20px 5%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          {badges.map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', borderRadius: 10, background: '#fff', border: '1px solid #f3f4f6' }}>
              <div style={{ color: '#1a237e', flexShrink: 0 }}>{b.icon}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#1a1a1a' }}>{b.title}</div>
                <div style={{ fontSize: 11, color: '#9ca3af' }}>{b.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ title, icon, linkHref }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, paddingBottom: 14, borderBottom: '2px solid #f3f4f6' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ color: '#1a237e' }}>{icon}</div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1a1a1a', margin: 0 }}>{title}</h2>
      </div>
      {linkHref && (
        <a href={linkHref} style={{ fontSize: 13, fontWeight: 700, color: '#00bcd4', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
          View All <ChevronRight size={15} />
        </a>
      )}
    </div>
  );
}

function ProductGrid({ params }) {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    axios.get(`${API}/api/products?${new URLSearchParams(params)}`)
      .then(r => setData(Array.isArray(r.data) ? r.data : (r.data.products || [])))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, [JSON.stringify(params)]);

  if (loading) return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 18 }}>
      {[1,2,3,4].map(i => <div key={i} style={{ aspectRatio: '0.85', background: '#f3f4f6', borderRadius: 14 }} />)}
    </div>
  );
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 18 }}>
      {data.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
    </div>
  );
}

function BannerBlock({ section }) {
  switch (section.type) {
    case 'single_banner':    return <SingleBanner banner={section.bannerData} />;
    case 'multi_banner':     return <MultiBanner banners={section.bannersData ?? []} />;
    case 'slideshow_banner': return <SlideshowBanner banners={section.bannersData ?? []} interval={section.interval ?? 4000} />;
    default: return null;
  }
}

const BANNER_TYPES  = new Set(['single_banner', 'multi_banner', 'slideshow_banner']);
const PRODUCT_TYPES = new Set(['all_products', 'trending', 'new_arrivals']);

const SECTION_META = {
  all_products: { title: 'Best Sellers', icon: <Package size={20} />,    href: '/products' },
  trending:     { title: 'Trending',     icon: <TrendingUp size={20} />, href: '/products' },
  new_arrivals: { title: 'New Arrivals', icon: <Sparkles size={20} />,   href: '/products' },
};

function InlineProductGrid({ type }) {
  const tag   = type === 'trending' ? 'trending' : 'new';
  const limit = 8;
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  useEffect(() => {
    const url = type === 'all_products'
      ? `${API}/api/products?limit=${limit}`
      : `${API}/api/products?tags=${tag}&limit=${limit}`;
    fetch(url).then(r => r.json())
      .then(d => { setProducts(Array.isArray(d) ? d : d.products || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [type]);

  if (loading) return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px,1fr))', gap: 16 }}>
      {[1,2,3,4].map(i => <div key={i} style={{ aspectRatio: '0.85', background: '#f3f4f6', borderRadius: 14 }} />)}
    </div>
  );
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px,1fr))', gap: 16 }}>
      {products.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
    </div>
  );
}

function ProductWithSidebar({ section, banners }) {
  const meta = SECTION_META[section.type];
  return (
    <div style={{ borderTop: '1px solid #f3f4f6' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '52px 5%' }}>
        {meta && <SectionHeader title={meta.title} icon={meta.icon} linkHref={meta.href} />}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 24, alignItems: 'start' }}>
          <InlineProductGrid type={section.type} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {banners.map(bs => <BannerBlock key={bs.id} section={bs} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

function StandaloneSection({ section }) {
  if (section.type === 'trending')     return <TrendingProducts />;
  if (section.type === 'new_arrivals') return <NewArrivals />;
  const meta = SECTION_META[section.type];
  return (
    <div style={{ borderTop: '1px solid #f3f4f6' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '52px 5%' }}>
        {meta && <SectionHeader title={meta.title} icon={meta.icon} linkHref={meta.href} />}
        <ProductGrid params={{ limit: 8 }} />
      </div>
    </div>
  );
}

function PromoBannerSection() {
  return (
    <div style={{ width: '100%' }}>
      <PromoBanner />
    </div>
  );
}

export default function HomePage() {
  const [sections, setSections] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/homepage/config`)
      .then(r => r.json())
      .then(data => {
        const list = (data?.sections || [])
          .filter(s => s.isVisible !== false)
          .sort((a, b) => a.order - b.order);
        setSections(list);
      })
      .catch(() => setSections([]));
  }, []);

  if (sections === null) return <div style={{ height: '100vh', background: '#fff' }} />;

  if (sections.length === 0) {
    return (
      <div style={{ background: '#fff', minHeight: '100vh' }}>
        <Hero />
        <TrustBadges />
        <div style={{ borderTop: '1px solid #f3f4f6' }}>
          <div style={{ maxWidth: 1320, margin: '0 auto', padding: '52px 5%' }}>
            <SectionHeader title="Best Sellers" icon={<Package size={20} />} linkHref="/products" />
            <ProductGrid params={{ limit: 8 }} />
          </div>
        </div>
        <TrendingProducts />
        <NewArrivals />
      </div>
    );
  }

  const nodes = [];
  let i = 0;
  while (i < sections.length) {
    const s = sections[i];

    if (s.type === 'hero')                { nodes.push(<Hero key={s.id} />);               i++; continue; }
    if (s.type === 'featured_categories') { nodes.push(<FeaturedCategories key={s.id} />); i++; continue; }
    if (s.type === 'trust_badges')        { nodes.push(<TrustBadges key={s.id} />);        i++; continue; }

    if (s.type === 'promo_banner') {
      nodes.push(<PromoBannerSection key={s.id} />);
      i++; continue;
    }

    if (PRODUCT_TYPES.has(s.type)) {
      const trailing = [];
      let j = i + 1;
      while (j < sections.length && BANNER_TYPES.has(sections[j].type)) {
        trailing.push(sections[j]);
        j++;
      }
      if (trailing.length > 0) {
        nodes.push(<ProductWithSidebar key={s.id} section={s} banners={trailing} />);
        i = j;
      } else {
        nodes.push(<StandaloneSection key={s.id} section={s} />);
        i++;
      }
      continue;
    }

    if (BANNER_TYPES.has(s.type)) {
      nodes.push(
        <div key={s.id} style={{ borderTop: '1px solid #f3f4f6' }}>
          <div style={{ maxWidth: 1320, margin: '0 auto', padding: '32px 5%' }}>
            <BannerBlock section={s} />
          </div>
        </div>
      );
      i++; continue;
    }

    i++;
  }

  return <div style={{ background: '#fff', minHeight: '100vh' }}>{nodes}</div>;
}