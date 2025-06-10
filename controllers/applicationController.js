// backend/controllers/applicationController.js
const CreatorApplication = require('../models/CreatorApplication');

exports.apply = async (req, res) => {
  try {
    const app = new CreatorApplication(req.body);
    await app.save();
    res.status(201).json({ message: 'Application received' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
