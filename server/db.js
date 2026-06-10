const mysql = require('mysql2/promise');
require('dotenv').config();

// Create a connection pool to the database
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Function to initialize the database table
async function initializeDB() {
    try {
        const connection = await pool.getConnection();
        console.log('Successfully connected to MySQL database.');
        
        // Create the users table if it does not exist
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(50) DEFAULT 'user',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        await connection.query(createTableQuery);
        console.log('Users table checked/created.');
        connection.release();
    } catch (error) {
        console.error('Error connecting to or initializing the database:', error.message);
        console.error('Did you forget to put your MySQL password in the .env file?');
    }
}

initializeDB();

module.exports = pool;
