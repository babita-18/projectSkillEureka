const mongoose = require('mongoose');

const CreatorSchema = new mongoose.Schema({
  fullName:   { type: String, required: true },
  username:   { type: String, required: true, unique: true },
  password:   { type: String, required: true },
  profilePic: { type: String },
  bio:        { type: String }
});

module.exports = mongoose.model('Creator', CreatorSchema);
