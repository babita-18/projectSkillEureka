const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const { authenticateToken, authenticateCreator } = require('../middleware/auth');

const router = express.Router();

// Get all verified creators
router.get('/', async (req, res) => {
  try {
    const search = req.query.search;
    let query = `
      SELECT c.*, 
             (SELECT COUNT(*) FROM user_follows WHERE creator_id = c.id) as followers_count,
             (SELECT COUNT(*) FROM videos WHERE creator_id = c.id) as videos_count
      FROM creators c 
      WHERE c.is_verified = true
    `;
    const queryParams = [];

    if (search) {
      query += ` AND (c.name ILIKE $1 OR c.bio ILIKE $1)`;
      queryParams.push(`%${search}%`);
    }

    query += ` ORDER BY c.created_at DESC`;

    const result = await pool.query(query, queryParams);
    res.json(result.rows);
  } catch (error) {
    console.error('Get creators error:', error);
    res.status(500).json({ error: 'Failed to fetch creators' });
  }
});

// Get creator by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT c.*, 
             (SELECT COUNT(*) FROM user_follows WHERE creator_id = c.id) as followers_count,
             (SELECT COUNT(*) FROM videos WHERE creator_id = c.id) as videos_count
      FROM creators c 
      WHERE c.id = $1 AND c.is_verified = true
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Creator not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get creator error:', error);
    res.status(500).json({ error: 'Failed to fetch creator' });
  }
});

// Get creator's videos
router.get('/:id/videos', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT v.*, cat.name as category_name
      FROM videos v
      LEFT JOIN categories cat ON v.category_id = cat.id
      WHERE v.creator_id = $1
      ORDER BY v.created_at DESC
    `, [id]);

    res.json(result.rows);
  } catch (error) {
    console.error('Get creator videos error:', error);
    res.status(500).json({ error: 'Failed to fetch creator videos' });
  }
});

// Update creator profile
router.put('/profile', authenticateCreator, [
  body('name').optional().isLength({ min: 2 }).trim(),
  body('bio').optional().trim(),
  body('profilePicUrl').optional().isURL(),
  body('youtubeChannel').optional().isURL(),
  body('instagramHandle').optional().isURL(),
  body('linkedinProfile').optional().isURL()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const creatorId = req.user.id;
    const { name, bio, profilePicUrl, youtubeChannel, instagramHandle, linkedinProfile } = req.body;

    const result = await pool.query(`
      UPDATE creators 
      SET name = COALESCE($1, name), 
          bio = COALESCE($2, bio), 
          profile_pic_url = COALESCE($3, profile_pic_url),
          youtube_channel = COALESCE($4, youtube_channel),
          instagram_handle = COALESCE($5, instagram_handle),
          linkedin_profile = COALESCE($6, linkedin_profile),
          updated_at = NOW()
      WHERE id = $7 
      RETURNING id, username, email, name, bio, profile_pic_url, youtube_channel, instagram_handle, linkedin_profile
    `, [name, bio, profilePicUrl, youtubeChannel, instagramHandle, linkedinProfile, creatorId]);

    res.json({
      message: 'Profile updated successfully',
      creator: result.rows[0]
    });
  } catch (error) {
    console.error('Update creator profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get creator dashboard stats
router.get('/dashboard/stats', authenticateCreator, async (req, res) => {
  try {
    const creatorId = req.user.id;

    const stats = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM videos WHERE creator_id = $1) as total_videos,
        (SELECT COUNT(*) FROM user_follows WHERE creator_id = $1) as total_followers,
        (SELECT COUNT(*) FROM user_likes ul JOIN videos v ON ul.video_id = v.id WHERE v.creator_id = $1) as total_likes,
        (SELECT COUNT(*) FROM user_saves us JOIN videos v ON us.video_id = v.id WHERE v.creator_id = $1) as total_saves
    `, [creatorId]);

    res.json(stats.rows[0]);
  } catch (error) {
    console.error('Get creator stats error:', error);
    res.status(500).json({ error: 'Failed to fetch creator stats' });
  }
});

module.exports = router;