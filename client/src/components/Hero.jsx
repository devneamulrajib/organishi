import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../api'; 
import { ChevronLeft, ChevronRight, MousePointer2 } from 'lucide-react';

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
    API.get('/hero-slides')
      .then(r => { 
        setSlides(r.data); 
        setStatus(r.data.length ? 'ok' : 'empty'); 
      })
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

  const defaultSlide = {
    _id: 'default',
    title: 'Fresh & Organic Daily',
    subtitle: 'WELCOME TO ORGANISHI',
    ctaText: 'SHOP NOW',
    mediaType: 'image'
  };

  const activeSlides = slides.length ? slides : [defaultSlide];
  const slide = activeSlides[current];
  
  const src = slide._id === 'default'
    ? "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1974"
    : slide.mediaUrl;

  return (
    <section style={{
      position: 'relative',
      height: '85vh', 
      width: '100%',
      overflow: 'hidden',
      background: '#000',
      display: 'block'
    }}>
      <style>{`
        .hero-btn-primary:hover { background: rgba(255,255,255,0.15) !important; color: #fff !important; transform: translateY(-2px); }
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
          {/* Dark overlay */}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.40)' }} />
        </motion.div>
      </AnimatePresence>

      {/* Content Layer — bottom-left */}
      <div style={{ 
        position: 'absolute',
        bottom: '10%',
        left: '8%',
        zIndex: 10,
        color: '#fff',
        maxWidth: '560px',
      }}>
        {/* Subtitle / label */}
        <motion.span
          key={slide._id + '-sub'}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            display: 'inline-block',
            fontSize: '13px',
            fontWeight: '700',
            letterSpacing: '4px',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.75)',
            marginBottom: '14px',
          }}
        >
          {slide.subtitle || 'PREMIUM & TRACEABLE'}
        </motion.span>

        {/* Main title */}
        <motion.h1
          key={slide._id + '-title'}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{
            fontSize: 'clamp(42px, 6vw, 82px)',
            fontWeight: '800',
            margin: '0 0 32px 0',
            lineHeight: 1.05,
            letterSpacing: '-1px',
          }}
        >
          {slide.title}
        </motion.h1>

        {/* CTA buttons */}
        <motion.div
          key={slide._id + '-btns'}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}
        >
          <a href="/products" className="hero-btn-primary" style={{
            padding: '14px 38px',
            background: '#fff',
            color: '#111',
            borderRadius: '50px',
            textDecoration: 'none',
            fontWeight: '700',
            fontSize: '13px',
            letterSpacing: '1px',
            transition: '0.3s',
            border: '2px solid #fff',
          }}>
            {slide.ctaText || 'SHOP NOW'}
          </a>
          <a href="/about" className="hero-btn-outline" style={{
            padding: '14px 38px',
            border: '2px solid rgba(255,255,255,0.6)',
            color: '#fff',
            borderRadius: '50px',
            textDecoration: 'none',
            fontWeight: '700',
            fontSize: '13px',
            letterSpacing: '1px',
            transition: '0.3s',
          }}>
            EXPLORE
          </a>
        </motion.div>
      </div>

      {/* Progress Bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '3px', background: 'rgba(255,255,255,0.1)' }}>
        <motion.div style={{ height: '100%', background: 'rgba(255,255,255,0.6)', width: `${progress}%` }} />
      </div>

      {/* Controls — bottom right */}
      <div style={{ position: 'absolute', bottom: 40, right: '8%', display: 'flex', gap: '10px', zIndex: 20 }}>
        <button onClick={prev} style={{ width: 45, height: 45, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.4)', background: 'transparent', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ChevronLeft size={20} />
        </button>
        <button onClick={next} style={{ width: 45, height: 45, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.4)', background: 'transparent', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Scroll Down Hint — bottom center */}
      <div className="scroll-indicator" style={{ position: 'absolute', bottom: 30, left: '50%', transform: 'translateX(-50%)', color: '#fff', textAlign: 'center', opacity: 0.6 }}>
        <div style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '2px', marginBottom: '5px' }}>SCROLL</div>
        <MousePointer2 size={18} />
      </div>
    </section>
  );
}