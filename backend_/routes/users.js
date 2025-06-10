const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    if (req.user.type !== 'user') {
      return res.status(403).json({ error: 'User access required' });
    }

    const userId = req.user.id;

    // Get user data with engagement counts
    const userResult = await pool.query(`
      SELECT u.*, 
             (SELECT COUNT(*) FROM user_likes WHERE user_id = u.id) as liked_count,
             (SELECT COUNT(*) FROM user_saves WHERE user_id = u.id) as saved_count,
             (SELECT COUNT(*) FROM watch_later WHERE user_id = u.id) as watch_later_count,
             (SELECT COUNT(*) FROM user_follows WHERE user_id = u.id) as following_count
      FROM users u WHERE u.id = $1
    `, [userId]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(userResult.rows[0]);
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, [
  body('name').optional().isLength({ min: 2 }).trim(),
  body('bio').optional().trim(),
  body('profilePicUrl').optional().isURL()
], async (req, res) => {
  try {
    if (req.user.type !== 'user') {
      return res.status(403).json({ error: 'User access required' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.id;
    const { name, bio, profilePicUrl } = req.body;

    const result = await pool.query(`
      UPDATE users 
      SET name = COALESCE($1, name), 
          bio = COALESCE($2, bio), 
          profile_pic_url = COALESCE($3, profile_pic_url),
          updated_at = NOW()
      WHERE id = $4 
      RETURNING id, username, email, name, bio, profile_pic_url
    `, [name, bio, profilePicUrl, userId]);

    res.json({
      message: 'Profile updated successfully',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get user's liked videos
router.get('/liked-videos', authenticateToken, async (req, res) => {
  try {
    if (req.user.type !== 'user') {
      return res.status(403).json({ error: 'User access required' });
    }

    const userId = req.user.id;

    const result = await pool.query(`
      SELECT v.*, c.name as creator_name, c.profile_pic_url as creator_profile_pic
      FROM videos v
      JOIN user_likes ul ON v.id = ul.video_id
      JOIN creators c ON v.creator_id = c.id
      WHERE ul.user_id = $1
      ORDER BY ul.created_at DESC
    `, [userId]);

    res.json(result.rows);
  } catch (error) {
    console.error('Get liked videos error:', error);
    res.status(500).json({ error: 'Failed to fetch liked videos' });
  }
});

// Get user's saved videos
router.get('/saved-videos', authenticateToken, async (req, res) => {
  try {
    if (req.user.type !== 'user') {
      return res.status(403).json({ error: 'User access required' });
    }

    const userId = req.user.id;

    const result = await pool.query(`
      SELECT v.*, c.name as creator_name, c.profile_pic_url as creator_profile_pic
      FROM videos v
      JOIN user_saves us ON v.id = us.video_id
      JOIN creators c ON v.creator_id = c.id
      WHERE us.user_id = $1
      ORDER BY us.created_at DESC
    `, [userId]);

    res.json(result.rows);
  } catch (error) {
    console.error('Get saved videos error:', error);
    res.status(500).json({ error: 'Failed to fetch saved videos' });
  }
});

// Get user's watch later videos
router.get('/watch-later', authenticateToken, async (req, res) => {
  try {
    if (req.user.type !== 'user') {
      return res.status(403).json({ error: 'User access required' });
    }

    const userId = req.user.id;

    const result = await pool.query(`
      SELECT v.*, c.name as creator_name, c.profile_pic_url as creator_profile_pic
      FROM videos v
      JOIN watch_later wl ON v.id = wl.video_id
      JOIN creators c ON v.creator_id = c.id
      WHERE wl.user_id = $1
      ORDER BY wl.created_at DESC
    `, [userId]);

    res.json(result.rows);
  } catch (error) {
    console.error('Get watch later videos error:', error);
    res.status(500).json({ error: 'Failed to fetch watch later videos' });
  }
});

// Get user's history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    if (req.user.type !== 'user') {
      return res.status(403).json({ error: 'User access required' });
    }

    const userId = req.user.id;

    const result = await pool.query(`
      SELECT v.*, c.name as creator_name, c.profile_pic_url as creator_profile_pic, uh.watched_at
      FROM videos v
      JOIN user_history uh ON v.id = uh.video_id
      JOIN creators c ON v.creator_id = c.id
      WHERE uh.user_id = $1
      ORDER BY uh.watched_at DESC
      LIMIT 10
    `, [userId]);

    res.json(result.rows);
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// Follow creator
router.post('/follow/:creatorId', authenticateToken, async (req, res) => {
  try {
    if (req.user.type !== 'user') {
      return res.status(403).json({ error: 'User access required' });
    }

    const userId = req.user.id;
    const { creatorId } = req.params;

    await pool.query(
      'INSERT INTO user_follows (user_id, creator_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [userId, creatorId]
    );

    res.json({ message: 'Creator followed successfully' });
  } catch (error) {
    console.error('Follow creator error:', error);
    res.status(500).json({ error: 'Failed to follow creator' });
  }
});

// Unfollow creator
router.delete('/follow/:creatorId', authenticateToken, async (req, res) => {
  try {
    if (req.user.type !== 'user') {
      return res.status(403).json({ error: 'User access required' });
    }

    const userId = req.user.id;
    const { creatorId } = req.params;

    await pool.query(
      'DELETE FROM user_follows WHERE user_id = $1 AND creator_id = $2',
      [userId, creatorId]
    );

    res.json({ message: 'Creator unfollowed successfully' });
  } catch (error) {
    console.error('Unfollow creator error:', error);
    res.status(500).json({ error: 'Failed to unfollow creator' });
  }
});

module.exports = router;