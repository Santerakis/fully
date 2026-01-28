const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Мидлвары
app.use(cors());
app.use(express.json());

// 1. Определение схемы и модели
const ItemSchema = new mongoose.Schema({
    name: { type: String, required: true }
}, { versionKey: false });

// Важно для Vercel: проверяем, существует ли модель, чтобы не создавать её дважды
const Item = mongoose.models.Item || mongoose.model('Item', ItemSchema);

// 2. Функция подключения к БД с кэшированием
let cachedDb = null;

async function connectToDatabase() {
    if (cachedDb) return cachedDb;

    if (!process.env.MONGODB_URI) {
        throw new Error('Укажите MONGODB_URI в настройках Environment Variables');
    }

    const db = await mongoose.connect(process.env.MONGODB_URI);
    cachedDb = db;
    return db;
}

// 3. Роуты (API)

// Получить все записи
app.get('/api/items', async (req, res) => {
    try {
        await connectToDatabase();
        const items = await Item.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Создать запись
app.post('/api/items', async (req, res) => {
    try {
        await connectToDatabase();
        const newItem = new Item({ name: req.body.name });
        await newItem.save();
        res.json(newItem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Редактировать запись
app.put('/api/items/:id', async (req, res) => {
    try {
        await connectToDatabase();
        const updatedItem = await Item.findByIdAndUpdate(
            req.params.id,
            { name: req.body.name },
            { new: true }
        );
        res.json(updatedItem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Удалить запись
app.delete('/api/items/:id', async (req, res) => {
    try {
        await connectToDatabase();
        await Item.findByIdAndDelete(req.params.id);
        res.json({ message: "Удалено успешно" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Экспорт для Vercel
module.exports = app;
