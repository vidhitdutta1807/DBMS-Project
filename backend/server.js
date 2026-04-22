const express = require('express');
const cors = require('cors');
const { pool, testConnection } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Simple in-memory cache for read-heavy operations
const cache = {};
const CACHE_TTL = 300000; // 5 minutes

// Test database connection on startup
testConnection();

// ==================== API ENDPOINTS ====================

// GET /api/movies - Browse all movies with optional genre filter
app.get('/api/movies', async (req, res) => {
  try {
    const cacheKey = 'all_movies_' + JSON.stringify(req.query);
    if (cache[cacheKey] && cache[cacheKey].expiry > Date.now()) {
      return res.json(cache[cacheKey].data);
    }

    const { genre, year, sort } = req.query;
    let query = 'SELECT * FROM movies WHERE 1=1';
    const params = [];

    if (genre) {
      query += ' AND genre = ?';
      params.push(genre);
    }
    if (year) {
      query += ' AND release_year = ?';
      params.push(year);
    }

    if (sort === 'rating') {
      query += ' ORDER BY rating DESC';
    } else if (sort === 'year') {
      query += ' ORDER BY release_year DESC';
    } else {
      query += ' ORDER BY rating DESC';
    }

    const [movies] = await pool.query(query, params);
    
    // Cache the result
    cache[cacheKey] = {
      data: movies,
      expiry: Date.now() + CACHE_TTL
    };

    res.json(movies);
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
});

// GET /api/movies/search - Search movies using FULLTEXT index
app.get('/api/movies/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const [movies] = await pool.query(
      'SELECT *, MATCH(title, description) AGAINST(?) as relevance FROM movies WHERE MATCH(title, description) AGAINST(?) ORDER BY relevance DESC',
      [q, q]
    );

    res.json(movies);
  } catch (error) {
    console.error('Error searching movies:', error);
    res.status(500).json({ error: 'Failed to search movies' });
  }
});

// GET /api/movies/recommended/:userId - Personalized recommendations
app.get('/api/movies/recommended/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = req.query.limit || 10;

    // Use stored procedure for recommendations
    const [recommendations] = await pool.query(
      'CALL get_recommendations(?, ?)',
      [userId, parseInt(limit)]
    );

    res.json(recommendations[0]);
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
});

// GET /api/movies/popular - Get popular movies using view
app.get('/api/movies/popular', async (req, res) => {
  try {
    const limit = req.query.limit || 10;
    
    const [movies] = await pool.query(
      'SELECT * FROM vw_popular_movies LIMIT ?',
      [parseInt(limit)]
    );

    res.json(movies);
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    res.status(500).json({ error: 'Failed to fetch popular movies' });
  }
});

// POST /api/auth/login - User login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await pool.query(
      'SELECT user_id, username, email, subscription_status FROM users WHERE email = ? AND password = ?',
      [email, password]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json(users[0]);
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// POST /api/auth/register - User registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const [result] = await pool.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, password]
    );

    res.json({ 
      message: 'User registered successfully',
      userId: result.insertId 
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Email or username already exists' });
    }
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// GET /api/user/:userId - Get user profile
app.get('/api/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const [users] = await pool.query(
      'SELECT user_id, username, email, subscription_status, created_at FROM users WHERE user_id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(users[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// POST /api/watch - Record watch history
app.post('/api/watch', async (req, res) => {
  try {
    const { userId, movieId, duration } = req.body;

    await pool.query(
      'INSERT INTO watch_history (user_id, movie_id, watch_duration) VALUES (?, ?, ?)',
      [userId, movieId, duration || 0]
    );

    res.json({ message: 'Watch history recorded' });
  } catch (error) {
    console.error('Error recording watch history:', error);
    res.status(500).json({ error: 'Failed to record watch history' });
  }
});

// GET /api/user/:userId/history - Get user watch history
app.get('/api/user/:userId/history', async (req, res) => {
  try {
    const { userId } = req.params;

    const [history] = await pool.query(
      `SELECT wh.*, m.title, m.genre, m.rating, m.thumbnail_url 
       FROM watch_history wh 
       JOIN movies m ON wh.movie_id = m.movie_id 
       WHERE wh.user_id = ? 
       ORDER BY wh.watched_at DESC 
       LIMIT 20`,
      [userId]
    );

    res.json(history);
  } catch (error) {
    console.error('Error fetching watch history:', error);
    res.status(500).json({ error: 'Failed to fetch watch history' });
  }
});

// POST /api/rate - Rate a movie
app.post('/api/rate', async (req, res) => {
  try {
    const { userId, movieId, score } = req.body;

    if (score < 1 || score > 5) {
      return res.status(400).json({ error: 'Score must be between 1 and 5' });
    }

    await pool.query(
      'INSERT INTO ratings (user_id, movie_id, score) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE score = ?, rated_at = NOW()',
      [userId, movieId, score, score]
    );

    res.json({ message: 'Rating submitted' });
  } catch (error) {
    console.error('Error submitting rating:', error);
    res.status(500).json({ error: 'Failed to submit rating' });
  }
});

// GET /api/genres - Get all unique genres
app.get('/api/genres', async (req, res) => {
  try {
    const cacheKey = 'all_genres';
    if (cache[cacheKey] && cache[cacheKey].expiry > Date.now()) {
      return res.json(cache[cacheKey].data);
    }

    const [genres] = await pool.query(
      'SELECT DISTINCT genre FROM movies ORDER BY genre'
    );

    cache[cacheKey] = {
      data: genres.map(g => g.genre),
      expiry: Date.now() + CACHE_TTL
    };

    res.json(genres.map(g => g.genre));
  } catch (error) {
    console.error('Error fetching genres:', error);
    res.status(500).json({ error: 'Failed to fetch genres' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Ready to handle concurrent requests with connection pooling`);
});
