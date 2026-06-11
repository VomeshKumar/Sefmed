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
        const createUsersTableQuery = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(50) DEFAULT 'user',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        await connection.query(createUsersTableQuery);
        console.log('Users table checked/created.');

        // Create the doctors table if it does not exist
        const createDoctorsTableQuery = `
            CREATE TABLE IF NOT EXISTS doctors (
                id INT AUTO_INCREMENT PRIMARY KEY,
                doctor_code VARCHAR(100),
                prefix VARCHAR(50),
                doctor_name VARCHAR(255) NOT NULL,
                hospital_name VARCHAR(255),
                gender ENUM('Male', 'Female', 'Other'),
                contact_number VARCHAR(50),
                email VARCHAR(255),
                date_of_birth DATE,
                marital_status VARCHAR(100),
                anniversary VARCHAR(100),
                qualification TEXT,
                state VARCHAR(100) NOT NULL,
                division VARCHAR(100) NOT NULL,
                zone VARCHAR(100) NOT NULL,
                district VARCHAR(100),
                city VARCHAR(100) NOT NULL,
                pincode VARCHAR(20),
                speciality VARCHAR(100),
                type VARCHAR(100),
                category VARCHAR(100),
                approximated_business VARCHAR(255),
                assigned_to VARCHAR(100),
                firm_name VARCHAR(255),
                registration_number VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        await connection.query(createDoctorsTableQuery);
        console.log('Doctors table checked/created.');
        connection.release();
    } catch (error) {
        console.error('Error connecting to or initializing the database:', error.message);
        console.error('Did you forget to put your MySQL password in the .env file?');
    }
}

initializeDB();

module.exports = pool;
