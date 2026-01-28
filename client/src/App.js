import { useEffect, useState } from 'react';

function App() {
    const [items, setItems] = useState([]);
    const [text, setText] = useState('');
    const [editingId, setEditingId] = useState(null); // ID строки, которую правим
    const [editText, setEditText] = useState('');    // Временный текст для правки

    const fetchItems = () => {
        fetch('/api/items').then(res => res.json()).then(setItems);
    };

    useEffect(fetchItems, []);

    const addItem = async () => {
        if (!text.trim()) return;
        await fetch('/api/items', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: text })
        });
        setText('');
        fetchItems();
    };

    const deleteItem = async (id) => {
        await fetch(`/api/items/${id}`, { method: 'DELETE' });
        fetchItems();
    };

    const startEdit = (item) => {
        setEditingId(item._id);
        setEditText(item.name);
    };

    const saveEdit = async (id) => {
        await fetch(`/api/items/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: editText })
        });
        setEditingId(null);
        fetchItems();
    };

    return (
        <div style={{ padding: '40px', maxWidth: '500px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            <h2>📋 Мой список</h2>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <input
                    style={{ flex: 1, padding: '8px' }}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Что добавить?"
                />
                <button onClick={addItem} style={{ cursor: 'pointer' }}>Добавить</button>
            </div>

            <ul style={{ listStyle: 'none', padding: 0 }}>
                {items.map(item => (
                    <li key={item._id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px',
                        borderBottom: '1px solid #eee'
                    }}>
                        {editingId === item._id ? (
                            // ИНЛАЙН ПОЛЕ ВВОДА
                            <>
                                <input
                                    style={{ flex: 1, marginRight: '10px' }}
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    autoFocus
                                />
                                <button onClick={() => saveEdit(item._id)}>✅</button>
                                <button onClick={() => setEditingId(null)}>❌</button>
                            </>
                        ) : (
                            // ОБЫЧНЫЙ ТЕКСТ
                            <>
                                <span style={{ flex: 1 }}>{item.name}</span>
                                <div style={{ display: 'flex', gap: '5px' }}>
                                    <button onClick={() => startEdit(item)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✏️</button>
                                    <button onClick={() => deleteItem(item._id)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>🗑️</button>
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
