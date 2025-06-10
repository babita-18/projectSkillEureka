const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Submit a video report
router.post('/', authenticateToken, [
  body('videoId').isUUID(),
  body('reason').isIn(['copyright', 'inappropriate', 'spam', 'misleading'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { videoId, reason, description } = req.body;
    const userId = req.user.id;

    // Check if user has already reported this video
    const existingReport = await pool.query(
      'SELECT id FROM video_reports WHERE user_id = $1 AND video_id = $2',
      [userId, videoId]
    );

    if (existingReport.rows.length > 0) {
      return res.status(400).json({ error: 'You have already reported this video' });
    }

    // Insert the report
    const result = await pool.query(
      `INSERT INTO video_reports (user_id, video_id, reason, description, status) 
       VALUES ($1, $2, $3, $4, 'pending') RETURNING *`,
      [userId, videoId, reason, description || '']
    );

    res.status(201).json({
      message: 'Report submitted successfully',
      report: result.rows[0]
    });
  } catch (error) {
    console.error('Submit report error:', error);
    res.status(500).json({ error: 'Failed to submit report' });
  }
});

// Get all reports (Admin only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    // In a real app, you'd check if user is admin
    const result = await pool.query(`
      SELECT vr.*, 
             u.username as reporter_username,
             u.name as reporter_name,
             v.title as video_title,
             c.name as creator_name
      FROM video_reports vr
      JOIN users u ON vr.user_id = u.id
      JOIN videos v ON vr.video_id = v.id
      JOIN creators c ON v.creator_id = c.id
      ORDER BY vr.created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

// Update report status (Admin only)
router.put('/:id/status', authenticateToken, [
  body('status').isIn(['pending', 'reviewed', 'resolved', 'dismissed'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const result = await pool.query(
      `UPDATE video_reports 
       SET status = $1, admin_notes = $2, updated_at = NOW()
       WHERE id = $3 RETURNING *`,
      [status, adminNotes || '', id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json({
      message: 'Report status updated successfully',
      report: result.rows[0]
    });
  } catch (error) {
    console.error('Update report status error:', error);
    res.status(500).json({ error: 'Failed to update report status' });
  }
});

module.exports = router;