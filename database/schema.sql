-- Movie Streaming Subscription Database Schema
-- Focus: Read-heavy optimization, personalization, concurrency

CREATE DATABASE IF NOT EXISTS movie_streaming;
USE movie_streaming;

-- Users table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    subscription_status ENUM('free', 'premium') DEFAULT 'free',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_subscription (subscription_status),
    INDEX idx_created (created_at)
) ENGINE=InnoDB;

-- Subscription plans
CREATE TABLE subscriptions (
    plan_id INT AUTO_INCREMENT PRIMARY KEY,
    plan_name VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    max_screens INT NOT NULL,
    description TEXT
) ENGINE=InnoDB;

-- Movies table with indexes for read optimization
CREATE TABLE movies (
    movie_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    genre VARCHAR(50) NOT NULL,
    release_year INT,
    rating DECIMAL(3, 1) DEFAULT 0.0,
    description TEXT,
    thumbnail_url VARCHAR(500),
    INDEX idx_genre_rating (genre, rating),
    INDEX idx_release_year (release_year),
    FULLTEXT INDEX ft_search (title, description)
) ENGINE=InnoDB;

-- Watch history for personalization
CREATE TABLE watch_history (
    history_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    movie_id INT NOT NULL,
    watched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    watch_duration INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id) ON DELETE CASCADE,
    INDEX idx_user_watched (user_id, watched_at DESC),
    INDEX idx_movie (movie_id)
) ENGINE=InnoDB;

-- User ratings
CREATE TABLE ratings (
    rating_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    movie_id INT NOT NULL,
    score INT NOT NULL CHECK (score BETWEEN 1 AND 5),
    rated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_movie (user_id, movie_id),
    INDEX idx_user_score (user_id, score),
    INDEX idx_movie_score (movie_id, score)
) ENGINE=InnoDB;

-- Stored procedure for personalized recommendations
DELIMITER //
CREATE PROCEDURE get_recommendations(IN p_user_id INT, IN p_limit INT)
BEGIN
    -- Get user's favorite genres from watch history
    SELECT DISTINCT 
        m.movie_id,
        m.title,
        m.genre,
        m.rating,
        m.description,
        m.thumbnail_url
    FROM movies m
    WHERE m.genre IN (
        SELECT m2.genre
        FROM watch_history wh
        JOIN movies m2 ON wh.movie_id = m2.movie_id
        WHERE wh.user_id = p_user_id
        GROUP BY m2.genre
        ORDER BY COUNT(*) DESC
        LIMIT 3
    )
    AND m.movie_id NOT IN (
        SELECT movie_id FROM watch_history WHERE user_id = p_user_id
    )
    ORDER BY m.rating DESC
    LIMIT p_limit;
END //
DELIMITER ;

-- View for popular movies
CREATE VIEW vw_popular_movies AS
SELECT 
    m.movie_id,
    m.title,
    m.genre,
    m.rating,
    m.thumbnail_url,
    COUNT(wh.history_id) as watch_count
FROM movies m
LEFT JOIN watch_history wh ON m.movie_id = wh.movie_id
GROUP BY m.movie_id
ORDER BY watch_count DESC;
