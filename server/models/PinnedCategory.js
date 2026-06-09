// ═══════════════════════════════════════════════════════════════
// models/PinnedCategory.js
// ═══════════════════════════════════════════════════════════════
const mongoose = require("mongoose");

const PinnedCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    displayName: String,
    label: { type: String, default: "Featured Category" },
    description: String,
    icon: String,
    bannerImage: String,
    productLimit: { type: Number, default: 6 },
    gridCols: { type: Number, default: 4 },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PinnedCategory", PinnedCategorySchema);