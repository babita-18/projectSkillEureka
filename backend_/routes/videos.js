const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const { authenticateToken, authenticateCreator } = require('../middleware/auth');

const router = express.Router();

// Get all videos with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const category = req.query.category;
    const search = req.query.search;

    let query = `
      SELECT v.*, c.name as creator_name, c.profile_pic_url as creator_profile_pic, cat.name as category_name
      FROM videos v
      JOIN creators c ON v.creator_id = c.id
      LEFT JOIN categories cat ON v.category_id = cat.id
      WHERE 1=1
    `;
    const queryParams = [];
    let paramCount = 0;

    if (category && category !== 'all') {
      paramCount++;
      query += ` AND cat.name = $${paramCount}`;
      queryParams.push(category);
    }

    if (search) {
      paramCount++;
      query += ` AND v.title ILIKE $${paramCount}`;
      queryParams.push(`%${search}%`);
    }

    query += ` ORDER BY v.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    queryParams.push(limit, offset);

    const result = await pool.query(query, queryParams);

    res.json({
      videos: result.rows,
      pagination: {
        page,
        limit,
        total: result.rows.length
      }
    });
  } catch (error) {
    console.error('Get videos error:', error);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

// Get video by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT v.*, c.name as creator_name, c.profile_pic_url as creator_profile_pic, 
             c.youtube_channel, c.instagram_handle, c.linkedin_profile,
             cat.name as category_name
      FROM videos v
      JOIN creators c ON v.creator_id = c.id
      LEFT JOIN categories cat ON v.category_id = cat.id
      WHERE v.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get video error:', error);
    res.status(500).json({ error: 'Failed to fetch video' });
  }
});

// Upload video (Creator only)
router.post('/', authenticateCreator, [
  body('title').isLength({ min: 1 }).trim(),
  body('videoUrl').isURL(),
  body('categoryId').isUUID()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, videoUrl, thumbnailUrl, categoryId } = req.body;
    const creatorId = req.user.id;

    const result = await pool.query(`
      INSERT INTO videos (title, description, video_url, thumbnail_url, creator_id, category_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [title, description || '', videoUrl, thumbnailUrl || '', creatorId, categoryId]);

    res.status(201).json({
      message: 'Video uploaded successfully',
      video: result.rows[0]
    });
  } catch (error) {
    console.error('Video upload error:', error);
    res.status(500).json({ error: 'Failed to upload video' });
  }
});

// Delete video (Creator only)
router.delete('/:id', authenticateCreator, async (req, res) => {
  try {
    const { id } = req.params;
    const creatorId = req.user.id;

    const result = await pool.query(
      'DELETE FROM videos WHERE id = $1 AND creator_id = $2 RETURNING id',
      [id, creatorId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Video not found or unauthorized' });
    }

    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Delete video error:', error);
    res.status(500).json({ error: 'Failed to delete video' });
  }
});

// Like video
router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (req.user.type !== 'user') {
      return res.status(403).json({ error: 'Only users can like videos' });
    }

    await pool.query(
      'INSERT INTO user_likes (user_id, video_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [userId, id]
    );

    res.json({ message: 'Video liked successfully' });
  } catch (error) {
    console.error('Like video error:', error);
    res.status(500).json({ error: 'Failed to like video' });
  }
});

// Unlike video
router.delete('/:id/like', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (req.user.type !== 'user') {
      return res.status(403).json({ error: 'Only users can unlike videos' });
    }

    await pool.query(
      'DELETE FROM user_likes WHERE user_id = $1 AND video_id = $2',
      [userId, id]
    );

    res.json({ message: 'Video unliked successfully' });
  } catch (error) {
    console.error('Unlike video error:', error);
    res.status(500).json({ error: 'Failed to unlike video' });
  }
});

// Save video
router.post('/:id/save', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (req.user.type !== 'user') {
      return res.status(403).json({ error: 'Only users can save videos' });
    }

    await pool.query(
      'INSERT INTO user_saves (user_id, video_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [userId, id]
    );

    res.json({ message: 'Video saved successfully' });
  } catch (error) {
    console.error('Save video error:', error);
    res.status(500).json({ error: 'Failed to save video' });
  }
});

// Add to watch later
router.post('/:id/watch-later', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (req.user.type !== 'user') {
      return res.status(403).json({ error: 'Only users can add videos to watch later' });
    }

    await pool.query(
      'INSERT INTO watch_later (user_id, video_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [userId, id]
    );

    res.json({ message: 'Video added to watch later successfully' });
  } catch (error) {
    console.error('Add to watch later error:', error);
    res.status(500).json({ error: 'Failed to add video to watch later' });
  }
});

// Add to history
router.post('/:id/history', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (req.user.type !== 'user') {
      return res.status(403).json({ error: 'Only users can add videos to history' });
    }

    // Remove existing entry if it exists
    await pool.query(
      'DELETE FROM user_history WHERE user_id = $1 AND video_id = $2',
      [userId, id]
    );

    // Add new entry
    await pool.query(
      'INSERT INTO user_history (user_id, video_id) VALUES ($1, $2)',
      [userId, id]
    );

    // Keep only last 10 entries
    await pool.query(`
      DELETE FROM user_history 
      WHERE user_id = $1 AND id NOT IN (
        SELECT id FROM user_history 
        WHERE user_id = $1 
        ORDER BY watched_at DESC 
        LIMIT 10
      )
    `, [userId]);

    res.json({ message: 'Video added to history successfully' });
  } catch (error) {
    console.error('Add to history error:', error);
    res.status(500).json({ error: 'Failed to add video to history' });
  }
});

module.exports = router;