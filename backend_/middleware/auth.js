const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user exists in database
    let user;
    if (decoded.type === 'creator') {
      const result = await pool.query('SELECT * FROM creators WHERE id = $1', [decoded.id]);
      user = result.rows[0];
    } else {
      const result = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.id]);
      user = result.rows[0];
    }

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = { ...user, type: decoded.type };
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

const authenticateCreator = async (req, res, next) => {
  await authenticateToken(req, res, () => {
    if (req.user.type !== 'creator') {
      return res.status(403).json({ error: 'Creator access required' });
    }
    next();
  });
};

module.exports = { authenticateToken, authenticateCreator };