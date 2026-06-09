require('dotenv').config();
const express   = require('express');
const mongoose  = require('mongoose');
const multer    = require('multer');
const cors      = require('cors');
const path      = require('path');
const fs        = require('fs');
const bcrypt    = require('bcryptjs');
const jwt       = require('jsonwebtoken');

// Import the external HomepageConfig model
const HomepageConfig = require('./models/HomepageConfig');

const app = express();
app.use(cors());
app.use(express.json());

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
app.use('/uploads', express.static(uploadDir));

// ── Models ──────────────────────────────────────────────────────
const Product = mongoose.model('Product', new mongoose.Schema({
  name:      String,
  bgColor:   String,
  textColor: String,
  bottleImg: String,
  nutImg:    String,
  price:        Number,
  originalPrice: Number,
  category:  { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
}));

const HeroSlide = mongoose.model('HeroSlide', new mongoose.Schema({
  title:     { type: String, default: '' },
  subtitle:  { type: String, default: '' },
  mediaUrl:  String,
  mediaType: { type: String, enum: ['image', 'video'], default: 'image' },
  ctaText:   { type: String, default: 'Shop Now' },
  ctaLink:   { type: String, default: '/products' },
  order:     { type: Number, default: 0 },
  active:    { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
}));

const Category = mongoose.model('Category', new mongoose.Schema({
  name:      { type: String, required: true },
  icon:      { type: String, default: '🛒' },
  imageUrl:  { type: String, default: null },
  link:      { type: String, default: '/' },
  color:     { type: String, default: '#B07D4A' },
  colorDark: { type: String, default: '#8A5C30' },
  order:     { type: Number, default: 0 },
  active:    { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
}));

const User = mongoose.model('User', new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}));

const PinnedCategory = mongoose.model('PinnedCategory', new mongoose.Schema({
  name:         { type: String, required: true },
  displayName:  String,
  label:        { type: String, default: 'Featured Category' },
  description:  String,
  icon:         String,
  bannerImage:  String,
  productLimit: { type: Number, default: 6 },
  gridCols:     { type: Number, default: 4 },
  order:        { type: Number, default: 0 },
}));

// ── NEW: Promo Banner Model ──────────────────────────────────────
const PromoBanner = mongoose.model('PromoBanner', new mongoose.Schema({
  mediaUrl:  String,
  mediaType: { type: String, enum: ['image', 'video'], default: 'image' },
  link:      { type: String, default: '' },
  active:    { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
}));

// ── Auth middleware ──────────────────────────────────────────────
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'ORGANISHI_SECRET');
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// ── Multer ───────────────────────────────────────────────────────
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename:    (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s/g, '_')),
  }),
});

