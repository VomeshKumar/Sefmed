const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./db'); // Ensure DB connection and initialization happens
const authRoutes = require('./routes/authRoutes');
const doctorRoutes = require('./routes/doctorRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests

// Routes
// We mount auth routes at / to maintain backward compatibility with /login and /register
app.use('/', authRoutes); 
// We mount doctors routes at /api/doctors
app.use('/api/doctors', doctorRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.send('Sefmed API is running');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
