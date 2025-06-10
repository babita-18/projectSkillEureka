// routes/social.js
const express = require('express');
const router  = express.Router();
const User    = require('../models/User');
const Creator = require('../models/Creator');
const Video   = require('../models/Video');

// follow a creator
router.post('/creators/:id/follow', async (req, res) => {
  const userId    = req.user.id;
  const creatorId = req.params.id;
  const creator   = await Creator.findById(creatorId);
  if (!creator) return res.status(404).send('No such creator');
  if (!creator.followers.includes(userId)) {
    creator.followers.push(userId);
    creator.followerCount = creator.followers.length;
    await creator.save();
  }
  res.json({ followerCount: creator.followerCount });
});

// like / unlike a video
router.post('/videos/:id/like', async (req, res) => {
  const userId  = req.user.id;
  const video   = await Video.findById(req.params.id);
  if (!video) return res.status(404).send('No such video');
  const idx = video.likes.indexOf(userId);
  if (idx === -1) {
    video.likes.push(userId);
  } else {
    video.likes.splice(idx,1);
  }
  video.likeCount = video.likes.length;
  await video.save();
  res.json({ likeCount: video.likeCount });
});

// share a video
router.post('/videos/:id/share', async (req, res) => {
  const video = await Video.findById(req.params.id);
  if (!video) return res.status(404).send('No such video');
  video.shareCount++;
  await video.save();
  res.json({ shareCount: video.shareCount });
});

// save/unsave for later
router.post('/users/library/:videoId', async (req, res) => {
  const user    = await User.findById(req.user.id);
  const vid     = req.params.videoId;
  const idx     = user.watchLater.indexOf(vid);
  if (idx === -1) {
    user.watchLater.push(vid);
  } else {
    user.watchLater.splice(idx,1);
  }
  await user.save();
  res.json({ library: user.watchLater });
});

// get current user’s library
router.get('/users/library', async (req, res) => {
  const user = await User.findById(req.user.id).populate('watchLater');
  res.json(user.watchLater);
});

module.exports = router;
