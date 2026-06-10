import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../api';

const TINTS = [
  '#FFF4EC', '#ECFDF5', '#EEF2FF', '#FDF2F8',
  '#F0FDFA', '#FFFBEB', '#FFF1F2', '#F0F9FF',
  '#F5F3FF', '#ECFEFF', '#FFF7ED', '#F0FDF4',
];

function getTint(cat, index) {
  if (cat.color) return cat.color + '22';
  return TINTS[index % TINTS.length];
}

/* ── Background SVG ── */
function BgArt() {
  return (
    <svg
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      viewBox="0 0 1400 320"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="120"  cy="80"  r="160" fill="#F0EBE3" fillOpacity=".5" />
      <circle cx="1300" cy="240" r="130" fill="#E8F0FB" fillOpacity=".5" />
      <circle cx="700"  cy="310" r="110" fill="#EDF7EE" fillOpacity=".45" />
      <circle cx="1180" cy="50"  r="85"  fill="#FDF0F5" fillOpacity=".5" />
      <circle cx="200"  cy="260" r="75"  fill="#F5F0FD" fillOpacity=".5" />
      <circle cx="900"  cy="40"  r="65"  fill="#FFF9E6" fillOpacity=".55" />
      <line x1="280" y1="40"  x2="380" y2="130" stroke="#E2DDD8" strokeWidth="1" strokeDasharray="5 8" />
      <line x1="1060" y1="220" x2="1160" y2="140" stroke="#D8E4F0" strokeWidth="1" strokeDasharray="5 8" />
      <rect x="1080" y="65"  width="52" height="52" rx="14" stroke="#E8D8F0" strokeWidth="1.3" fill="none" transform="rotate(18 1106 91)" />
      <rect x="180"  y="185" width="40" height="40" rx="11" stroke="#D8EAD8" strokeWidth="1.3" fill="none" transform="rotate(-12 200 205)" />
      <circle cx="860"  cy="70"  r="20" stroke="#F0D8E8" strokeWidth="1.3" fill="none" />
      <circle cx="460"  cy="255" r="15" stroke="#D8E8F8" strokeWidth="1.3" fill="none" />
      <circle cx="395"  cy="175" r="3.5" fill="#DDD8D2" />
      <circle cx="985"  cy="195" r="3.5" fill="#C8D8E8" />
      <circle cx="760"  cy="110" r="3"   fill="#E0D0E8" />
    </svg>
  );
}

/* ── Inline "Categories" label — no box, pure typographic ── */
function CategoryLabel() {
  return (
    <div style={{
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'center',
      gap: 4,
      paddingRight: 20,
      minWidth: 140,
    }}>
      {/* Eyebrow */}
      <span style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: '#BBBBBB',
        lineHeight: 1,
      }}>
        Shop by
      </span>

      {/* Main word */}
      <span style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: 28,
        fontWeight: 800,
        letterSpacing: '-0.03em',
        lineHeight: 1.05,
        color: '#0D0D0D',
        display: 'block',
        position: 'relative',
      }}>
        Categories
        {/* Subtle underline accent */}
        <span style={{
          position: 'absolute',
          bottom: -3,
          left: 0,
          width: '100%',
          height: 3,
          borderRadius: 2,
          background: 'linear-gradient(90deg, #111 0%, #888 60%, transparent 100%)',
          opacity: 0.18,
        }} />
      </span>
    </div>
  );
}

/* ── Vertical divider ── */
function Divider() {
  return (
    <div style={{
      width: 1,
      height: 52,
      flexShrink: 0,
      background: 'linear-gradient(180deg, transparent 0%, #D8D8D8 40%, #D8D8D8 60%, transparent 100%)',
      margin: '0 12px',
    }} />
  );
}

/* ── "View All" link ── */
function ViewMore({ href }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.a
      href={href || '/categories'}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileTap={{ scale: 0.95 }}
      style={{
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 7,
        textDecoration: 'none',
        padding: '11px 20px 11px 16px',
        borderRadius: 100,
        border: `1.5px solid ${hovered ? '#111' : '#E0E0E0'}`,
        background: hovered ? '#0D0D0D' : 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        transition: 'all 0.22s ease',
        boxShadow: hovered
          ? '0 6px 20px rgba(0,0,0,0.15)'
          : '0 2px 8px rgba(0,0,0,0.05)',
      }}
    >
      <span style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: hovered ? '#ffffff' : '#444444',
        transition: 'color 0.22s ease',
        lineHeight: 1,
      }}>
        View All
      </span>
      <motion.span
        animate={{ x: hovered ? 3 : 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        style={{
          fontSize: 15,
          color: hovered ? '#ffffff' : '#888888',
          transition: 'color 0.22s ease',
          lineHeight: 1,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        →
      </motion.span>
    </motion.a>
  );
}

/* ── Category tile ── */
function CatItem({ cat, index, isHovered, onHover }) {
  const tint = getTint(cat, index);
  return (
    <motion.a
      href={cat.link || '#'}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
      whileTap={{ scale: 0.97 }}
      style={{
        flexShrink: 0,
        width: 130,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 11,
        padding: '14px 8px',
        textDecoration: 'none',
        cursor: 'pointer',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        borderRadius: 18,
        background: isHovered ? 'rgba(0,0,0,0.025)' : 'transparent',
        transition: 'background 0.18s ease',
        position: 'relative',
      }}
    >
      <motion.div
        animate={{
          y: isHovered ? -5 : 0,
          boxShadow: isHovered
            ? '0 14px 32px rgba(0,0,0,0.11), 0 4px 10px rgba(0,0,0,0.07)'
            : '0 2px 8px rgba(0,0,0,0.06)',
        }}
        transition={{ type: 'spring', stiffness: 340, damping: 26 }}
        style={{
          width: 86,
          height: 86,
          borderRadius: 24,
          background: tint,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: '42%',
          background: 'linear-gradient(180deg,rgba(255,255,255,0.55) 0%,transparent 100%)',
          borderRadius: '24px 24px 0 0',
          pointerEvents: 'none',
        }} />
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ x: '-130%' }}
              animate={{ x: '220%' }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: 'easeInOut' }}
              style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(110deg,transparent 25%,rgba(255,255,255,0.45) 50%,transparent 75%)',
                pointerEvents: 'none',
              }}
            />
          )}
        </AnimatePresence>
        {cat.imageUrl ? (
          <motion.img
            src={cat.imageUrl}
            alt={cat.name}
            animate={{ scale: isHovered ? 1.12 : 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            style={{ width: 44, height: 44, objectFit: 'contain', position: 'relative', zIndex: 1 }}
          />
        ) : (
          <motion.span
            animate={{ scale: isHovered ? 1.15 : 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            style={{ fontSize: 38, lineHeight: 1, position: 'relative', zIndex: 1 }}
          >
            {cat.icon || '🛒'}
          </motion.span>
        )}
      </motion.div>

      <motion.span
        animate={{ color: isHovered ? '#111111' : '#AAAAAA' }}
        transition={{ duration: 0.18 }}
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: '0.1px',
          lineHeight: 1.35,
          textAlign: 'center',
          maxWidth: 110,
        }}
      >
        {cat.name}
      </motion.span>
    </motion.a>
  );
}

