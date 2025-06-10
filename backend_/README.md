# Skill Eureka Backend

A Node.js/Express backend API for the Skill Eureka educational platform.

## Features

- **Authentication & Authorization**: JWT-based auth for users and creators
- **User Management**: Registration, login, profile management
- **Creator System**: Creator applications, verification, and content management
- **Video Management**: Upload, categorization, and engagement tracking
- **File Uploads**: Profile pictures and video thumbnails
- **Database**: PostgreSQL with proper indexing and relationships
- **Security**: Rate limiting, input validation, password hashing
- **Email**: Verification emails for creator accounts

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT
- **File Processing**: Sharp (image optimization)
- **Email**: Nodemailer
- **Validation**: Express-validator
- **Security**: Helmet, bcryptjs, CORS

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. **Clone and setup**:
   ```bash
   cd backend
   npm install
   ```

2. **Environment Setup**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Database Setup**:
   ```bash
   # Create database
   createdb skill_eureka
   
   # Run migrations
   npm run migrate
   
   # Seed with sample data
   node scripts/seed.js
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:5000`

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/skill_eureka` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-super-secret-key` |
| `EMAIL_USER` | SMTP email username | `your-email@gmail.com` |
| `EMAIL_PASS` | SMTP email password | `your-app-password` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |

## API Endpoints

### Authentication
- `POST /api/auth/register/user` - User registration
- `POST /api/auth/register/creator` - Creator application
- `POST /api/auth/verify/creator` - Creator verification
- `POST /api/auth/login/user` - User login
- `POST /api/auth/login/creator` - Creator login

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/liked-videos` - Get liked videos
- `GET /api/users/saved-videos` - Get saved videos
- `GET /api/users/watch-later` - Get watch later videos
- `GET /api/users/history` - Get watch history
- `POST /api/users/follow/:creatorId` - Follow creator
- `DELETE /api/users/follow/:creatorId` - Unfollow creator

### Creators
- `GET /api/creators` - Get all verified creators
- `GET /api/creators/:id` - Get creator by ID
- `GET /api/creators/:id/videos` - Get creator's videos
- `PUT /api/creators/profile` - Update creator profile
- `GET /api/creators/dashboard/stats` - Get creator stats

### Videos
- `GET /api/videos` - Get all videos (with pagination, search, category filter)
- `GET /api/videos/:id` - Get video by ID
- `POST /api/videos` - Upload video (creators only)
- `DELETE /api/videos/:id` - Delete video (creator only)
- `POST /api/videos/:id/like` - Like video
- `DELETE /api/videos/:id/like` - Unlike video
- `POST /api/videos/:id/save` - Save video
- `POST /api/videos/:id/watch-later` - Add to watch later
- `POST /api/videos/:id/history` - Add to history

### Categories
- `GET /api/categories` - Get all categories

### File Upload
- `POST /api/upload/profile-pic` - Upload profile picture
- `POST /api/upload/thumbnail` - Upload video thumbnail

## Database Schema

### Tables
- **users**: User accounts and profiles
- **creators**: Creator accounts and verification
- **videos**: Video content and metadata
- **categories**: Video categories (Class 1-8)
- **user_likes**: User video likes
- **user_saves**: User saved videos
- **watch_later**: User watch later list
- **user_history**: User watch history (limited to 10 items)
- **user_follows**: User-creator relationships

## File Structure

```
backend/
├── config/
│   └── database.js          # Database connection
├── middleware/
│   └── auth.js              # Authentication middleware
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── users.js             # User routes
│   ├── creators.js          # Creator routes
│   ├── videos.js            # Video routes
│   ├── categories.js        # Category routes
│   └── upload.js            # File upload routes
├── scripts/
│   ├── migrate.js           # Database migration runner
│   └── seed.js              # Database seeding
├── utils/
│   ├── email.js             # Email utilities
│   └── helpers.js           # Helper functions
├── uploads/                 # File upload directory
├── .env.example             # Environment template
├── package.json             # Dependencies
├── server.js                # Main server file
└── README.md                # This file
```

## Sample Data

The seed script creates:
- 2 sample users (johndoe, janesmith)
- 3 sample creators (alexj, sarahc, michaelr)
- 8 categories (Class 1-8)
- 8 sample videos across different categories

**Login Credentials**:
- Users: `johndoe/password123`, `janesmith/password123`
- Creators: `alexj/password123`, `sarahc/password123`, `michaelr/password123`

## Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Express-validator for all inputs
- **CORS**: Configured for frontend domain
- **Helmet**: Security headers
- **File Upload Security**: Type and size validation

## Production Deployment

1. **Environment**: Set `NODE_ENV=production`
2. **Database**: Use managed PostgreSQL (AWS RDS, Google Cloud SQL, etc.)
3. **File Storage**: Consider cloud storage (AWS S3, Cloudinary)
4. **Process Manager**: Use PM2 for process management
5. **Reverse Proxy**: Nginx for static files and SSL
6. **Monitoring**: Add logging and monitoring tools

## API Testing

Use the health check endpoint to verify the API:
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development"
}
```