const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();

const port = 3000;

//This is edited
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const app = express();
app.use(express.json());

// Start Server

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

// List all contacts
app.get('/allcontacts', async (req, res) => {
    try {
        let connection = await mysql.createConnection(dbConfig);
        const[rows] = await connection.execute('SELECT * FROM defaultdb.contacts');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error for all contacts' });
    }
});

//Create a new contact
app.post('/add', async (req, res) => {
    const { name, number, image } = req.body;

    try {
        let connection = await mysql.createConnection(dbConfig);

        await connection.execute(
            'INSERT INTO defaultdb.contacts (name, number, image) VALUES (?, ?, ?)',
            [name, number, image],
        );

        res.status(201).json({
            message: `Contact ${name} added successfully`
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: `Server error - could not add contact ${name}`
        });
    }
});

// Update Contact
app.post('/update', async (req, res) => {
    const { id, name, number, image } = req.body;

    try {
        let connection = await mysql.createConnection(dbConfig);

        await connection.execute(
            'UPDATE defaultdb.contacts SET name = ? , number = ?, image = ? WHERE id = ?',
            [name, number, image, id],

        );

        res.status(201).json({
            message: `Contact ${name} updated successfully`
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: `Server error - could not add contact ${name}`
        });
    }
});

// Delete Contact
app.delete('/delete', async (req, res) => {
    const {number} = req.body;

    try {
        let connection = await mysql.createConnection(dbConfig);

        await connection.execute(
            'DELETE FROM defaultdb.contacts WHERE number = ?;',
            [number]

        );

        res.status(201).json({
            message: `Contact deleted successfully`
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: `Server error - could not delete contact`
        });
    }
});

