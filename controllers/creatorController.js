const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const Creator= require('../models/Creator');

exports.signup = async (req, res) => {
  const { fullName, username, password, profilePic, bio } = req.body;
  try {
    let c = await Creator.findOne({ username });
    if (c) return res.status(400).json({ message: 'Username taken' });

    const hash = await bcrypt.hash(password, 12);
    c = new Creator({ fullName, username, password: hash, profilePic, bio });
    await c.save();

    const token = jwt.sign({ id: c._id, role: 'creator' }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (e) {
    console.error(e);
    res.status(500).send('Server error');
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const c = await Creator.findOne({ username });
    if (!c) return res.status(400).json({ message: 'Invalid creds' });

    const match = await bcrypt.compare(password, c.password);
    if (!match) return res.status(400).json({ message: 'Invalid creds' });

    const token = jwt.sign({ id: c._id, role: 'creator' }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (e) {
    console.error(e);
    res.status(500).send('Server error');
  }
};
