# 🎬 StreamFlix - Movie Streaming Subscription DBMS Mini Project

A complete movie streaming subscription system built with MySQL, Node.js, and vanilla HTML/CSS/JS. This project demonstrates key DBMS concepts including read-heavy optimization, personalization, and peak-hour concurrency handling.

## 📋 Features

- **User Authentication** - Login and registration system
- **Movie Browsing** - Browse, search, and filter movies by genre
- **Personalized Recommendations** - AI-like recommendations based on watch history and genre preferences
- **Watch History** - Track user viewing patterns
- **Movie Rating** - Rate movies on a 5-star scale
- **Popular Movies** - Trending movies based on watch count
- **Connection Pooling** - Handle multiple concurrent users efficiently
- **Caching** - In-memory caching for frequently accessed data
- **FULLTEXT Search** - Fast movie search using MySQL full-text indexes

## 🛠️ Tech Stack

**Database:**
- MySQL with connection pooling
- Stored procedures for recommendations
- Views for popular movies
- Indexes for read optimization
- FULLTEXT search indexes

**Backend:**
- Node.js + Express.js
- mysql2 for database connectivity
- In-memory caching layer
- RESTful API design

**Frontend:**
- Vanilla HTML5, CSS3, JavaScript
- Responsive design
- Single-page application (SPA) architecture
- Fetch API for backend communication

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MySQL Server (v5.7 or higher)
- npm or yarn

### Step 1: Setup Database

1. Start your MySQL server
2. Open MySQL command line or phpMyAdmin
3. Run the schema file:
```bash
mysql -u root -p < database/schema.sql
```

4. Load sample data:
```bash
mysql -u root -p < database/seed.sql
```

### Step 2: Setup Backend

1. Navigate to the backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional, defaults are provided):
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=movie_streaming
PORT=3000
```

4. Start the server:
```bash
npm start
```

The server will run on `http://localhost:3000`

### Step 3: Open Frontend

Simply open `frontend/index.html` in your web browser, or use a simple HTTP server:

```bash
# Using Python
cd frontend
python -m http.server 8080

# Then open http://localhost:8080
```

## 🎯 How to Use

1. **Register** a new account or **login** with existing credentials
2. **Browse** movies by genre or search for specific titles
3. **Click** on any movie to see details
4. **Watch** movies to build your history (simulated)
5. **Rate** movies with 1-5 stars
6. **Check** "For You" section for personalized recommendations
7. **View** your watch history

### Sample Login Credentials
- Email: `john@example.com`
- Password: `password123`

## 🗄️ Database Schema

### Tables
- **users** - User accounts with subscription status
- **subscriptions** - Subscription plans (Free, Premium, Ultra)
- **movies** - Movie catalog with genres and ratings
- **watch_history** - User viewing history for personalization
- **ratings** - User movie ratings

### DBMS Optimizations

#### Read-Heavy Optimization
```sql
-- Composite indexes for frequent queries
INDEX idx_genre_rating (genre, rating)
INDEX idx_user_watched (user_id, watched_at DESC)

-- FULLTEXT search for movie discovery
FULLTEXT INDEX ft_search (title, description)

-- Pre-computed view for popular movies
CREATE VIEW vw_popular_movies
```

#### Personalization Engine
```sql
-- Stored procedure for recommendations
CALL get_recommendations(user_id, limit)
-- Analyzes watch history to find favorite genres
-- Recommends highly-rated movies in those genres
```

#### Concurrency Handling
```javascript
// Connection pool with 10 connections
connectionLimit: 10
waitForConnections: true
enableKeepAlive: true
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Movies
- `GET /api/movies` - Browse all movies (with optional genre filter)
- `GET /api/movies/search?q=` - Search movies (FULLTEXT)
- `GET /api/movies/recommended/:userId` - Get personalized recommendations
- `GET /api/movies/popular` - Get trending movies
- `GET /api/genres` - Get all unique genres

### User Actions
- `GET /api/user/:userId` - Get user profile
- `GET /api/user/:userId/history` - Get watch history
- `POST /api/watch` - Record watch history
- `POST /api/rate` - Rate a movie

## 📊 DBMS Concepts Demonstrated

### 1. Read-Heavy Optimization
- **Connection Pooling**: Reuse database connections instead of creating new ones
- **Strategic Indexing**: Indexes on frequently queried columns (genre, rating, user_id)
- **Caching Layer**: In-memory cache for movie catalog and genres
- **Denormalization**: Storing rating directly in movies table for fast sorting
- **Views**: Pre-computed popular movies view

### 2. Personalization
- **Watch History Tracking**: Record every user interaction
- **Genre Preference Analysis**: Stored procedure analyzes viewing patterns
- **Recommendation Algorithm**: Suggests movies based on favorite genres
- **Rating System**: User feedback loop for better recommendations

### 3. Peak-Hour Concurrency
- **Connection Pool**: 10 concurrent connections with queue support
- **Non-blocking Queries**: Async/await for efficient I/O
- **Read Committed Isolation**: Default MySQL isolation level
- **No Row Locks**: Read-only queries don't block each other
- **Keep-Alive**: Persistent connections reduce overhead

## 📁 Project Structure

```
d:\DBMS PROJECT/
├── database/
│   ├── schema.sql              # Database tables + indexes + stored procedures
│   └── seed.sql                # Sample data (5 users, 20 movies)
├── backend/
│   ├── server.js               # Express server with all API endpoints
│   ├── db.js                   # MySQL connection pool configuration
│   └── package.json            # Node.js dependencies
├── frontend/
│   ├── index.html              # Single-page application
│   ├── style.css               # Responsive styling
│   └── app.js                  # Frontend logic + API calls
└── README.md                   # This file
```

## 🎓 Learning Outcomes

This project demonstrates:
- Database design and normalization
- Index optimization for read-heavy workloads
- Stored procedures and views
- Connection pooling for concurrency
- RESTful API design
- Frontend-backend integration
- Caching strategies
- Personalization algorithms

## 🔧 Troubleshooting

**Database connection error:**
- Ensure MySQL server is running
- Check database credentials in `db.js`
- Verify database exists: `SHOW DATABASES;`

**Server won't start:**
- Run `npm install` in backend folder
- Check if port 3000 is available
- Ensure Node.js is installed

**Frontend not loading:**
- Make sure backend server is running
- Check browser console for CORS errors
- Verify API_URL in `app.js` matches your server

## 📝 License

MIT License - This is an educational mini project for DBMS learning.

## 👨‍💻 Author

DBMS Mini Project - Movie Streaming Subscription System

---

**Note:** This is a mini project for educational purposes. For production use, implement proper password hashing (bcrypt), JWT authentication, input validation, and error handling.
