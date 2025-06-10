// models/User.js
const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  name:        String,
  email:       { type: String, unique: true },
  password:    String,
  // watch-later library: array of Video _ids
  watchLater:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
});
module.exports = mongoose.model('User', UserSchema);

// models/Creator.js
const mongoose = require('mongoose');
const CreatorSchema = new mongoose.Schema({
  name:          String,
  bio:           String,
  profilePic:    String,
  followers:     [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  followerCount: { type: Number, default: 0 },
});
module.exports = mongoose.model('Creator', CreatorSchema);

// models/Video.js
const mongoose = require('mongoose');
const VideoSchema = new mongoose.Schema({
  title:       String,
  url:         String,
  creator:     { type: mongoose.Schema.Types.ObjectId, ref: 'Creator' },
  likes:       [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  likeCount:   { type: Number, default: 0 },
  shareCount:  { type: Number, default: 0 },
});
module.exports = mongoose.model('Video', VideoSchema);
