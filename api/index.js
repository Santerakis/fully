const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Схема данных
const ItemSchema = new mongoose.Schema({ name: String }, { versionKey: false });
const Item = mongoose.models.Item || mongoose.model('Item', ItemSchema);

let cachedDb = null;
async function connectToDatabase() {
    if (cachedDb) return cachedDb;
    const db = await mongoose.connect(process.env.MONGODB_URI);
    cachedDb = db;
    return db;
}

// Роуты
app.get('/api/items', async (req, res) => {
    await connectToDatabase();
    res.json(await Item.find());
});

app.post('/api/items', async (req, res) => {
    await connectToDatabase();
    const newItem = new Item({ name: req.body.name });
    await newItem.save();
    res.json(newItem);
});

app.put('/api/items/:id', async (req, res) => {
    await connectToDatabase();
    const item = await Item.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
    res.json(item);
});

app.delete('/api/items/:id', async (req, res) => {
    await connectToDatabase();
    await Item.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

module.exports = app;
