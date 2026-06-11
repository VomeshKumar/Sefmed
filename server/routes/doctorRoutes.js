const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');

// POST /api/doctors
router.post('/', doctorController.createDoctor);

// GET /api/doctors
router.get('/', doctorController.getAllDoctors);

module.exports = router;
