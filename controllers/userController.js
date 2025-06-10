const Notification = require('../models/Notification');
// ... inside your follow handler:
exports.follow = async (req, res) => {
  const followerId = req.user.id;             // sender
  const followeeId = req.params.userId;       // recipient
  // 1) create the follow relationship (e.g. in Follows collection)
  // 2) create a notification
  await Notification.create({
    recipient: followeeId,
    sender:    followerId,
    type:      'follow',
    data:      {}    // you could store e.g. { followerName }
  });

//   // 3) optionally emit via Socket.io
//   const io = req.app.get('io');
//   io.to(followeeId).emit('new-notification', {
//     sender: followerId,
//     type:   'follow'
//   });

  res.json({ success: true });
};
