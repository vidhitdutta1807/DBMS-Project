const API_URL = 'http://localhost:3000/api';

let currentUser = null;
let allMovies = [];
let allGenres = [];

// ==================== AUTHENTICATION ====================

// Show auth tab (login/register)
function showAuthTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    if (tab === 'login') {
        document.getElementById('loginForm').style.display = 'flex';
        document.getElementById('registerForm').style.display = 'none';
    } else {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('registerForm').style.display = 'flex';
    }
}

// Login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        
        if (response.ok) {
            currentUser = data;
            localStorage.setItem('user', JSON.stringify(data));
            showMainApp();
        } else {
            alert(data.error);
        }
    } catch (error) {
        alert('Login failed. Please try again.');
    }
});

// Register
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();
        
        if (response.ok) {
            alert('Registration successful! Please login.');
            showAuthTab('login');
        } else {
            alert(data.error);
        }
    } catch (error) {
        alert('Registration failed. Please try again.');
    }
});

// Logout
function logout() {
    currentUser = null;
    localStorage.removeItem('user');
    document.getElementById('authSection').style.display = 'flex';
    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('userInfo').style.display = 'none';
}

// Show main app after login
function showMainApp() {
    document.getElementById('authSection').style.display = 'none';
    document.getElementById('mainContent').style.display = 'block';
    document.getElementById('userInfo').style.display = 'flex';
    document.getElementById('username').textContent = currentUser.username;
    
    loadGenres();
    loadMovies();
    showSection('browse');
}

// ==================== NAVIGATION ====================

// Show different sections
function showSection(section) {
    document.querySelectorAll('.content-section').forEach(s => s.style.display = 'none');
    
    if (section === 'browse') {
        document.getElementById('browseSection').style.display = 'block';
    } else if (section === 'recommended') {
        document.getElementById('recommendedSection').style.display = 'block';
        loadRecommendations();
    } else if (section === 'history') {
        document.getElementById('historySection').style.display = 'block';
        loadHistory();
    } else if (section === 'popular') {
        document.getElementById('popularSection').style.display = 'block';
        loadPopular();
    }
}

// ==================== MOVIE LOADING ====================

// Load all movies
async function loadMovies(genre = 'all') {
    const grid = document.getElementById('moviesGrid');
    grid.innerHTML = '<div class="loading">Loading movies...</div>';

    try {
        let url = `${API_URL}/movies?sort=rating`;
        if (genre !== 'all') {
            url += `&genre=${genre}`;
        }

        const response = await fetch(url);
        allMovies = await response.json();
        displayMovies(allMovies, grid);
    } catch (error) {
        grid.innerHTML = '<div class="loading">Failed to load movies</div>';
    }
}

