const router       = require('express').Router();
const Notification = require('../models/Notification');

// get all notifications for current user
router.get('/', async (req, res) => {
  const notifs = await Notification.find({ recipient: req.user.id })
    .sort('-createdAt')
    .limit(50)
    .populate('sender', 'username profilePic');
  res.json(notifs);
});

// mark one as read
router.patch('/:id/read', async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
  res.json({ success: true });
});

module.exports = router;
