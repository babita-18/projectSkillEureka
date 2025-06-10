// backend/models/CreatorApplication.js
const mongoose = require('mongoose');

const CreatorAppSchema = new mongoose.Schema({
  fullName:    { type: String, required: true },
  email:       { type: String, required: true },
  youtubeUrl:  { type: String },
  motivation:  { type: String, required: true },
  submittedAt: { type: Date,   default: Date.now }
});

module.exports = mongoose.model('CreatorApplication', CreatorAppSchema);
