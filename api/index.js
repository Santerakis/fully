const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/message', (req, res) => {
    res.json({ message: "Привет из Serverless Backend!" });
});

module.exports = app; // Обязательно для Vercel
