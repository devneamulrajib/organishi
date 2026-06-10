import { useState, useEffect, useRef } from "react";
import {
  Plus, Trash2, Eye, EyeOff, Edit2, ChevronUp, ChevronDown,
  CheckCircle, LayoutGrid, Image, Layers, Sparkles,
  TrendingUp, Pin, ShoppingBag, Monitor, Grid, Film, Upload, X,
} from "lucide-react";

import { BASE_URL } from "../api";
const API = BASE_URL;

const getToken = () => localStorage.getItem("token");
const authHdr  = () => ({ Authorization: `Bearer ${getToken()}`, "Content-Type": "application/json" });
const authFormHdr = () => ({ Authorization: `Bearer ${getToken()}` });

const SECTION_TYPES = [
  { value: 'hero',                label: 'Hero Banner',         Icon: Monitor },
  { value: 'featured_categories', label: 'Featured Categories', Icon: Grid },
  { value: 'new_arrivals',        label: 'New Arrivals',        Icon: Sparkles },
  { value: 'trending',            label: 'Trending Products',   Icon: TrendingUp },
  { value: 'all_products',        label: 'All Products Grid',   Icon: ShoppingBag },
  { value: 'pinned_categories',   label: 'Pinned Categories',   Icon: Pin },
  { value: 'single_banner',       label: 'Single Banner',       Icon: Image },
  { value: 'multi_banner',        label: 'Multi Banner Row',    Icon: Layers },
  { value: 'slideshow_banner',    label: 'Slideshow',           Icon: Film },
  { value: 'promo_banner',        label: 'Promo Banner',        Icon: LayoutGrid },
];

/* ── shared atoms ─────────────────────────────────────────────────────────── */
function Label({ children }) {
  return (
    <label style={{
      fontSize: 11, fontWeight: 500, letterSpacing: "1px",
      textTransform: "uppercase", color: "#888",
      display: "block", marginBottom: 6,
    }}>
      {children}
    </label>
  );
}

function FieldInput({ label, style, ...props }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && <Label>{label}</Label>}
      <input
        {...props}
        style={{
          background: "#fafafa", border: "1px solid #e8e8e8", borderRadius: 6,
          padding: "9px 13px", fontSize: 13, color: "#1a1a1a", outline: "none",
          fontFamily: "'Jost', sans-serif", width: "100%", boxSizing: "border-box",
          ...style,
        }}
        onFocus={e => (e.target.style.borderColor = "#B07D4A")}
        onBlur={e  => (e.target.style.borderColor = "#e8e8e8")}
      />
    </div>
  );
}

function FieldSelect({ label, children, ...props }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && <Label>{label}</Label>}
      <select
        {...props}
        style={{
          background: "#fafafa", border: "1px solid #e8e8e8", borderRadius: 6,
          padding: "9px 13px", fontSize: 13, color: "#1a1a1a", outline: "none",
          fontFamily: "'Jost', sans-serif", cursor: "pointer",
        }}
      >
        {children}
      </select>
    </div>
  );
}

function IconBtn({ onClick, title, danger, disabled, children }) {
  return (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      style={{
        width: 32, height: 32,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: danger ? "#fef2f2" : "#f5f0ec",
        border: "none", borderRadius: 6, cursor: disabled ? "not-allowed" : "pointer",
        color: danger ? "#ef4444" : "#6a5a4a",
        opacity: disabled ? 0.4 : 1, flexShrink: 0,
        transition: "background 0.15s",
      }}
    >
      {children}
    </button>
  );
}

