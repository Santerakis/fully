import { useEffect, useState } from 'react';

function App() {
    const [items, setItems] = useState([]);
    const [text, setText] = useState('');

    const fetchItems = () => {
        fetch('/api/items').then(res => res.json()).then(setItems);
    };

    useEffect(fetchItems, []);

    // УДАЛЕНИЕ
    const deleteItem = async (id) => {
        await fetch(`/api/items/${id}`, { method: 'DELETE' });
        fetchItems();
    };

    // РЕДАКТИРОВАНИЕ
    const editItem = async (id) => {
        const newName = prompt("Введите новое название:");
        if (!newName) return;

        await fetch(`/api/items/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newName })
        });
        fetchItems();
    };

    const addItem = async () => {
        await fetch('/api/items', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: text })
        });
        setText('');
        fetchItems();
    };

    return (
        <div style={{ padding: '20px' }}>
            <input value={text} onChange={(e) => setText(e.target.value)} />
            <button onClick={addItem}>Добавить</button>
            <ul>
                {items.map(item => (
                    <li key={item._id}>
                        {item.name}
                        <button onClick={() => editItem(item._id)}>✏️</button>
                        <button onClick={() => deleteItem(item._id)}>❌</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
export default App;
