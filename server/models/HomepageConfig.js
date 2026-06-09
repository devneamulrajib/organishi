const mongoose = require("mongoose");

const BannerDataSchema = new mongoose.Schema({
  id:         String,
  image:      String,
  title:      String,
  subtitle:   String,
  buttonText: String,
  link:       String,
  isActive:   { type: Boolean, default: true },
});

const SectionSchema = new mongoose.Schema({
  id:   { type: String, required: true },
  type: {
    type: String,
    enum: [
      "hero",
      "featured_categories",
      "new_arrivals",
      "trending",
      "pinned_categories",
      "all_products",
      "single_banner",
      "multi_banner",
      "slideshow_banner",
      "promo_banner",      // ← added
    ],
    required: true,
  },
  order:       { type: Number,  default: 0 },
  isVisible:   { type: Boolean, default: true },
  bannerData:  BannerDataSchema,
  bannersData: [BannerDataSchema],
  interval:    { type: Number,  default: 4000 },
});

const HomepageConfigSchema = new mongoose.Schema(
  { sections: [SectionSchema] },
  { timestamps: true }
);

module.exports = mongoose.model("HomepageConfig", HomepageConfigSchema);