const express = require('express');
const speakeasy = require('speakeasy');
const uuid = require('uuid');
const { JsonDB } = require('node-json-db');
const { Config } = require('node-json-db/dist/lib/JsonDBConfig');

const app = express();

// initialize db with node-json-db
const db = new JsonDB(new Config('myDatabase', true, false, '/'))

// routes
app.get('/api', (req, res) => res.json({ message: 'Welcome to the two factor authentication example.'}))

// Register user and create temporary secret
app.post('/api/register', (req, res) => {
    const id = uuid.v4()

    try {
        const path = `/user/${id}`
        const temp_secret = speakeasy.generateSecret()
        db.push(path, { id, temp_secret })
        res.json({ id, secret: temp_secret.base32 })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error generating the secret' })
    }

})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));