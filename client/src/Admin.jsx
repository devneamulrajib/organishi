import { useState, useEffect, useRef } from 'react';
// Import our smart API instance and the BASE_URL for images
import API, { BASE_URL } from './api'; 
import HomepageManager from "./components/HomepageManager";
import {
  LayoutDashboard, Package, Image, Plus, Trash2, LogOut,
  Upload, X, CheckCircle, Edit2, Eye, EyeOff, GripVertical,
  ChevronRight, BarChart2, Film, Tag,
} from 'lucide-react';

const getToken = () => localStorage.getItem('token');
const authHdr     = () => ({ Authorization: `Bearer ${getToken()}` });
const authFormHdr = () => ({
  Authorization: `Bearer ${getToken()}`,
  'Content-Type': 'multipart/form-data',
});

// ── All available product tags ──────────────────────────────────────────────
const PRODUCT_TAGS = [
  { value: 'new',         label: 'New Arrival',  color: '#1a1410', bg: '#f0ece8',  emoji: '✨' },
  { value: 'trending',    label: 'Trending',     color: '#c94433', bg: '#fef2f0',  emoji: '🔥' },
  { value: 'featured',    label: 'Featured',     color: '#B07D4A', bg: '#fdf3e8',  emoji: '⭐' },
  { value: 'sale',        label: 'On Sale',      color: '#e85d4a', bg: '#fff0ee',  emoji: '🏷️' },
  { value: 'organic',     label: 'Organic',      color: '#5a8a5a', bg: '#f0f7f0',  emoji: '🌿' },
  { value: 'best-seller', label: 'Best Seller',  color: '#7a5ab0', bg: '#f5f0fc',  emoji: '🏆' },
  { value: 'cold-press',  label: 'Cold Pressed', color: '#4a7ab0', bg: '#eef4fc',  emoji: '❄️' },
  { value: 'limited',     label: 'Limited',      color: '#a05a20', bg: '#fdf5ec',  emoji: '⏳' },
];

/* ─── tiny ui atoms ─── */
function Toast({ message, type = 'success', onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3200); return () => clearTimeout(t); }, []);
  return (
    <div style={{
      position: 'fixed', top: 24, right: 24, zIndex: 9999,
      background: '#fff', borderRadius: 8,
      padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 10,
      boxShadow: '0 8px 40px rgba(0,0,0,0.14)',
      border: `1px solid ${type === 'error' ? '#fca5a5' : '#bbf7d0'}`,
      fontFamily: "'Jost', sans-serif", fontSize: 13, color: '#1a1a1a',
      minWidth: 260,
    }}>
      <CheckCircle size={16} color={type === 'error' ? '#ef4444' : '#22c55e'} />
      {message}
      <button onClick={onClose} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}><X size={14} /></button>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <label style={{ fontSize: 11, fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase', color: '#888' }}>{label}</label>}
      <input {...props} style={{
        background: '#fafafa', border: '1px solid #e8e8e8', borderRadius: 6,
        padding: '10px 14px', fontSize: 13, color: '#1a1a1a', outline: 'none',
        fontFamily: "'Jost', sans-serif", transition: 'border 0.18s',
        ...props.style,
      }}
        onFocus={e => e.target.style.borderColor = '#B07D4A'}
        onBlur={e => e.target.style.borderColor = '#e8e8e8'}
      />
    </div>
  );
}

