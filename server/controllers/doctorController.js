const db = require('../db');

exports.createDoctor = async (req, res) => {
    try {
        const {
            doctorCode, prefix, doctorName, hospitalName, gender,
            contactNumber, email, dateOfBirth, maritalStatus, anniversary,
            qualification, state, division, zone, district, city, pincode,
            speciality, type, category, approximatedBusiness, assignedTo,
            firmName, registrationNumber
        } = req.body;

        // Basic validation for required fields
        if (!doctorName || !state || !division || !zone || !city) {
            return res.status(400).json({ message: 'Missing required fields: doctorName, state, division, zone, city are required.' });
        }

        // Format dates if provided
        // The frontend might send dateOfBirth as an object { day, month, year } or a string.
        // Assuming we combine them or it's sent as a standard string. We'll handle a string for now, 
        // if frontend sends an object, we need to format it to YYYY-MM-DD.
        let dob = dateOfBirth;
        if (dateOfBirth && typeof dateOfBirth === 'object') {
             // Handle { year, month, day }
             if (dateOfBirth.year && dateOfBirth.month && dateOfBirth.day) {
                 dob = `${dateOfBirth.year}-${String(dateOfBirth.month).padStart(2, '0')}-${String(dateOfBirth.day).padStart(2, '0')}`;
             } else {
                 dob = null;
             }
        }

        const insertQuery = `
            INSERT INTO doctors (
                doctor_code, prefix, doctor_name, hospital_name, gender,
                contact_number, email, date_of_birth, marital_status, anniversary,
                qualification, state, division, zone, district, city, pincode,
                speciality, type, category, approximated_business, assigned_to,
                firm_name, registration_number
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            doctorCode || null,
            prefix || null,
            doctorName,
            hospitalName || null,
            gender || null,
            contactNumber || null,
            email || null,
            dob || null,
            maritalStatus || null,
            anniversary || null,
            qualification || null,
            state,
            division,
            zone,
            district || null,
            city,
            pincode || null,
            speciality || null,
            type || null,
            category || null,
            approximatedBusiness || null,
            assignedTo || null,
            firmName || null,
            registrationNumber || null
        ];

        const [result] = await db.query(insertQuery, values);

        res.status(201).json({ 
            message: 'Doctor created successfully', 
            doctorId: result.insertId 
        });

    } catch (error) {
        console.error('Error creating doctor:', error);
        res.status(500).json({ message: 'Internal server error while creating doctor.' });
    }
};

exports.getAllDoctors = async (req, res) => {
    try {
        const [doctors] = await db.query('SELECT * FROM doctors ORDER BY created_at DESC');
        res.status(200).json(doctors);
    } catch (error) {
        console.error('Error fetching doctors:', error);
        res.status(500).json({ message: 'Internal server error while fetching doctors.' });
    }
};