/* ── Arrow button ── */
function Arrow({ dir, onClick, visible }) {
  return (
    <div style={{ width: 44, flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
      <AnimatePresence>
        {visible && (
          <motion.button
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.75 }}
            whileHover={{ scale: 1.1, borderColor: '#C8C8C8', boxShadow: '0 6px 20px rgba(0,0,0,0.10)' }}
            whileTap={{ scale: 0.93 }}
            onClick={onClick}
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              border: '1.5px solid #E4E4E4',
              background: '#FFFFFF',
              color: '#444',
              fontSize: 19,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
          >
            {dir === -1 ? '‹' : '›'}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Dots ── */
function Dots({ total, current }) {
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center', justifyContent: 'center' }}>
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            width: i === current ? 20 : 6,
            background: i === current ? '#222222' : '#DDDDDD',
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          style={{ height: 6, borderRadius: 3 }}
        />
      ))}
    </div>
  );
}

const VISIBLE = 5;

/* ── Main ── */
export default function FeaturedCategories() {
  const [categories, setCategories] = useState([]);
  const [status, setStatus]         = useState('loading');
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [page, setPage]             = useState(0);

  useEffect(() => {
    API.get('/categories')
      .then(r => {
        const list = Array.isArray(r.data) ? r.data : (r.data.products || []);
        setCategories(list);
        setStatus(list.length ? 'ok' : 'empty');
      })
      .catch(() => setStatus('error'));
  }, []);

  const totalPages = Math.ceil(categories.length / VISIBLE);
  const canLeft    = page > 0;
  const canRight   = page < totalPages - 1;

  const goLeft  = () => setPage(p => Math.max(0, p - 1));
  const goRight = () => setPage(p => Math.min(totalPages - 1, p + 1));

  const visible = categories.slice(page * VISIBLE, page * VISIBLE + VISIBLE);

  if (status === 'loading') return (
    <section style={{
      background: '#FAFAF8',
      padding: '52px 0',
      display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8,
    }}>
      {[0,1,2,3].map(i => (
        <motion.div key={i}
          style={{ width: 7, height: 7, borderRadius: '50%', background: '#DDDDDD' }}
          animate={{ y: [0, -8, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.12 }}
        />
      ))}
    </section>
  );

  if (status === 'empty' || status === 'error') return null;

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" />

      <section style={{
        background: '#FAFAF8',
        padding: 'clamp(40px, 6vw, 72px) 0 clamp(36px, 5vw, 60px)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <BgArt />

        <div style={{
          position: 'relative', zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20,
        }}>
          {/* Single row: Label | divider | ‹ | icons | › | divider | View All */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
          }}>
            <CategoryLabel />
            <Divider />
            <Arrow dir={-1} onClick={goLeft} visible={canLeft} />

            {/* Icon strip */}
            <div style={{
              display: 'flex',
              alignItems: 'stretch',
              overflow: 'hidden',
              width: `${VISIBLE * 130}px`,
            }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={page}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  style={{ display: 'flex', width: '100%' }}
                >
                  {visible.map((cat, i) => (
                    <CatItem
                      key={cat._id}
                      cat={cat}
                      index={page * VISIBLE + i}
                      isHovered={hoveredIdx === page * VISIBLE + i}
                      onHover={setHoveredIdx}
                    />
                  ))}
                  {visible.length < VISIBLE && Array.from({ length: VISIBLE - visible.length }).map((_, i) => (
                    <div key={`empty-${i}`} style={{ width: 130, flexShrink: 0 }} />
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            <Arrow dir={1} onClick={goRight} visible={canRight} />
            <Divider />
            <ViewMore href="/categories" />
          </div>

          {totalPages > 1 && (
            <Dots total={totalPages} current={page} />
          )}
        </div>
      </section>
    </>
  );
}