function SelectInput({ label, value, onChange, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <label style={{ fontSize: 11, fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase', color: '#888' }}>{label}</label>}
      <select value={value} onChange={onChange} style={{
        background: '#fafafa', border: '1px solid #e8e8e8', borderRadius: 6,
        padding: '10px 14px', fontSize: 13, color: '#1a1a1a', outline: 'none',
        fontFamily: "'Jost', sans-serif", transition: 'border 0.18s', cursor: 'pointer',
      }}
        onFocus={e => e.target.style.borderColor = '#B07D4A'}
        onBlur={e => e.target.style.borderColor = '#e8e8e8'}
      >
        {children}
      </select>
    </div>
  );
}

function DropZone({ label, accept, preview, onFile, hint }) {
  const ref = useRef();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <label style={{ fontSize: 11, fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase', color: '#888' }}>{label}</label>}
      <div onClick={() => ref.current.click()} style={{
        border: '2px dashed #e0d8d0', borderRadius: 8, padding: '20px 16px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 8, cursor: 'pointer', minHeight: 110, background: '#faf8f5',
        transition: 'border 0.18s', position: 'relative', overflow: 'hidden',
      }}
        onMouseEnter={e => e.currentTarget.style.borderColor = '#B07D4A'}
        onMouseLeave={e => e.currentTarget.style.borderColor = '#e0d8d0'}
      >
        {preview ? (
          preview === 'video' || (typeof preview === 'string' && (preview.startsWith('video') || preview.endsWith('.mp4') || preview.endsWith('.webm'))) ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <Film size={28} color="#B07D4A" />
              <span style={{ fontSize: 11, color: '#B07D4A' }}>Video selected</span>
            </div>
          ) : (
            <img src={preview} alt="" style={{ maxHeight: 80, maxWidth: '100%', objectFit: 'contain', borderRadius: 4 }} />
          )
        ) : (
          <>
            <Upload size={20} color="#c0b0a0" />
            <span style={{ fontSize: 11, color: '#b0a090', textAlign: 'center' }}>{hint || 'Click to upload'}</span>
          </>
        )}
        <input ref={ref} type="file" accept={accept} onChange={e => onFile(e.target.files[0])} style={{ display: 'none' }} />
      </div>
    </div>
  );
}

/* ─── Tag selector component ─── */
function TagSelector({ selectedTags, onChange }) {
  const toggle = (value) => {
    const next = selectedTags.includes(value)
      ? selectedTags.filter(t => t !== value)
      : [...selectedTags, value];
    onChange(next);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <label style={{ fontSize: 11, fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase', color: '#888' }}>
        Product Tags / Labels
      </label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {PRODUCT_TAGS.map(tag => {
          const isSelected = selectedTags.includes(tag.value);
          return (
            <button
              key={tag.value}
              type="button"
              onClick={() => toggle(tag.value)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 14px',
                borderRadius: 99,
                border: `1.5px solid ${isSelected ? tag.color : '#e0d8d0'}`,
                background: isSelected ? tag.bg : '#fff',
                color: isSelected ? tag.color : '#a09080',
                fontSize: 12, fontWeight: isSelected ? 700 : 400,
                fontFamily: "'Jost', sans-serif",
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                letterSpacing: '0.3px',
              }}
            >
              <span>{tag.emoji}</span>
              {tag.label}
              {isSelected && (
                <span style={{
                  width: 14, height: 14, borderRadius: '50%',
                  background: tag.color, color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 9, fontWeight: 700,
                }}>✓</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── DASHBOARD ─── */
function Dashboard({ products, slides, categories }) {
  const stats = [
    { label: 'Products',      value: products.length,                       icon: Package, color: '#B07D4A' },
    { label: 'Hero Slides',   value: slides.length,                         icon: Image,   color: '#5A8A5A' },
    { label: 'Categories',    value: categories.length,                     icon: Tag,     color: '#7A5AB0' },
    { label: 'Active Slides', value: slides.filter(s => s.active).length,   icon: Eye,     color: '#4A7AB0' },
  ];
  return (
    <div>
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 400, color: '#1a1410', marginBottom: 8 }}>Dashboard</h2>
      <p style={{ color: '#a09080', fontSize: 13, marginBottom: 36 }}>Welcome back. Here's your store at a glance.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 48 }}>
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} style={{ background: '#fff', borderRadius: 12, padding: '24px 20px', border: '1px solid #f0ece8', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 16, right: 16, width: 36, height: 36, borderRadius: 8, background: `${color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={16} color={color} />
            </div>
            <div style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#b0a090', marginBottom: 10 }}>{label}</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 42, fontWeight: 600, color: '#1a1410', lineHeight: 1 }}>{value}</div>
          </div>
        ))}
      </div>

      {slides.length > 0 && (
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #f0ece8', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f5f0ec' }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 400, color: '#1a1410', margin: 0 }}>Hero Slides</h3>
          </div>
          <div style={{ display: 'flex', overflowX: 'auto' }}>
            {slides.slice(0, 5).map(slide => (
              <div key={slide._id} style={{ position: 'relative', minWidth: 200, height: 120, flexShrink: 0 }}>
                {slide.mediaType === 'video' ? (
                  <div style={{ width: '100%', height: '100%', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Film size={24} color="#666" />
                  </div>
                ) : (
                  <img src={`${BASE_URL}${slide.mediaUrl}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                )}
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 500, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{slide.title || 'Untitled'}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: slide.active ? '#4ade80' : '#f87171' }} />
                    <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.7)', letterSpacing: 1 }}>{slide.active ? 'ACTIVE' : 'HIDDEN'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── CATEGORIES PANEL ─── */
function CategoriesPanel({ categories, onRefresh, onToast }) {
  const PRESET_COLORS = [
    { label: 'Amber',  color: '#B07D4A', dark: '#8A5C30' },
    { label: 'Forest', color: '#5A8A5A', dark: '#3A6A3A' },
    { label: 'Indigo', color: '#5A6AB0', dark: '#3A4A90' },
    { label: 'Rose',   color: '#B05A6A', dark: '#903A4A' },
    { label: 'Teal',   color: '#4A9090', dark: '#2A7070' },
    { label: 'Purple', color: '#8A5AB0', dark: '#6A3A90' },
    { label: 'Copper', color: '#C4784A', dark: '#A05030' },
    { label: 'Sage',   color: '#7A9A6A', dark: '#5A7A4A' },
  ];
  const emptyForm = { name: '', icon: '🛒', link: '/', color: '#B07D4A', colorDark: '#8A5C30', order: 0, active: true };
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState(null);
  const [loading, setLoading]   = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [form, setForm]         = useState(emptyForm);
  const [imgFile, setImgFile]   = useState(null);
  const [imgPreview, setPreview]= useState(null);

  const openAdd  = () => { setEditing(null); setForm(emptyForm); setImgFile(null); setPreview(null); setShowForm(true); };
  const openEdit = c => {
    setEditing(c);
    setForm({ name: c.name, icon: c.icon || '🛒', link: c.link || '/', color: c.color || '#B07D4A', colorDark: c.colorDark || '#8A5C30', order: c.order ?? 0, active: c.active });
    setImgFile(null);
    setPreview(c.imageUrl ? `${BASE_URL}${c.imageUrl}` : null);
    setShowForm(true);
  };
  const close = () => { setShowForm(false); setEditing(null); };

  const handleImgFile = file => {
    if (!file) return;
    setImgFile(file);
    const reader = new FileReader();
    reader.onload = e => setPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) return onToast('Category name is required', 'error');
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imgFile) fd.append('image', imgFile);
      
      if (editing) {
        await API.put(`/categories/${editing._id}`, fd, { headers: authFormHdr() });
        onToast('Category updated');
      } else {
        await API.post(`/categories`, fd, { headers: authFormHdr() });
        onToast('Category added');
      }
      close(); onRefresh();
    } catch (err) {
      onToast(err?.response?.data?.error || 'Error saving category', 'error');
    }
    setLoading(false);
  };

  const handleDelete = async id => {
    setDeleting(id);
    try {
      await API.delete(`/categories/${id}`, { headers: authHdr() });
      onToast('Category deleted'); onRefresh();
    } catch { onToast('Delete failed', 'error'); }
    setDeleting(null);
  };

  const toggleActive = async cat => {
    try {
      const fd = new FormData();
      Object.entries({ ...cat, active: !cat.active }).forEach(([k, v]) => fd.append(k, v));
      await API.put(`/categories/${cat._id}`, fd, { headers: authFormHdr() });
      onToast(cat.active ? 'Category hidden' : 'Category shown'); onRefresh();
    } catch { onToast('Error updating', 'error'); }
  };

  const EMOJI_PRESETS = ['🛒','🥗','🍯','🌿','🫒','🌾','🥜','🍵','🌱','🧄','🥦','🍋','🫙','🧂','🍄','🫐','🍇','🌺','🫚','🥛'];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 400, color: '#1a1410', marginBottom: 4 }}>Featured Categories</h2>
          <p style={{ color: '#a09080', fontSize: 13 }}>{categories.length} categories</p>
        </div>
        <button onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: 7, background: '#1a1410', color: '#fff', border: 'none', borderRadius: 8, padding: '11px 22px', cursor: 'pointer', fontSize: 12, fontWeight: 500, fontFamily: "'Jost', sans-serif" }}>
          <Plus size={15} /> Add Category
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #f0ece8', padding: 28, marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 400, color: '#1a1410', margin: 0 }}>{editing ? 'Edit Category' : 'New Category'}</h3>
            <button onClick={close} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}><X size={18} /></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
             {/* Form Inputs (Same as your original) */}
             <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Input label="Category Name *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              <Input label="Link / URL" value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Input label="Order" type="number" value={form.order} onChange={e => setForm(f => ({ ...f, order: parseInt(e.target.value) || 0 }))} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 11, fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase', color: '#888' }}>Visibility</label>
                  <button type="button" onClick={() => setForm(f => ({ ...f, active: !f.active }))} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: form.active ? '#f0fdf4' : '#faf8f5', border: `1px solid ${form.active ? '#bbf7d0' : '#e8e8e8'}`, borderRadius: 6, cursor: 'pointer', fontSize: 12, color: form.active ? '#16a34a' : '#888', fontFamily: "'Jost', sans-serif" }}>
                    {form.active ? <Eye size={14} /> : <EyeOff size={14} />}
                    {form.active ? 'Visible' : 'Hidden'}
                  </button>
                </div>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: 8 }}>Icon Emoji</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                  {EMOJI_PRESETS.map(e => (
                    <button key={e} onClick={() => setForm(f => ({ ...f, icon: e }))} style={{ width: 36, height: 36, fontSize: 20, borderRadius: 8, border: 'none', cursor: 'pointer', background: form.icon === e ? '#f0e8d8' : '#f5f0ec', outline: form.icon === e ? '2px solid #B07D4A' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{e}</button>
                  ))}
                </div>
                <Input label="Or type custom emoji" placeholder="🍋" value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: 8 }}>Accent Color</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                  {PRESET_COLORS.map(({ label, color, dark }) => (
                    <button key={label} title={label} onClick={() => setForm(f => ({ ...f, color, colorDark: dark }))} style={{ width: 32, height: 32, borderRadius: '50%', background: `linear-gradient(135deg, ${color}, ${dark})`, border: 'none', cursor: 'pointer', outline: form.color === color ? '3px solid #1a1410' : '2px solid transparent', outlineOffset: 2 }} />
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <Input label="Main color" type="text" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} />
                  <Input label="Dark color" type="text" value={form.colorDark} onChange={e => setForm(f => ({ ...f, colorDark: e.target.value }))} />
                </div>
              </div>
              <DropZone label="Icon Image (overrides emoji)" accept="image/*" preview={imgPreview} onFile={handleImgFile} hint="PNG with transparency works best" />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button onClick={handleSubmit} disabled={loading} style={{ flex: 1, padding: '13px', background: loading ? '#c8b8a8' : '#1a1410', color: '#fff', border: 'none', borderRadius: 8, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'Jost', sans-serif", fontSize: 13, fontWeight: 500 }}>
              {loading ? 'Saving...' : editing ? 'Update Category' : 'Save Category'}
            </button>
            <button onClick={close} style={{ padding: '13px 20px', background: '#f5f0ec', color: '#888', border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: "'Jost', sans-serif", fontSize: 13 }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
          {categories.map(cat => (
            <div key={cat._id} style={{ background: '#fff', borderRadius: 12, border: '1px solid #f0ece8', overflow: 'hidden' }}>
              <div style={{ height: 6, background: `linear-gradient(to right, ${cat.color || '#B07D4A'}, ${cat.colorDark || '#8A5C30'})` }} />
              <div style={{ padding: '16px 16px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 13, background: `linear-gradient(145deg, ${cat.color || '#B07D4A'}, ${cat.colorDark || '#8A5C30'})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                    {cat.imageUrl ? <img src={`${BASE_URL}${cat.imageUrl}`} alt="" style={{ width: '70%', height: '70%', objectFit: 'contain' }} /> : cat.icon || '🛒'}
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: '#1a1410', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cat.name}</div>
                    <div style={{ fontSize: 11, color: '#b0a090', marginTop: 2 }}>Order {cat.order ?? 0}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => toggleActive(cat)} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 10px', background: cat.active ? '#f0fdf4' : '#f5f5f5', border: `1px solid ${cat.active ? '#bbf7d0' : '#e8e8e8'}`, borderRadius: 6, cursor: 'pointer', fontSize: 11, color: cat.active ? '#16a34a' : '#999', fontFamily: "'Jost', sans-serif" }}>
                    {cat.active ? <Eye size={11} /> : <EyeOff size={11} />}
                    {cat.active ? 'Shown' : 'Hidden'}
                  </button>
                  <button onClick={() => openEdit(cat)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '6px 10px', background: '#f5f0ec', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, color: '#6a5a4a', fontFamily: "'Jost', sans-serif" }}>
                    <Edit2 size={12} /> Edit
                  </button>
                  <button onClick={() => handleDelete(cat._id)} disabled={deleting === cat._id} style={{ width: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fef2f2', border: 'none', borderRadius: 6, cursor: 'pointer', color: '#ef4444' }}>
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

/* ─── PRODUCTS PANEL ─── */
function ProductsPanel({ products, categories, onRefresh, onToast }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState(null);
  const [loading, setLoading]   = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [filterTag, setFilterTag] = useState('');

  const emptyForm = { name: '', price: '', originalPrice: '', category: '', tags: [] };
  const [form, setForm]         = useState(emptyForm);
  const [files, setFiles]       = useState({ bottle: null, nut: null });
  const [previews, setPreviews] = useState({ bottle: null, nut: null });

  const openAdd = () => {
    setEditing(null); setForm(emptyForm);
    setFiles({ bottle: null, nut: null }); setPreviews({ bottle: null, nut: null });
    setShowForm(true);
  };
  const openEdit = p => {
    setEditing(p);
    setForm({ name: p.name, price: p.price || '', originalPrice: p.originalPrice || '', category: p.category || '', tags: p.tags || [] });
    setFiles({ bottle: null, nut: null });
    setPreviews({ bottle: p.bottleImg ? `${BASE_URL}${p.bottleImg}` : null, nut: p.nutImg ? `${BASE_URL}${p.nutImg}` : null });
    setShowForm(true);
  };
  const close = () => { setShowForm(false); setEditing(null); };

  const handleFile = (key, file) => {
    if (!file) return;
    setFiles(f => ({ ...f, [key]: file }));
    const reader = new FileReader();
    reader.onload = e => setPreviews(p => ({ ...p, [key]: e.target.result }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) return onToast('Product name is required', 'error');
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'tags') fd.append(k, JSON.stringify(v));
        else fd.append(k, v);
      });
      if (files.bottle) fd.append('bottle', files.bottle);
      if (files.nut)    fd.append('nut', files.nut);

      if (editing) {
        await API.put(`/products/${editing._id}`, fd, { headers: authFormHdr() });
        onToast('Product updated');
      } else {
        await API.post(`/products`, fd, { headers: authFormHdr() });
        onToast('Product added');
      }
      close(); onRefresh();
    } catch (err) {
      onToast(err?.response?.data?.message || 'Error saving product', 'error');
    }
    setLoading(false);
  };

  const handleDelete = async id => {
    setDeleting(id);
    try {
      await API.delete(`/products/${id}`, { headers: authHdr() });
      onToast('Product deleted'); onRefresh();
    } catch { onToast('Delete failed', 'error'); }
    setDeleting(null);
  };

  const filteredProducts = filterTag ? products.filter(p => p.tags?.includes(filterTag)) : products;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 400, color: '#1a1410', marginBottom: 4 }}>Products</h2>
          <p style={{ color: '#a09080', fontSize: 13 }}>{products.length} items</p>
        </div>
        <button onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: 7, background: '#1a1410', color: '#fff', border: 'none', borderRadius: 8, padding: '11px 22px', cursor: 'pointer', fontSize: 12, fontWeight: 500, fontFamily: "'Jost', sans-serif" }}>
          <Plus size={15} /> Add Product
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #f0ece8', padding: 28, marginBottom: 28 }}>
           {/* Product Form Content (Same as your original) */}
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 400, color: '#1a1410', margin: 0 }}>{editing ? 'Edit Product' : 'New Product'}</h3>
            <button onClick={close} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}><X size={18} /></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
            <Input label="Product Name *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            <Input label="Price (USD)" type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
            <Input label="Original Price" type="number" value={form.originalPrice} onChange={e => setForm(f => ({ ...f, originalPrice: e.target.value }))} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <SelectInput label="Category" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
              <option value="">— No category —</option>
              {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </SelectInput>
          </div>
          <div style={{ marginBottom: 20, padding: 20, background: '#faf8f5', borderRadius: 10, border: '1px solid #f0ece8' }}>
            <TagSelector selectedTags={form.tags} onChange={tags => setForm(f => ({ ...f, tags }))} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            <DropZone label="Product Image" accept="image/*" preview={previews.bottle} onFile={f => handleFile('bottle', f)} />
            <DropZone label="Ingredient Thumbnail" accept="image/*" preview={previews.nut} onFile={f => handleFile('nut', f)} />
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={handleSubmit} disabled={loading} style={{ flex: 1, padding: '13px', background: loading ? '#c8b8a8' : '#1a1410', color: '#fff', border: 'none', borderRadius: 8, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'Jost', sans-serif", fontSize: 13, fontWeight: 500 }}>
              {loading ? 'Saving...' : editing ? 'Update Product' : 'Save Product'}
            </button>
            <button onClick={close} style={{ padding: '13px 20px', background: '#f5f0ec', color: '#888', border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: "'Jost', sans-serif", fontSize: 13 }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
          {filteredProducts.map(p => (
            <div key={p._id} style={{ background: '#fff', borderRadius: 12, border: '1px solid #f0ece8', overflow: 'hidden' }}>
              <div style={{ height: 160, background: '#faf8f5', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {p.bottleImg ? <img src={`${BASE_URL}${p.bottleImg}`} alt="" style={{ height: '100%', width: '100%', objectFit: 'contain', padding: 16 }} /> : <Package size={36} color="#d0c8c0" />}
              </div>
              <div style={{ padding: '14px 16px' }}>
                <div style={{ fontWeight: 500, fontSize: 15, color: '#1a1410', marginBottom: 4 }}>{p.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: '#B07D4A' }}>${p.price}</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => openEdit(p)} style={{ flex: 1, padding: '8px', background: '#f5f0ec', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, color: '#6a5a4a' }}><Edit2 size={13} /> Edit</button>
                  <button onClick={() => handleDelete(p._id)} disabled={deleting === p._id} style={{ width: 36, background: '#fef2f2', border: 'none', borderRadius: 6, cursor: 'pointer', color: '#ef4444' }}><Trash2 size={13} /></button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

/* ─── HERO SLIDES PANEL ─── */
function SlidesPanel({ slides, onRefresh, onToast }) {
  const [showForm, setShowForm]         = useState(false);
  const [editing, setEditing]           = useState(null);
  const [loading, setLoading]           = useState(false);
  const [deleting, setDeleting]         = useState(null);
  const emptyForm = { title: '', subtitle: '', ctaText: 'Shop Now', ctaLink: '/products', order: 0, active: true };
  const [form, setForm]                 = useState(emptyForm);
  const [mediaFile, setMediaFile]       = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);

  const openAdd  = () => { setEditing(null); setForm(emptyForm); setMediaFile(null); setMediaPreview(null); setShowForm(true); };
  const openEdit = s => {
    setEditing(s);
    setForm({ title: s.title, subtitle: s.subtitle, ctaText: s.ctaText, ctaLink: s.ctaLink, order: s.order, active: s.active });
    setMediaFile(null);
    setMediaPreview(s.mediaType === 'video' ? 'video' : `${BASE_URL}${s.mediaUrl}`);
    setShowForm(true);
  };
  const close = () => { setShowForm(false); setEditing(null); };

  const handleMediaFile = file => {
    if (!file) return;
    setMediaFile(file);
    if (file.type.startsWith('video/')) setMediaPreview('video');
    else { const r = new FileReader(); r.onload = e => setMediaPreview(e.target.result); r.readAsDataURL(file); }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (mediaFile) fd.append('media', mediaFile);
      
      if (editing) {
        await API.put(`/hero-slides/${editing._id}`, fd, { headers: authFormHdr() });
        onToast('Slide updated');
      } else {
        await API.post(`/hero-slides`, fd, { headers: authFormHdr() });
        onToast('Slide added');
      }
      close(); onRefresh();
    } catch (err) { onToast('Error saving slide', 'error'); }
    setLoading(false);
  };

  const handleDelete = async id => {
    setDeleting(id);
    try { await API.delete(`/hero-slides/${id}`, { headers: authHdr() }); onToast('Deleted'); onRefresh(); }
    catch { onToast('Failed', 'error'); }
    setDeleting(null);
  };

  const toggleActive = async slide => {
    try {
      const fd = new FormData();
      Object.entries({ ...slide, active: !slide.active }).forEach(([k, v]) => fd.append(k, v));
      await API.put(`/hero-slides/${slide._id}`, fd, { headers: authFormHdr() });
      onToast('Status updated'); onRefresh();
    } catch { onToast('Error', 'error'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 400, color: '#1a1410', marginBottom: 4 }}>Hero Slides</h2>
        </div>
        <button onClick={openAdd} style={{ background: '#1a1410', color: '#fff', border: 'none', borderRadius: 8, padding: '11px 22px', cursor: 'pointer' }}><Plus size={15} /> Add Slide</button>
      </div>

      {showForm && (
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #f0ece8', padding: 28, marginBottom: 28 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
                <DropZone label="Media *" accept="image/*,video/*" preview={mediaPreview} onFile={handleMediaFile} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <Input label="Headline" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
                    <Input label="Sub-label" value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} />
                </div>
            </div>
            <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', padding: '13px', background: '#1a1410', color: '#fff', borderRadius: 8 }}>{loading ? 'Uploading...' : 'Save Slide'}</button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {slides.map(slide => (
            <div key={slide._id} style={{ background: '#fff', borderRadius: 12, border: '1px solid #f0ece8', overflow: 'hidden' }}>
              <div style={{ height: 160, background: '#1a1410', position: 'relative' }}>
                {slide.mediaType === 'video' ? <video src={`${BASE_URL}${slide.mediaUrl}`} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <img src={`${BASE_URL}${slide.mediaUrl}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
              </div>
              <div style={{ padding: '12px 14px', display: 'flex', gap: 8 }}>
                <button onClick={() => toggleActive(slide)} style={{ padding: '7px 12px', background: slide.active ? '#f0fdf4' : '#f5f5f5', borderRadius: 6 }}>{slide.active ? 'Live' : 'Hidden'}</button>
                <button onClick={() => openEdit(slide)} style={{ flex: 1, background: '#f5f0ec', borderRadius: 6 }}>Edit</button>
                <button onClick={() => handleDelete(slide._id)} style={{ color: '#ef4444' }}><Trash2 size={13} /></button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

/* ─── MAIN ADMIN ─── */
export default function Admin() {
  const [page, setPage]             = useState('dashboard');
  const [products, setProducts]     = useState([]);
  const [slides, setSlides]         = useState([]);
  const [categories, setCategories] = useState([]);
  const [toast, setToast]           = useState(null);
  const [sidebarOpen, setSidebar]   = useState(true);

  const showToast = (message, type = 'success') => setToast({ message, type });

  const fetchAll = async () => {
    try {
      const [pr, sl, cat] = await Promise.all([
        API.get(`/products`),
        API.get(`/hero-slides/all`, { headers: authHdr() }),
        API.get(`/categories/all`, { headers: authHdr() }),
      ]);
      setProducts(pr.data.products || pr.data);
      setSlides(sl.data);
      setCategories(cat.data);
    } catch (err) { console.error('fetch error', err); }
  };

  useEffect(() => { fetchAll(); }, []);

  const navItems = [
    { id: 'dashboard',  label: 'Dashboard',   icon: LayoutDashboard },
    { id: 'categories', label: 'Categories',  icon: Tag },
    { id: 'products',   label: 'Products',    icon: Package },
    { id: 'slides',     label: 'Hero Slides', icon: Image },
    { id: 'homepage',   label: 'Homepage',    icon: BarChart2 },
  ];

  return (
    <>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=Jost:wght@300;400;500;600&display=swap" />
      <style>{`* { box-sizing: border-box; } body { background: #F5F2EE !important; color: #1a1410 !important; } .nav-item { transition: all 0.15s; } .nav-item:hover { background: #f0ece8 !important; } .nav-item.active { background: #1a1410 !important; color: #fff !important; } .nav-item.active svg { color: #fff !important; }`}</style>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div style={{ display: 'flex', height: '100vh', background: '#F5F2EE', fontFamily: "'Jost', sans-serif", overflow: 'hidden' }}>
        <aside style={{ width: sidebarOpen ? 240 : 68, flexShrink: 0, background: '#fff', borderRight: '1px solid #ede8e2', display: 'flex', flexDirection: 'column', transition: 'width 0.25s' }}>
          <div style={{ padding: '24px 20px', borderBottom: '1px solid #f0ece8', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#1a1410', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ color: '#c8a96e' }}>O</span></div>
            {sidebarOpen && <div><div style={{ fontWeight: 600 }}>Organishi</div><div style={{ fontSize: 10, color: '#b0a090' }}>Admin</div></div>}
          </div>
          <nav style={{ flex: 1, padding: '16px 10px' }}>
            {navItems.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setPage(id)} className={`nav-item${page === id ? ' active' : ''}`} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '11px 12px', borderRadius: 8, border: 'none', background: 'transparent', color: page === id ? '#fff' : '#6a5a4a', cursor: 'pointer' }}>
                <Icon size={17} />{sidebarOpen && label}
              </button>
            ))}
          </nav>
          <div style={{ padding: '12px 10px', borderTop: '1px solid #f0ece8' }}>
            <button onClick={() => setSidebar(o => !o)} style={{ width: '100%', display: 'flex', gap: 12, padding: '11px 12px', border: 'none', background: 'transparent', color: '#b0a090', cursor: 'pointer' }}><GripVertical size={17} />{sidebarOpen && 'Collapse'}</button>
            <button onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }} style={{ width: '100%', display: 'flex', gap: 12, padding: '11px 12px', border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer' }}><LogOut size={17} />{sidebarOpen && 'Logout'}</button>
          </div>
        </aside>
        <main style={{ flex: 1, overflow: 'auto', padding: '40px' }}>
          {page === 'dashboard'  && <Dashboard   products={products}  slides={slides}   categories={categories} />}
          {page === 'categories' && <CategoriesPanel categories={categories} onRefresh={fetchAll} onToast={showToast} />}
          {page === 'products'   && <ProductsPanel   products={products}  categories={categories} onRefresh={fetchAll} onToast={showToast} />}
          {page === 'slides'     && <SlidesPanel     slides={slides}      onRefresh={fetchAll} onToast={showToast} />}
          {page === 'homepage'   && <HomepageManager />}
        </main>
      </div>
    </>
  );
}