// Display movies in grid
function displayMovies(movies, grid) {
    if (movies.length === 0) {
        grid.innerHTML = '<div class="loading">No movies found</div>';
        return;
    }

    grid.innerHTML = movies.map(movie => `
        <div class="movie-card" onclick="showMovieDetail(${movie.movie_id})">
            <img src="${movie.thumbnail_url}" alt="${movie.title}">
            <div class="movie-info">
                <div class="movie-title">${movie.title}</div>
                <div class="movie-meta">
                    <span>${movie.genre}</span>
                    <span class="movie-rating">⭐ ${movie.rating}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Load genres
async function loadGenres() {
    try {
        const response = await fetch(`${API_URL}/genres`);
        allGenres = await response.json();
        
        const container = document.getElementById('genreButtons');
        container.innerHTML = allGenres.map(genre => `
            <button onclick="filterByGenre('${genre}')" class="genre-btn">${genre}</button>
        `).join('');
    } catch (error) {
        console.error('Failed to load genres:', error);
    }
}

// Filter by genre
function filterByGenre(genre) {
    document.querySelectorAll('.genre-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    loadMovies(genre);
}

// Search movies
async function searchMovies() {
    const query = document.getElementById('searchInput').value;
    if (!query) return;

    const grid = document.getElementById('moviesGrid');
    grid.innerHTML = '<div class="loading">Searching...</div>';

    try {
        const response = await fetch(`${API_URL}/movies/search?q=${encodeURIComponent(query)}`);
        const movies = await response.json();
        displayMovies(movies, grid);
        showSection('browse');
    } catch (error) {
        grid.innerHTML = '<div class="loading">Search failed</div>';
    }
}

// Clear search
function clearSearch() {
    document.getElementById('searchInput').value = '';
    loadMovies();
}

// ==================== RECOMMENDATIONS ====================

// Load personalized recommendations
async function loadRecommendations() {
    const grid = document.getElementById('recommendedGrid');
    grid.innerHTML = '<div class="loading">Loading recommendations...</div>';

    try {
        const response = await fetch(`${API_URL}/movies/recommended/${currentUser.user_id}?limit=10`);
        const movies = await response.json();
        
        if (movies.length === 0) {
            grid.innerHTML = '<div class="loading">Watch some movies to get personalized recommendations!</div>';
        } else {
            displayMovies(movies, grid);
        }
    } catch (error) {
        grid.innerHTML = '<div class="loading">Failed to load recommendations</div>';
    }
}

// ==================== POPULAR MOVIES ====================

// Load popular movies
async function loadPopular() {
    const grid = document.getElementById('popularGrid');
    grid.innerHTML = '<div class="loading">Loading popular movies...</div>';

    try {
        const response = await fetch(`${API_URL}/movies/popular?limit=10`);
        const movies = await response.json();
        displayMovies(movies, grid);
    } catch (error) {
        grid.innerHTML = '<div class="loading">Failed to load popular movies</div>';
    }
}

// ==================== WATCH HISTORY ====================

// Load user watch history
async function loadHistory() {
    const list = document.getElementById('historyList');
    list.innerHTML = '<div class="loading">Loading history...</div>';

    try {
        const response = await fetch(`${API_URL}/user/${currentUser.user_id}/history`);
        const history = await response.json();
        
        if (history.length === 0) {
            list.innerHTML = '<div class="loading">No watch history yet. Start watching movies!</div>';
        } else {
            list.innerHTML = history.map(item => `
                <div class="history-item" onclick="showMovieDetail(${item.movie_id})">
                    <img src="${item.thumbnail_url}" alt="${item.title}">
                    <div class="history-info">
                        <h4>${item.title}</h4>
                        <p>${item.genre} • ⭐ ${item.rating}</p>
                        <p>Watched: ${new Date(item.watched_at).toLocaleDateString()}</p>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        list.innerHTML = '<div class="loading">Failed to load history</div>';
    }
}

// ==================== MOVIE DETAIL MODAL ====================

// Show movie detail
async function showMovieDetail(movieId) {
    const movie = allMovies.find(m => m.movie_id === movieId) || 
                  await fetch(`${API_URL}/movies`).then(r => r.json()).then(movies => 
                      movies.find(m => m.movie_id === movieId));

    if (!movie) return;

    const modal = document.getElementById('movieModal');
    const modalBody = document.getElementById('modalBody');

    modalBody.innerHTML = `
        <h2 class="modal-movie-title">${movie.title}</h2>
        <div class="modal-movie-meta">
            <span>${movie.genre}</span>
            <span>${movie.release_year}</span>
            <span class="movie-rating">⭐ ${movie.rating}</span>
        </div>
        <p class="modal-movie-desc">${movie.description}</p>
        <button onclick="watchMovie(${movie.movie_id})" class="btn-watch">▶ Watch Now</button>
        <div class="rating-section">
            <h3>Rate this movie:</h3>
            <div class="rating-buttons">
                ${[1, 2, 3, 4, 5].map(score => `
                    <button onclick="rateMovie(${movie.movie_id}, ${score})" class="rating-btn">${score} ⭐</button>
                `).join('')}
            </div>
        </div>
    `;

    modal.style.display = 'block';
}

// Close modal
function closeModal() {
    document.getElementById('movieModal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('movieModal');
    if (event.target === modal) {
        closeModal();
    }
}

// ==================== USER ACTIONS ====================

// Watch movie (record to history)
async function watchMovie(movieId) {
    try {
        await fetch(`${API_URL}/watch`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: currentUser.user_id,
                movieId: movieId,
                duration: 120
            })
        });

        alert('Now playing! Enjoy the movie! 🎬');
        closeModal();
    } catch (error) {
        alert('Failed to record watch history');
    }
}

// Rate movie
async function rateMovie(movieId, score) {
    try {
        const response = await fetch(`${API_URL}/rate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: currentUser.user_id,
                movieId: movieId,
                score: score
            })
        });

        if (response.ok) {
            alert(`Thanks for rating! You gave ${score} stars ⭐`);
        }
    } catch (error) {
        alert('Failed to submit rating');
    }
}

// ==================== INITIALIZATION ====================

// Check if user is already logged in
window.onload = function() {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showMainApp();
    }
};