/* ── Promo Banner Editor ─────────────────────────────────────────────────── */
function PromoBannerEditor({ sectionId, onSaved }) {
  const fileRef        = useRef();
  const [banners, setBanners]     = useState([]);
  const [loading, setLoading]     = useState(false);
  const [uploading, setUploading] = useState(false);
  const [file, setFile]           = useState(null);
  const [preview, setPreview]     = useState(null);
  const [link, setLink]           = useState("");
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast]         = useState(null);

  const showMsg = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const load = () => {
    fetch(`${API}/api/promo-banners/all`, { headers: authHdr() })
      .then(r => r.json())
      .then(data => setBanners(Array.isArray(data) ? data : []))
      .catch(() => {});
  };

  useEffect(load, []);

  const handleFile = f => {
    if (!f) return;
    setFile(f);
    if (f.type.startsWith("video/")) { setPreview("video"); }
    else { const r = new FileReader(); r.onload = e => setPreview(e.target.result); r.readAsDataURL(f); }
  };

  const handleUpload = async () => {
    if (!file && !editingId) { showMsg("Please select an image or video.", "error"); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      if (file) fd.append("media", file);
      fd.append("link", link);
      fd.append("active", "true");

      const url    = editingId ? `${API}/api/promo-banners/${editingId}` : `${API}/api/promo-banners`;
      const method = editingId ? "PUT" : "POST";
      const res    = await fetch(url, { method, headers: authFormHdr(), body: fd });
      if (!res.ok) throw new Error("Upload failed");
      showMsg(editingId ? "Banner updated!" : "Banner uploaded!");
      setFile(null); setPreview(null); setLink(""); setEditingId(null);
      load();
      if (onSaved) onSaved();
    } catch (e) { showMsg(e.message, "error"); }
    setUploading(false);
  };

  const handleDelete = async id => {
    setLoading(true);
    try {
      await fetch(`${API}/api/promo-banners/${id}`, { method: "DELETE", headers: authHdr() });
      showMsg("Deleted"); load();
    } catch { showMsg("Delete failed", "error"); }
    setLoading(false);
  };

  const startEdit = b => {
    setEditingId(b._id);
    setLink(b.link || "");
    setFile(null);
    setPreview(b.mediaType === "video" ? "video" : `${API}${b.mediaUrl}`);
  };

  const toggleActive = async b => {
    const fd = new FormData();
    fd.append("active", !b.active); fd.append("link", b.link || "");
    await fetch(`${API}/api/promo-banners/${b._id}`, { method: "PUT", headers: authFormHdr(), body: fd });
    load();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {toast && (
        <div style={{ padding: "10px 14px", borderRadius: 8, background: toast.type === "error" ? "#fef2f2" : "#f0fdf4", border: `1px solid ${toast.type === "error" ? "#fca5a5" : "#bbf7d0"}`, fontSize: 12, color: toast.type === "error" ? "#ef4444" : "#16a34a", display: "flex", alignItems: "center", gap: 8 }}>
          <CheckCircle size={13} /> {toast.msg}
        </div>
      )}

      <div style={{ background: "#faf8f5", borderRadius: 10, border: "1px solid #f0ece8", padding: 18 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#6a5a4a", letterSpacing: "0.5px", marginBottom: 14, textTransform: "uppercase" }}>
          {editingId ? "Edit Banner" : "Upload New Banner"}
        </div>

        <div
          onClick={() => fileRef.current.click()}
          style={{
            border: "2px dashed #d8cfc8", borderRadius: 10, padding: "28px 20px",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            gap: 10, cursor: "pointer", background: "#fff",
            minHeight: preview ? 180 : 120, marginBottom: 14, overflow: "hidden", position: "relative",
            transition: "border-color 0.18s",
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "#B07D4A"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "#d8cfc8"}
        >
          {preview ? (
            preview === "video"
              ? <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                  <Film size={36} color="#B07D4A" />
                  <span style={{ fontSize: 12, color: "#B07D4A" }}>Video selected — click to change</span>
                </div>
              : <img src={preview} alt="" style={{ maxHeight: 160, maxWidth: "100%", objectFit: "contain", borderRadius: 6 }} />
          ) : (
            <>
              <Upload size={24} color="#c0b0a0" />
              <span style={{ fontSize: 12, color: "#b0a090", textAlign: "center" }}>
                Click to upload banner image or video<br/>
                <span style={{ fontSize: 11, color: "#c8bdb0" }}>JPG · PNG · MP4 · WEBM — full-width, ~1920×480px recommended</span>
              </span>
            </>
          )}
          <input ref={fileRef} type="file" accept="image/*,video/*" onChange={e => handleFile(e.target.files[0])} style={{ display: "none" }} />
        </div>

        <FieldInput label="Click-through link (optional)" placeholder="/products or https://..." value={link} onChange={e => setLink(e.target.value)} style={{ marginBottom: 14 }} />

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={handleUpload}
            disabled={uploading}
            style={{ flex: 1, padding: "11px", background: uploading ? "#c8b8a8" : "#1a1410", color: "#fff", border: "none", borderRadius: 8, cursor: uploading ? "not-allowed" : "pointer", fontFamily: "'Jost', sans-serif", fontSize: 13, fontWeight: 500 }}
          >
            {uploading ? "Uploading…" : editingId ? "Update Banner" : "Upload Banner"}
          </button>
          {editingId && (
            <button onClick={() => { setEditingId(null); setFile(null); setPreview(null); setLink(""); }} style={{ padding: "11px 18px", background: "#f5f0ec", color: "#888", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: 13 }}>
              Cancel
            </button>
          )}
        </div>
      </div>

      {banners.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "1px", color: "#a09080", textTransform: "uppercase" }}>Saved Banners</div>
          {banners.map(b => (
            <div key={b._id} style={{ background: "#fff", borderRadius: 10, border: "1px solid #f0ece8", overflow: "hidden" }}>
              <div style={{ height: 90, background: "#f0ece8", position: "relative", overflow: "hidden" }}>
                {b.mediaType === "video"
                  ? <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#1a1410" }}><Film size={28} color="#666" /></div>
                  : <img src={`${API}${b.mediaUrl}`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                }
                <div style={{ position: "absolute", top: 8, left: 8, background: b.active ? "#16a34a" : "#999", color: "#fff", fontSize: 10, padding: "2px 8px", borderRadius: 99, letterSpacing: 1 }}>
                  {b.active ? "LIVE" : "HIDDEN"}
                </div>
              </div>
              <div style={{ padding: "10px 14px", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ flex: 1, fontSize: 12, color: "#b0a090", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {b.link || "(no link)"}
                </span>
                <IconBtn onClick={() => toggleActive(b)} title={b.active ? "Hide" : "Show"}>{b.active ? <Eye size={13}/> : <EyeOff size={13}/>}</IconBtn>
                <IconBtn onClick={() => startEdit(b)} title="Edit"><Edit2 size={13}/></IconBtn>
                <IconBtn danger onClick={() => handleDelete(b._id)} disabled={loading} title="Delete"><Trash2 size={13}/></IconBtn>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Banner editors ───────────────────────────────────────────────────────── */
function SingleBannerEditor({ data, onChange }) {
  const upd = (k, v) => onChange({ ...data, [k]: v });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <FieldInput label="Image URL *"   placeholder="https://..."      value={data.image      || ""} onChange={e => upd("image",      e.target.value)} />
        <FieldInput label="Link URL"      placeholder="/products"         value={data.link       || ""} onChange={e => upd("link",       e.target.value)} />
        <FieldInput label="Title"         placeholder="Summer Collection" value={data.title      || ""} onChange={e => upd("title",      e.target.value)} />
        <FieldInput label="Subtitle"      placeholder="Shop now"          value={data.subtitle   || ""} onChange={e => upd("subtitle",   e.target.value)} />
        <FieldInput label="Button Text"   placeholder="Shop Now"          value={data.buttonText || ""} onChange={e => upd("buttonText", e.target.value)} />
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <Label>Status</Label>
          <button
            type="button"
            onClick={() => upd("isActive", !data.isActive)}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 13px", background: data.isActive !== false ? "#f0fdf4" : "#faf8f5", border: `1px solid ${data.isActive !== false ? "#bbf7d0" : "#e8e8e8"}`, borderRadius: 6, cursor: "pointer", fontSize: 12, color: data.isActive !== false ? "#16a34a" : "#888", fontFamily: "'Jost', sans-serif" }}
          >
            {data.isActive !== false ? <Eye size={13} /> : <EyeOff size={13} />}
            {data.isActive !== false ? "Active" : "Inactive"}
          </button>
        </div>
      </div>
      {data.image && (
        <div style={{ borderRadius: 8, overflow: "hidden", maxHeight: 140, background: "#f0ece8" }}>
          <img src={data.image} alt="" style={{ width: "100%", height: 140, objectFit: "cover" }} />
        </div>
      )}
    </div>
  );
}

function MultiBannerEditor({ banners, onChange, interval, onIntervalChange }) {
  const add    = () => onChange([...banners, { id: Date.now().toString(), image: "", title: "", link: "", isActive: true }]);
  const upd    = (id, k, v) => onChange(banners.map(b => b.id === id ? { ...b, [k]: v } : b));
  const remove = id => onChange(banners.filter(b => b.id !== id));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {onIntervalChange && (
        <FieldInput label="Slideshow interval (ms)" type="number" min={1000} step={500} value={interval || 4000} onChange={e => onIntervalChange(e.target.value)} style={{ maxWidth: 160 }} />
      )}
      {banners.length === 0 && (
        <div style={{ padding: "24px", textAlign: "center", color: "#b0a090", fontSize: 13, background: "#faf8f5", borderRadius: 8 }}>
          No banners yet — click "Add Banner" below.
        </div>
      )}
      {banners.map((b, i) => (
        <div key={b.id} style={{ background: "#faf8f5", borderRadius: 8, padding: 16, border: "1px solid #f0ece8" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 500, color: "#6a5a4a", letterSpacing: "0.5px" }}>BANNER {i + 1}</span>
            <IconBtn danger onClick={() => remove(b.id)} title="Remove banner"><Trash2 size={13} /></IconBtn>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <FieldInput label="Image URL *" placeholder="https://..." value={b.image || ""} onChange={e => upd(b.id, "image", e.target.value)} />
            <FieldInput label="Link"        placeholder="/products"   value={b.link  || ""} onChange={e => upd(b.id, "link",  e.target.value)} />
            <FieldInput label="Title"                                 value={b.title || ""} onChange={e => upd(b.id, "title", e.target.value)} />
          </div>
          {b.image && (
            <div style={{ marginTop: 10, borderRadius: 6, overflow: "hidden", height: 80 }}>
              <img src={b.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}
        </div>
      ))}
      <button
        onClick={add}
        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px", background: "#f5f0ec", border: "1px dashed #d0c8c0", borderRadius: 8, cursor: "pointer", fontSize: 12, color: "#6a5a4a", fontFamily: "'Jost', sans-serif" }}
      >
        <Plus size={14} /> Add Banner
      </button>
    </div>
  );
}

/* ── Pinned Category editor ───────────────────────────────────────────────── */
function PinnedCatEditor({ cat, onChange, onUnpin }) {
  return (
    <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #f0ece8", overflow: "hidden" }}>
      <div style={{ padding: "12px 16px", background: "#faf8f5", borderBottom: "1px solid #f0ece8", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Pin size={13} color="#B07D4A" />
          <span style={{ fontWeight: 500, fontSize: 14, color: "#1a1410" }}>{cat.name}</span>
        </div>
        <button onClick={onUnpin} style={{ fontSize: 11, color: "#ef4444", background: "#fef2f2", border: "none", borderRadius: 5, padding: "4px 10px", cursor: "pointer", fontFamily: "'Jost', sans-serif" }}>Unpin</button>
      </div>
      <div style={{ padding: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <FieldInput label="Display Name"        value={cat.displayName  || ""} onChange={e => onChange({ displayName:  e.target.value })} />
        <FieldInput label="Label (above title)"  placeholder="Featured Category" value={cat.label || ""} onChange={e => onChange({ label: e.target.value })} />
        <FieldInput label="Description"          value={cat.description  || ""} onChange={e => onChange({ description: e.target.value })} />
        <FieldInput label="Emoji icon"           placeholder="🌿" style={{ maxWidth: 120 }} value={cat.icon || ""} onChange={e => onChange({ icon: e.target.value })} />
        <FieldInput label="Products to show"     type="number" min={2} max={24} value={cat.productLimit || 6} onChange={e => onChange({ productLimit: Number(e.target.value) })} />
        <FieldSelect label="Grid columns" value={cat.gridCols || 4} onChange={e => onChange({ gridCols: Number(e.target.value) })}>
          {[2, 3, 4, 5].map(n => <option key={n} value={n}>{n} columns</option>)}
        </FieldSelect>
        <div style={{ gridColumn: "1 / -1" }}>
          <FieldInput label="Banner Image URL" placeholder="https://..." value={cat.bannerImage || ""} onChange={e => onChange({ bannerImage: e.target.value })} />
        </div>
      </div>
    </div>
  );
}

/* ── Main component ───────────────────────────────────────────────────────── */
export default function HomepageManager() {
  const [sections,      setSections]      = useState([]);
  const [pinnedCats,    setPinnedCats]    = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [activeTab,     setActiveTab]     = useState("layout");
  const [saving,        setSaving]        = useState(false);
  const [toast,         setToast]         = useState(null);
  const [expandedId,    setExpandedId]    = useState(null);
  const [addingSection, setAddingSection] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/homepage/config`).then(r => r.json()),
      fetch(`${API}/api/homepage/pinned-categories`).then(r => r.json()),
      fetch(`${API}/api/categories`).then(r => r.json()),
    ]).then(([config, pinned, cats]) => {
      setSections(config?.sections || []);
      setPinnedCats(Array.isArray(pinned) ? pinned : []);
      setAllCategories(Array.isArray(cats) ? cats : []);
    }).catch(() => {});
  }, []);

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3200); };

  const moveSection = (index, dir) => {
    const arr = [...sections];
    const to  = index + dir;
    if (to < 0 || to >= arr.length) return;
    [arr[index], arr[to]] = [arr[to], arr[index]];
    arr.forEach((s, i) => (s.order = i + 1));
    setSections([...arr]);
  };

  const toggleSection = id => setSections(sections.map(s => s.id === id ? { ...s, isVisible: !s.isVisible } : s));
  const removeSection = id => setSections(sections.filter(s => s.id !== id));

  const addSection = type => {
    const newSection = {
      id: `${type}_${Date.now()}`,
      type,
      order: sections.length + 1,
      isVisible: true,
      bannerData:  type === "single_banner" ? { isActive: true } : undefined,
      bannersData: ["multi_banner", "slideshow_banner"].includes(type) ? [] : undefined,
      interval:    type === "slideshow_banner" ? 4000 : undefined,
    };
    setSections([...sections, newSection]);
    setExpandedId(newSection.id);
    setAddingSection(false);
  };

  const updateSection = (id, updates) => setSections(sections.map(s => s.id === id ? { ...s, ...updates } : s));

  const saveLayout = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/homepage/config`, { method: "POST", headers: authHdr(), body: JSON.stringify({ sections }) });
      if (!res.ok) throw new Error("Save failed");
      showToast("Layout saved!");
    } catch (e) { showToast(e.message, "error"); }
    setSaving(false);
  };

  const pinCategory = cat => {
    const name = cat.name || cat;
    if (pinnedCats.find(c => c.name === name)) return;
    setPinnedCats([...pinnedCats, { name, displayName: name, label: "Featured Category", description: "", productLimit: 6, gridCols: 4, icon: "", bannerImage: "", _id: Date.now().toString() }]);
  };
  const unpinCategory   = name => setPinnedCats(pinnedCats.filter(c => c.name !== name));
  const updatePinnedCat = (name, updates) => setPinnedCats(pinnedCats.map(c => c.name === name ? { ...c, ...updates } : c));

  const savePinnedCats = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/homepage/pinned-categories`, { method: "POST", headers: authHdr(), body: JSON.stringify(pinnedCats) });
      if (!res.ok) throw new Error("Save failed");
      showToast("Pinned categories saved!");
    } catch (e) { showToast(e.message, "error"); }
    setSaving(false);
  };

  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  return (
    <div style={{ minHeight: "100vh", overflowY: "auto", padding: 20 }}>
      {toast && (
        <div style={{ position: "fixed", top: 24, right: 24, zIndex: 9999, background: "#fff", borderRadius: 8, padding: "13px 18px", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 8px 32px rgba(0,0,0,0.12)", border: `1px solid ${toast.type === "error" ? "#fca5a5" : "#bbf7d0"}`, fontFamily: "'Jost', sans-serif", fontSize: 13, color: "#1a1a1a" }}>
          <CheckCircle size={15} color={toast.type === "error" ? "#ef4444" : "#22c55e"} />
          {toast.msg}
        </div>
      )}

      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 400, color: "#1a1410", marginBottom: 4 }}>Homepage Manager</h2>
      </div>

      <div style={{ display: "flex", gap: 4, marginBottom: 28, borderBottom: "1px solid #f0ece8" }}>
        {["layout", "categories"].map(key => (
          <button key={key} onClick={() => setActiveTab(key)} style={{ padding: "10px 18px", background: "none", border: "none", borderBottom: `2px solid ${activeTab === key ? "#1a1410" : "transparent"}`, color: activeTab === key ? "#1a1410" : "#a09080", fontFamily: "'Jost', sans-serif", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
            {key === "layout" ? "Section Layout" : "Pinned Categories"}
          </button>
        ))}
      </div>

      {activeTab === "layout" && (
        <div>
          <button
            onClick={() => setAddingSection(!addingSection)}
            style={{ display: "flex", alignItems: "center", gap: 7, background: "#1a1410", color: "#fff", border: "none", borderRadius: 8, padding: "11px 22px", cursor: "pointer", fontSize: 13, fontFamily: "'Jost', sans-serif" }}
          >
            <Plus size={14} /> {addingSection ? "Cancel" : "Add Section"}
          </button>

          {addingSection && (
            <div style={{ marginTop: 12, background: "#fff", borderRadius: 10, border: "1px solid #f0ece8", padding: 20 }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {SECTION_TYPES.map(({ value, label, Icon }) => (
                  <button key={value} onClick={() => addSection(value)} style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 14px", background: "#faf8f5", border: "1px solid #e8e4e0", borderRadius: 7, cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: 13 }}>
                    <Icon size={13} color="#B07D4A" /> {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 20 }}>
            {sortedSections.map((section, index) => {
              const typeInfo     = SECTION_TYPES.find(t => t.value === section.type);
              const Icon         = typeInfo?.Icon || Monitor;
              const isExpandable = ["single_banner", "multi_banner", "slideshow_banner", "promo_banner"].includes(section.type);
              const isExpanded   = expandedId === section.id;

              return (
                <div key={section.id} style={{ background: "#fff", borderRadius: 10, border: "1px solid #f0ece8", padding: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Icon size={16} color="#B07D4A" />
                    <div style={{ flex: 1, fontSize: 13, fontFamily: "'Jost', sans-serif", color: "#1a1410" }}>{typeInfo?.label}</div>
                    <div style={{ display: "flex", gap: 5 }}>
                      <IconBtn onClick={() => moveSection(index, -1)} disabled={index === 0}><ChevronUp size={14}/></IconBtn>
                      <IconBtn onClick={() => moveSection(index, 1)} disabled={index === sortedSections.length - 1}><ChevronDown size={14}/></IconBtn>
                      <IconBtn onClick={() => toggleSection(section.id)}>{section.isVisible ? <Eye size={13}/> : <EyeOff size={13}/>}</IconBtn>
                      {isExpandable && <IconBtn onClick={() => setExpandedId(isExpanded ? null : section.id)}><Edit2 size={13}/></IconBtn>}
                      <IconBtn danger onClick={() => removeSection(section.id)}><Trash2 size={13}/></IconBtn>
                    </div>
                  </div>

                  {isExpandable && isExpanded && (
                    <div style={{ marginTop: 16, borderTop: "1px solid #eee", paddingTop: 16 }}>
                      {section.type === "single_banner" && (
                        <SingleBannerEditor data={section.bannerData || {}} onChange={d => updateSection(section.id, { bannerData: d })} />
                      )}
                      {(section.type === "multi_banner" || section.type === "slideshow_banner") && (
                        <MultiBannerEditor banners={section.bannersData || []} onChange={b => updateSection(section.id, { bannersData: b })} interval={section.interval} onIntervalChange={v => updateSection(section.id, { interval: Number(v) })} />
                      )}
                      {section.type === "promo_banner" && (
                        <PromoBannerEditor sectionId={section.id} onSaved={() => showToast("Banner saved!")} />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <button onClick={saveLayout} disabled={saving} style={{ marginTop: 20, padding: "13px 32px", background: saving ? "#c8b8a8" : "#1a1410", color: "#fff", border: "none", borderRadius: 8, cursor: saving ? "not-allowed" : "pointer", fontFamily: "'Jost', sans-serif", fontSize: 13, fontWeight: 500 }}>
            {saving ? "Saving…" : "Save Layout"}
          </button>
        </div>
      )}

      {activeTab === "categories" && (
        <div>
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #f0ece8", padding: 24, marginBottom: 20 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {allCategories.map(cat => (
                <button key={cat.name} onClick={() => pinnedCats.some(c => c.name === cat.name) ? unpinCategory(cat.name) : pinCategory(cat)} style={{ padding: "8px 14px", borderRadius: 20, border: `1px solid ${pinnedCats.some(c => c.name === cat.name) ? "#B07D4A" : "#e0d8d0"}`, background: pinnedCats.some(c => c.name === cat.name) ? "#fdf3e8" : "#fff", color: pinnedCats.some(c => c.name === cat.name) ? "#B07D4A" : "#6a5a4a", cursor: "pointer", fontSize: 13, fontFamily: "'Jost', sans-serif" }}>
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
          {pinnedCats.map(cat => (
            <PinnedCatEditor key={cat.name} cat={cat} onChange={u => updatePinnedCat(cat.name, u)} onUnpin={() => unpinCategory(cat.name)} />
          ))}
          <button onClick={savePinnedCats} disabled={saving} style={{ marginTop: 20, padding: "13px 32px", background: saving ? "#c8b8a8" : "#1a1410", color: "#fff", border: "none", borderRadius: 8, cursor: saving ? "not-allowed" : "pointer", fontFamily: "'Jost', sans-serif", fontSize: 13, fontWeight: 500 }}>
            {saving ? "Saving…" : "Save Pinned Categories"}
          </button>
        </div>
      )}
    </div>
  );
}