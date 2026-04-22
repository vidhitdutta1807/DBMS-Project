-- Seed data for Movie Streaming Database

USE movie_streaming;

-- Insert subscription plans
INSERT INTO subscriptions (plan_name, price, max_screens, description) VALUES
('Free', 0.00, 1, 'Basic access with ads'),
('Premium', 9.99, 3, 'HD streaming, no ads'),
('Ultra', 14.99, 5, '4K streaming, all features');

-- Insert users
INSERT INTO users (username, email, password, subscription_status) VALUES
('john_doe', 'john@example.com', 'password123', 'premium'),
('jane_smith', 'jane@example.com', 'password123', 'premium'),
('bob_wilson', 'bob@example.com', 'password123', 'free'),
('alice_brown', 'alice@example.com', 'password123', 'free'),
('charlie_davis', 'charlie@example.com', 'password123', 'premium');

-- Insert movies (20 movies across different genres)
INSERT INTO movies (title, genre, release_year, rating, description, thumbnail_url) VALUES
('The Matrix', 'Action', 1999, 8.7, 'A computer hacker learns about the true nature of reality', 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=The+Matrix'),
('Inception', 'Sci-Fi', 2010, 8.8, 'A thief who steals corporate secrets through dream-sharing technology', 'https://via.placeholder.com/300x450/2a2a2a/ffffff?text=Inception'),
('The Dark Knight', 'Action', 2008, 9.0, 'Batman faces the Joker who wreaks havoc on Gotham', 'https://via.placeholder.com/300x450/3a3a3a/ffffff?text=Dark+Knight'),
('Interstellar', 'Sci-Fi', 2014, 8.6, 'A team of explorers travel through a wormhole in space', 'https://via.placeholder.com/300x450/4a4a4a/ffffff?text=Interstellar'),
('Pulp Fiction', 'Drama', 1994, 8.9, 'The lives of two mob hitmen intertwine', 'https://via.placeholder.com/300x450/5a5a5a/ffffff?text=Pulp+Fiction'),
('The Shawshank Redemption', 'Drama', 1994, 9.3, 'Two imprisoned men bond over a number of years', 'https://via.placeholder.com/300x450/6a6a6a/ffffff?text=Shawshank'),
('Forrest Gump', 'Drama', 1994, 8.8, 'The presidencies of Kennedy and Johnson unfold through the perspective of an Alabama man', 'https://via.placeholder.com/300x450/7a7a7a/ffffff?text=Forrest+Gump'),
('The Godfather', 'Crime', 1972, 9.2, 'The aging patriarch of an organized crime dynasty transfers control to his reluctant son', 'https://via.placeholder.com/300x450/8a8a8a/ffffff?text=Godfather'),
('Fight Club', 'Drama', 1999, 8.8, 'An insomniac office worker and a devil-may-care soap maker form an underground fight club', 'https://via.placeholder.com/300x450/9a9a9a/ffffff?text=Fight+Club'),
('The Avengers', 'Action', 2012, 8.0, 'Earth mightiest heroes must come together to stop Loki', 'https://via.placeholder.com/300x450/aa1111/ffffff?text=Avengers'),
('Jurassic Park', 'Sci-Fi', 1993, 8.1, 'A theme park suffers a major power breakdown that allows its cloned dinosaur exhibits to run amok', 'https://via.placeholder.com/300x450/bb2222/ffffff?text=Jurassic+Park'),
('Titanic', 'Romance', 1997, 7.8, 'A seventeen-year-old aristocrat falls in love with a kind but poor artist', 'https://via.placeholder.com/300x450/cc3333/ffffff?text=Titanic'),
('The Lion King', 'Animation', 1994, 8.5, 'Lion prince Simba flees his kingdom only to learn the true meaning of responsibility', 'https://via.placeholder.com/300x450/dd4444/ffffff?text=Lion+King'),
('Toy Story', 'Animation', 1995, 8.3, 'A cowboy doll is profoundly threatened when a new spaceman figure arrives', 'https://via.placeholder.com/300x450/ee5555/ffffff?text=Toy+Story'),
('Finding Nemo', 'Animation', 2003, 8.1, 'After his son is captured in the Great Barrier Reef, a timid clownfish sets out on a dangerous journey', 'https://via.placeholder.com/300x450/ff6666/ffffff?text=Finding+Nemo'),
('The Hangover', 'Comedy', 2009, 7.7, 'Three buddies wake up from a bachelor party in Las Vegas with no memory', 'https://via.placeholder.com/300x450/11aa11/ffffff?text=Hangover'),
('Superbad', 'Comedy', 2007, 7.6, 'Two co-dependent high school seniors are forced to deal with separation anxiety', 'https://via.placeholder.com/300x450/22bb22/ffffff?text=Superbad'),
('The Conjuring', 'Horror', 2013, 7.5, 'Paranormal investigators work to help a family terrorized by a dark presence', 'https://via.placeholder.com/300x450/33cc33/ffffff?text=Conjuring'),
('Get Out', 'Horror', 2017, 7.7, 'A young African-American visits his white girlfriend parents estate for a weekend', 'https://via.placeholder.com/300x450/44dd44/ffffff?text=Get+Out'),
('A Quiet Place', 'Horror', 2018, 7.5, 'In a post-apocalyptic world, a family is forced to live in silence', 'https://via.placeholder.com/300x450/55ee55/ffffff?text=Quiet+Place');

-- Insert watch history for personalization
INSERT INTO watch_history (user_id, movie_id, watch_duration) VALUES
(1, 1, 120), (1, 2, 135), (1, 3, 150), (1, 10, 140),
(2, 5, 110), (2, 6, 130), (2, 7, 125), (2, 12, 145),
(3, 1, 90), (3, 16, 100), (3, 17, 95),
(4, 13, 85), (4, 14, 90), (4, 15, 88),
(5, 2, 135), (5, 4, 140), (5, 11, 125);

-- Insert ratings
INSERT INTO ratings (user_id, movie_id, score) VALUES
(1, 1, 5), (1, 2, 5), (1, 3, 4), (1, 10, 4),
(2, 5, 5), (2, 6, 5), (2, 7, 4), (2, 12, 5),
(3, 1, 4), (3, 16, 5), (3, 17, 4),
(4, 13, 5), (4, 14, 4), (4, 15, 5),
(5, 2, 5), (5, 4, 5), (5, 11, 4);
