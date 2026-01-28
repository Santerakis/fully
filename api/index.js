const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Подключение к БД (через переменную окружения)
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Простая схема данных
const ItemSchema = new mongoose.Schema({ name: String });
const Item = mongoose.model('Item', ItemSchema);

// Маршруты
app.get('/api/items', async (req, res) => {
    const items = await Item.find();
    res.json(items);
});

app.post('/api/items', async (req, res) => {
    const newItem = new Item({ name: req.body.name });
    await newItem.save();
    res.json(newItem);
});

// Редактирование (Update)
app.put('/api/items/:id', async (req, res) => {
    await connectToDatabase();
    const updatedItem = await Item.findByIdAndUpdate(
        req.params.id,
        { name: req.body.name },
        { new: true } // Вернуть обновленный объект
    );
    res.json(updatedItem);
});

// Удаление (Delete)
app.delete('/api/items/:id', async (req, res) => {
    await connectToDatabase();
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: "Удалено" });
});

module.exports = app;
