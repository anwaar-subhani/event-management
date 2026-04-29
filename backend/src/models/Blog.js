const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    content: { type: String, default: '', trim: true },
    image: { type: String, default: '' },
    author: { type: String, default: 'Event Team', trim: true },
    readTimeMinutes: { type: Number, default: 5, min: 1 },
    isPublished: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Blog', blogSchema);
