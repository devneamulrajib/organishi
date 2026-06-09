import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API = 'http://localhost:5000';

const TINTS = [
  '#FFF4EC', '#ECFDF5', '#EEF2FF', '#FDF2F8',
  '#F0FDFA', '#FFFBEB', '#FFF1F2', '#F0F9FF',
  '#F5F3FF', '#ECFEFF', '#FFF7ED', '#F0FDF4',
];

function getTint(cat, index) {
  if (cat.color) return cat.color + '22';
  return TINTS[index % TINTS.length];
}

/* ── Background SVG drawing ── */
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
      {/* Soft blobs */}
      <circle cx="120"  cy="80"  r="160" fill="#F0EBE3" fillOpacity=".5" />
      <circle cx="1300" cy="240" r="130" fill="#E8F0FB" fillOpacity=".5" />
      <circle cx="700"  cy="310" r="110" fill="#EDF7EE" fillOpacity=".45" />
      <circle cx="1180" cy="50"  r="85"  fill="#FDF0F5" fillOpacity=".5" />
      <circle cx="200"  cy="260" r="75"  fill="#F5F0FD" fillOpacity=".5" />
      <circle cx="900"  cy="40"  r="65"  fill="#FFF9E6" fillOpacity=".55" />

      {/* Dashed lines */}
      <line x1="280" y1="40"  x2="380" y2="130" stroke="#E2DDD8" strokeWidth="1" strokeDasharray="5 8" />
      <line x1="1060" y1="220" x2="1160" y2="140" stroke="#D8E4F0" strokeWidth="1" strokeDasharray="5 8" />
      <line x1="580" y1="20"  x2="660" y2="75"  stroke="#DDF0DE" strokeWidth="1" strokeDasharray="4 9" />
      <line x1="820" y1="280" x2="900" y2="220" stroke="#F0D8E8" strokeWidth="1" strokeDasharray="4 8" />

      {/* Floating rectangles */}
      <rect x="1080" y="65"  width="52" height="52" rx="14" stroke="#E8D8F0" strokeWidth="1.3" fill="none" transform="rotate(18 1106 91)" />
      <rect x="180"  y="185" width="40" height="40" rx="11" stroke="#D8EAD8" strokeWidth="1.3" fill="none" transform="rotate(-12 200 205)" />
      <rect x="620"  y="40"  width="36" height="36" rx="10" stroke="#F0E8D8" strokeWidth="1.3" fill="none" transform="rotate(8 638 58)" />

      {/* Circles outline */}
      <circle cx="860"  cy="70"  r="20" stroke="#F0D8E8" strokeWidth="1.3" fill="none" />
      <circle cx="460"  cy="255" r="15" stroke="#D8E8F8" strokeWidth="1.3" fill="none" />
      <circle cx="1250" cy="140" r="18" stroke="#DDE8D8" strokeWidth="1.3" fill="none" />
      <circle cx="340"  cy="130" r="12" stroke="#E8DDF8" strokeWidth="1.3" fill="none" />

      {/* Curved strokes */}
      <path d="M 80 165 Q 130 145 175 168"   stroke="#E0DAD4" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <path d="M 1150 110 Q 1195 92 1230 114" stroke="#D5E3F5" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <path d="M 640 285 Q 680 268 720 287"   stroke="#D8EDD8" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <path d="M 940 200 Q 975 182 1010 202"  stroke="#F0D8D8" strokeWidth="1.3" fill="none" strokeLinecap="round" />

      {/* Small dots */}
      <circle cx="395"  cy="175" r="3.5" fill="#DDD8D2" />
      <circle cx="985"  cy="195" r="3.5" fill="#C8D8E8" />
      <circle cx="760"  cy="110" r="3"   fill="#E0D0E8" />
      <circle cx="530"  cy="65"  r="3"   fill="#C8E0C8" />
      <circle cx="1100" cy="200" r="2.5" fill="#E8D8C8" />
      <circle cx="240"  cy="100" r="2.5" fill="#C8D8E8" />
    </svg>
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
        width: 120,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 13,
        padding: '16px 12px',
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
      {/* Bubble */}
      <motion.div
        animate={{
          y: isHovered ? -6 : 0,
          boxShadow: isHovered
            ? '0 14px 32px rgba(0,0,0,0.11), 0 4px 10px rgba(0,0,0,0.07)'
            : '0 2px 8px rgba(0,0,0,0.06)',
        }}
        transition={{ type: 'spring', stiffness: 340, damping: 26 }}
        style={{
          width: 80,
          height: 80,
          borderRadius: 22,
          background: tint,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Sheen */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: '42%',
          background: 'linear-gradient(180deg,rgba(255,255,255,0.55) 0%,transparent 100%)',
          borderRadius: '22px 22px 0 0',
          pointerEvents: 'none',
        }} />

        {/* Shimmer on hover */}
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
            src={`${API}${cat.imageUrl}`}
            alt={cat.name}
            animate={{ scale: isHovered ? 1.12 : 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            style={{ width: 42, height: 42, objectFit: 'contain', position: 'relative', zIndex: 1 }}
          />
        ) : (
          <motion.span
            animate={{ scale: isHovered ? 1.15 : 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            style={{ fontSize: 36, lineHeight: 1, position: 'relative', zIndex: 1 }}
          >
            {cat.icon || '🛒'}
          </motion.span>
        )}
      </motion.div>

      {/* Label */}
      <motion.span
        animate={{ color: isHovered ? '#111111' : '#AAAAAA' }}
        transition={{ duration: 0.18 }}
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: '0.15px',
          lineHeight: 1.35,
          textAlign: 'center',
          maxWidth: 100,
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
              width: 42,
              height: 42,
              borderRadius: '50%',
              border: '1.5px solid #E4E4E4',
              background: '#FFFFFF',
              color: '#444',
              fontSize: 18,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
              fontFamily: 'sans-serif',
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

/* ── Dot indicator ── */
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
  const trackRef = useRef(null);

  useEffect(() => {
    axios.get(`${API}/api/categories`)
      .then(r => {
        // /api/categories returns a plain array; guard against paginated shape just in case
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
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" />

      <section style={{
        background: '#FAFAF8',
        padding: 'clamp(40px, 6vw, 72px) 0 clamp(36px, 5vw, 60px)',
        position: 'relative',
        overflow: 'hidden',
      }}>

        {/* Background art */}
        <BgArt />

        {/* Content — centered */}
        <div style={{
          position: 'relative', zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 28,
        }}>

          {/* Row: arrow + tiles + arrow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Arrow dir={-1} onClick={goLeft} visible={canLeft} />

            {/* Tile track — fixed width for exactly 5 items */}
            <div
              ref={trackRef}
              style={{
                display: 'flex',
                alignItems: 'stretch',
                overflow: 'hidden',
                width: `${VISIBLE * 120}px`,
              }}
            >
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
                  {/* Fill empty slots so layout stays stable */}
                  {visible.length < VISIBLE && Array.from({ length: VISIBLE - visible.length }).map((_, i) => (
                    <div key={`empty-${i}`} style={{ width: 120, flexShrink: 0 }} />
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            <Arrow dir={1} onClick={goRight} visible={canRight} />
          </div>

          {/* Page dots */}
          {totalPages > 1 && (
            <Dots total={totalPages} current={page} />
          )}

        </div>
      </section>
    </>
  );
}