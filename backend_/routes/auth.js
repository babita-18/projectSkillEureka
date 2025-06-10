const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const { sendVerificationEmail } = require('../utils/email');
const { generateConfirmationCode } = require('../utils/helpers');

const router = express.Router();

// User Registration
router.post('/register/user', [
  body('username').isLength({ min: 3 }).trim(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').isLength({ min: 2 }).trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, name, bio, profilePicUrl } = req.body;

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert user
    const result = await pool.query(
      `INSERT INTO users (username, email, password_hash, name, bio, profile_pic_url) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, username, email, name, bio, profile_pic_url, created_at`,
      [username, email, passwordHash, name, bio || '', profilePicUrl || '']
    );

    const user = result.rows[0];

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, type: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        bio: user.bio,
        profilePic: user.profile_pic_url,
        type: 'user'
      }
    });
  } catch (error) {
    console.error('User registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Creator Application
router.post('/apply/creator', [
  body('username').isLength({ min: 3 }).trim(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').isLength({ min: 2 }).trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, name, bio, youtubeChannel, instagramHandle, linkedinProfile } = req.body;

    // Check if creator already exists
    const existingCreator = await pool.query(
      'SELECT id FROM creators WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (existingCreator.rows.length > 0) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Generate confirmation code
    const confirmationCode = generateConfirmationCode();

    // Insert creator
    const result = await pool.query(
      `INSERT INTO creators (username, email, password_hash, name, bio, youtube_channel, instagram_handle, linkedin_profile, confirmation_code, is_verified) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id, email, name, confirmation_code`,
      [username, email, passwordHash, name, bio || '', youtubeChannel || '', instagramHandle || '', linkedinProfile || '', confirmationCode, false]
    );

    const creator = result.rows[0];

    // Send verification email
    await sendVerificationEmail(creator.email, creator.name, confirmationCode);

    res.status(201).json({
      message: 'Creator application submitted successfully. Please check your email for verification code.',
      email: creator.email,
      confirmationCode: confirmationCode // Remove this in production
    });
  } catch (error) {
    console.error('Creator application error:', error);
    res.status(500).json({ error: 'Application failed' });
  }
});

// Creator Verification
router.post('/verify/creator', [
  body('email').isEmail().normalizeEmail(),
  body('confirmationCode').isLength({ min: 8, max: 8 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, confirmationCode } = req.body;

    const result = await pool.query(
      'UPDATE creators SET is_verified = true WHERE email = $1 AND confirmation_code = $2 AND is_verified = false RETURNING id',
      [email, confirmationCode]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid email or confirmation code' });
    }

    res.json({ message: 'Creator account verified successfully' });
  } catch (error) {
    console.error('Creator verification error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
});

// User Login
router.post('/login/user', [
  body('username').trim(),
  body('password').exists()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, type: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        bio: user.bio,
        profilePic: user.profile_pic_url,
        type: 'user'
      }
    });
  } catch (error) {
    console.error('User login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Creator Login
router.post('/login/creator', [
  body('username').trim(),
  body('password').exists()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    const result = await pool.query(
      'SELECT * FROM creators WHERE username = $1 AND is_verified = true',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials or account not verified' });
    }

    const creator = result.rows[0];
    const isValidPassword = await bcrypt.compare(password, creator.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: creator.id, type: 'creator' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: creator.id,
        username: creator.username,
        email: creator.email,
        name: creator.name,
        bio: creator.bio,
        profilePic: creator.profile_pic_url,
        youtubeChannel: creator.youtube_channel,
        instagramHandle: creator.instagram_handle,
        linkedinProfile: creator.linkedin_profile,
        type: 'creator'
      }
    });
  } catch (error) {
    console.error('Creator login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;