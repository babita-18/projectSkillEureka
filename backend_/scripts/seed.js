const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const { generateConfirmationCode } = require('../utils/helpers');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await pool.query('TRUNCATE TABLE user_history, user_follows, watch_later, user_saves, user_likes, videos, categories, creators, users RESTART IDENTITY CASCADE');

    // Insert categories
    const categories = [
      { name: 'Class 1', icon: '1' },
      { name: 'Class 2', icon: '2' },
      { name: 'Class 3', icon: '3' },
      { name: 'Class 4', icon: '4' },
      { name: 'Class 5', icon: '5' },
      { name: 'Class 6', icon: '6' },
      { name: 'Class 7', icon: '7' },
      { name: 'Class 8', icon: '8' }
    ];

    for (const category of categories) {
      await pool.query(
        'INSERT INTO categories (name, icon) VALUES ($1, $2)',
        [category.name, category.icon]
      );
    }

    // Insert sample users
    const passwordHash = await bcrypt.hash('password123', 12);
    
    const users = [
      {
        username: 'johndoe',
        email: 'john@example.com',
        name: 'John Doe',
        bio: 'Enthusiastic learner',
        profilePic: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600'
      },
      {
        username: 'janesmith',
        email: 'jane@example.com',
        name: 'Jane Smith',
        bio: 'Always curious, always learning',
        profilePic: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600'
      }
    ];

    for (const user of users) {
      await pool.query(
        'INSERT INTO users (username, email, password_hash, name, bio, profile_pic_url) VALUES ($1, $2, $3, $4, $5, $6)',
        [user.username, user.email, passwordHash, user.name, user.bio, user.profilePic]
      );
    }

    // Insert sample creators
    const creators = [
      {
        username: 'alexj',
        email: 'alex@example.com',
        name: 'Alex Johnson',
        bio: 'Mathematics professor with 10+ years of teaching experience',
        profilePic: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=600',
        youtubeChannel: 'https://youtube.com/alexjohnson',
        instagramHandle: 'https://instagram.com/alexjohnson',
        linkedinProfile: 'https://linkedin.com/in/alexjohnson'
      },
      {
        username: 'sarahc',
        email: 'sarah@example.com',
        name: 'Sarah Chen',
        bio: 'Science educator specializing in physics and astronomy',
        profilePic: 'https://images.pexels.com/photos/3394347/pexels-photo-3394347.jpeg?auto=compress&cs=tinysrgb&w=600',
        youtubeChannel: 'https://youtube.com/sarahchen',
        instagramHandle: 'https://instagram.com/sarahchen',
        linkedinProfile: 'https://linkedin.com/in/sarahchen'
      },
      {
        username: 'michaelr',
        email: 'michael@example.com',
        name: 'Michael Rodriguez',
        bio: 'Computer Science professor focusing on algorithms and data structures',
        profilePic: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=600',
        youtubeChannel: 'https://youtube.com/michaelrodriguez',
        instagramHandle: 'https://instagram.com/michaelrodriguez',
        linkedinProfile: 'https://linkedin.com/in/michaelrodriguez'
      }
    ];

    const creatorIds = [];
    for (const creator of creators) {
      const result = await pool.query(
        `INSERT INTO creators (username, email, password_hash, name, bio, profile_pic_url, youtube_channel, instagram_handle, linkedin_profile, confirmation_code, is_verified) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id`,
        [creator.username, creator.email, passwordHash, creator.name, creator.bio, creator.profilePic, 
         creator.youtubeChannel, creator.instagramHandle, creator.linkedinProfile, generateConfirmationCode(), true]
      );
      creatorIds.push(result.rows[0].id);
    }

    // Get category IDs
    const categoryResult = await pool.query('SELECT id, name FROM categories');
    const categoryMap = {};
    categoryResult.rows.forEach(cat => {
      categoryMap[cat.name] = cat.id;
    });

    // Insert sample videos
    const videos = [
      {
        title: 'Introduction to Algebra',
        description: 'Learn the basics of algebra with simple examples',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnailUrl: 'https://images.pexels.com/photos/4144179/pexels-photo-4144179.jpeg?auto=compress&cs=tinysrgb&w=600',
        creatorId: creatorIds[0],
        categoryId: categoryMap['Class 8']
      },
      {
        title: 'Understanding Equations',
        description: 'Master the art of solving equations',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnailUrl: 'https://images.pexels.com/photos/6238050/pexels-photo-6238050.jpeg?auto=compress&cs=tinysrgb&w=600',
        creatorId: creatorIds[0],
        categoryId: categoryMap['Class 7']
      },
      {
        title: 'Geometry Basics',
        description: 'Introduction to geometric shapes and concepts',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnailUrl: 'https://images.pexels.com/photos/3768894/pexels-photo-3768894.jpeg?auto=compress&cs=tinysrgb&w=600',
        creatorId: creatorIds[0],
        categoryId: categoryMap['Class 6']
      },
      {
        title: 'Introduction to Physics',
        description: 'Explore the fundamental concepts of physics',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnailUrl: 'https://images.pexels.com/photos/2156881/pexels-photo-2156881.jpeg?auto=compress&cs=tinysrgb&w=600',
        creatorId: creatorIds[1],
        categoryId: categoryMap['Class 8']
      },
      {
        title: 'Solar System Exploration',
        description: 'Journey through our solar system',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnailUrl: 'https://images.pexels.com/photos/73873/star-clusters-rosette-nebula-star-galaxies-73873.jpeg?auto=compress&cs=tinysrgb&w=600',
        creatorId: creatorIds[1],
        categoryId: categoryMap['Class 5']
      },
      {
        title: 'Introduction to Algorithms',
        description: 'Learn the basics of computer algorithms',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnailUrl: 'https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg?auto=compress&cs=tinysrgb&w=600',
        creatorId: creatorIds[2],
        categoryId: categoryMap['Class 8']
      },
      {
        title: 'Data Structures Fundamentals',
        description: 'Understanding basic data structures',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnailUrl: 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=600',
        creatorId: creatorIds[2],
        categoryId: categoryMap['Class 7']
      },
      {
        title: 'Basic English Grammar',
        description: 'Learn fundamental English grammar rules',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnailUrl: 'https://images.pexels.com/photos/256417/pexels-photo-256417.jpeg?auto=compress&cs=tinysrgb&w=600',
        creatorId: creatorIds[0],
        categoryId: categoryMap['Class 3']
      }
    ];

    for (const video of videos) {
      await pool.query(
        'INSERT INTO videos (title, description, video_url, thumbnail_url, creator_id, category_id) VALUES ($1, $2, $3, $4, $5, $6)',
        [video.title, video.description, video.videoUrl, video.thumbnailUrl, video.creatorId, video.categoryId]
      );
    }

    console.log('✅ Database seeded successfully!');
    console.log('📝 Sample login credentials:');
    console.log('   Users: johndoe/password123, janesmith/password123');
    console.log('   Creators: alexj/password123, sarahc/password123, michaelr/password123');
    
  } catch (error) {
    console.error('❌ Seeding error:', error);
  } finally {
    await pool.end();
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;