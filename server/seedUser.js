const bcrypt = require('bcrypt');
const db = require('./db');

async function seedAdmin() {
    try {
        console.log("Checking if role column exists...");
        try {
            await db.query('ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT "user"');
            console.log("Added role column to users table.");
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log("Role column already exists.");
            } else {
                throw err;
            }
        }

        const email = 'admin@gmail.com';
        const password = '123456';
        const role = 'admin';

        // Check if admin already exists
        const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            console.log(`User ${email} already exists. Updating role to admin just in case.`);
            await db.query('UPDATE users SET role = "admin" WHERE email = ?', [email]);
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            await db.query('INSERT INTO users (email, password, role) VALUES (?, ?, ?)', [email, hashedPassword, role]);
            console.log(`Successfully inserted admin user: ${email}`);
        }
    } catch (error) {
        console.error("Error seeding user:", error.message);
    } finally {
        process.exit(0);
    }
}

seedAdmin();