// ── Product Routes ───────────────────────────────────────────────
app.get('/api/products', async (req, res) => {
  try {
    const { sort = 'newest', category, limit = 12, page = 1 } = req.query;
    const filter = {};
    if (category) filter.category = category;
    let sortObj = { createdAt: -1 };
    if (sort === 'price_asc')  sortObj = { price: 1 };
    if (sort === 'price_desc') sortObj = { price: -1 };
    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortObj).skip(skip).limit(Number(limit)).lean(),
      Product.countDocuments(filter),
    ]);
    const normalized = products.map(p => ({
      ...p,
      image: p.bottleImg || null,
      images: p.bottleImg ? [p.bottleImg] : [],
      isNew: new Date(p.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    }));
    res.json({ products: normalized, total, page: Number(page), limit: Number(limit) });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/products', auth, upload.fields([{ name: 'bottle' }, { name: 'nut' }]), async (req, res) => {
  try {
    const product = await Product.create({
      name:          req.body.name,
      bgColor:       req.body.bgColor,
      textColor:     req.body.textColor,
      price:         req.body.price         ? parseFloat(req.body.price)         : undefined,
      originalPrice: req.body.originalPrice ? parseFloat(req.body.originalPrice) : undefined,
      category:      req.body.category      || '',
      bottleImg: req.files['bottle'] ? `/uploads/${req.files['bottle'][0].filename}` : null,
      nutImg:    req.files['nut']    ? `/uploads/${req.files['nut'][0].filename}`    : null,
    });
    res.status(201).json(product);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/products/:id', auth, upload.fields([{ name: 'bottle' }, { name: 'nut' }]), async (req, res) => {
  try {
    const update = {
      name:          req.body.name,
      bgColor:       req.body.bgColor,
      textColor:     req.body.textColor,
      price:         req.body.price         ? parseFloat(req.body.price)         : undefined,
      originalPrice: req.body.originalPrice ? parseFloat(req.body.originalPrice) : undefined,
      category:      req.body.category      || '',
    };
    if (req.files?.['bottle']) update.bottleImg = `/uploads/${req.files['bottle'][0].filename}`;
    if (req.files?.['nut'])    update.nutImg    = `/uploads/${req.files['nut'][0].filename}`;
    const product = await Product.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!product) return res.status(404).json({ message: 'Not found' });
    res.json(product);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/products/:id', auth, async (req, res) => {
  try { await Product.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Hero Slide Routes ────────────────────────────────────────────
app.get('/api/hero-slides', async (req, res) => {
  try { res.json(await HeroSlide.find({ active: true }).sort({ order: 1, createdAt: 1 })); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/hero-slides/all', auth, async (req, res) => {
  try { res.json(await HeroSlide.find().sort({ order: 1, createdAt: 1 })); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/hero-slides', auth, upload.single('media'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No media file uploaded' });
    const isVideo = req.file.mimetype.startsWith('video/');
    const slide = await HeroSlide.create({
      title:     req.body.title    || '',
      subtitle:  req.body.subtitle || '',
      ctaText:   req.body.ctaText  || 'Shop Now',
      ctaLink:   req.body.ctaLink  || '/products',
      order:     req.body.order    ? parseInt(req.body.order) : 0,
      active:    req.body.active !== 'false',
      mediaUrl:  `/uploads/${req.file.filename}`,
      mediaType: isVideo ? 'video' : 'image',
    });
    res.status(201).json(slide);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/hero-slides/:id', auth, upload.single('media'), async (req, res) => {
  try {
    const update = {
      title:    req.body.title,
      subtitle: req.body.subtitle,
      ctaText:  req.body.ctaText,
      ctaLink:  req.body.ctaLink,
      order:    req.body.order ? parseInt(req.body.order) : 0,
      active:   req.body.active !== 'false',
    };
    if (req.file) {
      update.mediaUrl  = `/uploads/${req.file.filename}`;
      update.mediaType = req.file.mimetype.startsWith('video/') ? 'video' : 'image';
    }
    const slide = await HeroSlide.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!slide) return res.status(404).json({ message: 'Not found' });
    res.json(slide);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/hero-slides/:id', auth, async (req, res) => {
  try { await HeroSlide.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Category Routes ──────────────────────────────────────────────
app.get('/api/categories', async (req, res) => {
  try { res.json(await Category.find({ active: true }).sort({ order: 1, createdAt: 1 })); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/categories/all', auth, async (req, res) => {
  try { res.json(await Category.find().sort({ order: 1, createdAt: 1 })); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/categories', auth, upload.single('image'), async (req, res) => {
  try {
    const cat = await Category.create({
      name:      req.body.name,
      icon:      req.body.icon      || '🛒',
      link:      req.body.link      || '/',
      color:     req.body.color     || '#B07D4A',
      colorDark: req.body.colorDark || '#8A5C30',
      order:     req.body.order     ? parseInt(req.body.order) : 0,
      active:    req.body.active !== 'false',
      imageUrl:  req.file ? `/uploads/${req.file.filename}` : null,
    });
    res.status(201).json(cat);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/categories/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const update = {
      name:      req.body.name,
      icon:      req.body.icon      || '🛒',
      link:      req.body.link      || '/',
      color:     req.body.color     || '#B07D4A',
      colorDark: req.body.colorDark || '#8A5C30',
      order:     req.body.order     ? parseInt(req.body.order) : 0,
      active:    req.body.active !== 'false',
    };
    if (req.file) update.imageUrl = `/uploads/${req.file.filename}`;
    const cat = await Category.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!cat) return res.status(404).json({ message: 'Not found' });
    res.json(cat);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/categories/:id', auth, async (req, res) => {
  try { await Category.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Homepage Config Routes ───────────────────────────────────────
app.get('/api/homepage/config', async (req, res) => {
  try {
    const config = await HomepageConfig.findOne().sort({ updatedAt: -1 });
    if (!config) return res.json({ sections: [] });
    res.json(config);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/homepage/config', auth, async (req, res) => {
  try {
    const { sections } = req.body;
    const config = await HomepageConfig.findOneAndUpdate(
      {},
      { sections },
      { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
    );
    res.json(config);
  } catch (err) {
    console.error("Config Save Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/homepage/pinned-categories', async (req, res) => {
  try { res.json(await PinnedCategory.find().sort({ order: 1 })); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/homepage/pinned-categories', auth, async (req, res) => {
  try {
    const incoming = req.body;
    if (!Array.isArray(incoming)) return res.status(400).json({ error: 'Expected array' });
    const names = incoming.map(c => c.name);
    await PinnedCategory.deleteMany({ name: { $nin: names } });
    const ops = incoming.map((cat, i) =>
      PinnedCategory.findOneAndUpdate(
        { name: cat.name },
        { ...cat, order: i },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      )
    );
    res.json(await Promise.all(ops));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Promo Banner Routes ──────────────────────────────────────────
// Public: returns all active promo banners (frontend uses the first one)
app.get('/api/promo-banners', async (req, res) => {
  try { res.json(await PromoBanner.find({ active: true }).sort({ createdAt: -1 })); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

// Admin: returns ALL banners (active + hidden)
app.get('/api/promo-banners/all', auth, async (req, res) => {
  try { res.json(await PromoBanner.find().sort({ createdAt: -1 })); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

// Admin: upload a new banner
app.post('/api/promo-banners', auth, upload.single('media'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No media file uploaded' });
    const isVideo = req.file.mimetype.startsWith('video/');
    const banner = await PromoBanner.create({
      mediaUrl:  `/uploads/${req.file.filename}`,
      mediaType: isVideo ? 'video' : 'image',
      link:      req.body.link   || '',
      active:    req.body.active !== 'false',
    });
    res.status(201).json(banner);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Admin: update an existing banner (optionally replace media)
app.put('/api/promo-banners/:id', auth, upload.single('media'), async (req, res) => {
  try {
    const update = {
      link:   req.body.link   || '',
      active: req.body.active !== 'false',
    };
    if (req.file) {
      update.mediaUrl  = `/uploads/${req.file.filename}`;
      update.mediaType = req.file.mimetype.startsWith('video/') ? 'video' : 'image';
    }
    const banner = await PromoBanner.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!banner) return res.status(404).json({ message: 'Not found' });
    res.json(banner);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Admin: delete a banner
app.delete('/api/promo-banners/:id', auth, async (req, res) => {
  try { await PromoBanner.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Auth ─────────────────────────────────────────────────────────
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'ORGANISHI_SECRET', { expiresIn: '7d' });
    res.json({ token });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Start ─────────────────────────────────────────────────────────
const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');
    const exists = await User.findOne({ username: process.env.ADMIN_USERNAME || 'admin' });
    if (!exists) {
      const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
      await User.create({ username: process.env.ADMIN_USERNAME || 'admin', password: hash });
      console.log('👤 Admin user created');
    }
    app.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 Server running on http://localhost:${process.env.PORT || 5000}`)
    );
  } catch (err) { console.error('❌ Startup error:', err.message); process.exit(1); }
};
start();