import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { ChevronLeft, ChevronRight, MousePointer2 } from 'lucide-react';

const API = 'http://localhost:5000';
const SLIDE_DURATION = 6000;

export default function Hero() {
  const [slides, setSlides]     = useState([]);
  const [status, setStatus]     = useState('loading');
  const [current, setCurrent]   = useState(0);
  const [direction, setDir]     = useState(1);
  const [progress, setProgress] = useState(0);
  const rafRef   = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    axios.get(`${API}/api/hero-slides`)
      .then(r => { setSlides(r.data); setStatus(r.data.length ? 'ok' : 'empty'); })
      .catch(() => setStatus('error'));
  }, []);

  const goTo = useCallback((idx, dir = 1) => {
    if (!slides.length) return;
    setDir(dir);
    setCurrent(((idx % slides.length) + slides.length) % slides.length);
    setProgress(0);
    startRef.current = performance.now();
  }, [slides.length]);

  const next = useCallback(() => goTo(current + 1,  1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1, -1), [current, goTo]);

  /* Auto-advance */
  useEffect(() => {
    if (status !== 'ok' || slides.length < 2) return;
    startRef.current = performance.now();
    const tick = now => {
      const pct = Math.min(((now - startRef.current) / SLIDE_DURATION) * 100, 100);
      setProgress(pct);
      if (pct < 100) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setCurrent(c => (c + 1) % slides.length);
        setDir(1); setProgress(0);
        startRef.current = performance.now();
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [status, slides.length]);

  if (status === 'loading') return <div style={{ height: '80vh', background: '#fff' }} />;

  // Default slide if API fails (so your site never looks empty)
  const defaultSlide = {
    _id: 'default',
    title: 'Fresh & Organic Daily',
    subtitle: 'WELCOME TO BABAI BANGLADESH',
    ctaText: 'SHOP NOW',
    mediaUrl: '/uploads/hero-placeholder.jpg', // Ensure this exists or use a web link
    mediaType: 'image'
  };

  const activeSlides = slides.length ? slides : [defaultSlide];
  const slide = activeSlides[current];
  const src = slide._id === 'default' ? "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1974" : `${API}${slide.mediaUrl}`;

  return (
    <section style={{
      position: 'relative',
      height: '85vh', // Slightly less than full screen to hint at content below
      width: '100%',
      overflow: 'hidden',
      background: '#000',
      display: 'block'
    }}>
      <style>{`
        .hero-btn-primary:hover { background: #1a237e !important; color: #fff !important; transform: translateY(-2px); }
        .hero-btn-outline:hover { background: rgba(255,255,255,0.2) !important; transform: translateY(-2px); }
        .scroll-indicator { animation: bounce 2s infinite; }
        @keyframes bounce { 0%, 20%, 50%, 80%, 100% {transform: translateY(0);} 40% {transform: translateY(-10px);} 60% {transform: translateY(-5px);} }
      `}</style>

      {/* Media Layer */}
      <AnimatePresence custom={direction} mode="wait">
        <motion.div 
          key={slide._id} 
          initial={{ opacity: 0, scale: 1.1 }} 
          animate={{ opacity: 1, scale: 1 }} 
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          style={{ position: 'absolute', inset: 0 }}
        >
          {slide.mediaType === 'video' ? (
            <video src={src} autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          )}
          {/* Dark overlay to make text pop */}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)' }} />
        </motion.div>
      </AnimatePresence>

      {/* Content Layer */}
      <div style={{ 
        position: 'absolute', inset: 0, zIndex: 10,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '0 8%', color: '#fff'
      }}>
        <motion.span 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          style={{ fontSize: '14px', fontWeight: '700', letterSpacing: '3px', color: '#00bcd4', marginBottom: '15px' }}
        >
          {slide.subtitle || "PREMIUM & TRACEABLE"}
        </motion.span>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: 'clamp(40px, 6vw, 80px)', fontWeight: '800', margin: '0 0 30px 0', maxWidth: '800px', lineHeight: 1.1 }}
        >
          {slide.title}
        </motion.h1>

        <div style={{ display: 'flex', gap: '15px' }}>
          <a href="/products" className="hero-btn-primary" style={{
            padding: '15px 40px', background: '#fff', color: '#1a237e', borderRadius: '50px',
            textDecoration: 'none', fontWeight: '700', fontSize: '14px', transition: '0.3s'
          }}>
            {slide.ctaText || "SHOP NOW"}
          </a>
          <a href="/about" className="hero-btn-outline" style={{
            padding: '15px 40px', border: '2px solid #fff', color: '#fff', borderRadius: '50px',
            textDecoration: 'none', fontWeight: '700', fontSize: '14px', transition: '0.3s'
          }}>
            EXPLORE
          </a>
        </div>
      </div>

      {/* Progress Bar (Bottom) */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)' }}>
        <motion.div style={{ height: '100%', background: '#00bcd4', width: `${progress}%` }} />
      </div>

      {/* Controls */}
      <div style={{ position: 'absolute', bottom: 40, right: '8%', display: 'flex', gap: '10px', zIndex: 20 }}>
        <button onClick={prev} style={{ width: 45, height: 45, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.3)', background: 'transparent', color: '#fff', cursor: 'pointer' }}>
          <ChevronLeft size={20} />
        </button>
        <button onClick={next} style={{ width: 45, height: 45, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.3)', background: 'transparent', color: '#fff', cursor: 'pointer' }}>
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Scroll Down Hint (Matches Babai Design) */}
      <div className="scroll-indicator" style={{ position: 'absolute', bottom: 30, left: '50%', transform: 'translateX(-50%)', color: '#fff', textAlign: 'center', opacity: 0.7 }}>
        <div style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '2px', marginBottom: '5px' }}>SCROLL</div>
        <MousePointer2 size={20} />
      </div>
    </section>
  );
}