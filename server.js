const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();

// Middleware
// Allow CORS from any origin for development
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'finance_manager'
});

// Connect to database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Import auth middleware
const auth = require('./middleware/auth');

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/transactions', auth, require('./routes/transactions'));
app.use('/api/categories', auth, require('./routes/categories'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
}); 