import { useEffect, useState } from 'react';

function App() {
    const [items, setItems] = useState([]);
    const [text, setText] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState('');

    const fetchItems = () => {
        fetch('/api/items').then(r => r.json()).then(setItems).catch(() => {});
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
        const backup = [...items];
        setItems(items.filter(i => i._id !== id)); // Мгновенное удаление в UI
        try {
            const r = await fetch(`/api/items/${id}`, { method: 'DELETE' });
            if (!r.ok) setItems(backup); // Откат при ошибке сервера
        } catch {
            setItems(backup); // Откат при ошибке сети
        }
    };

    const saveEdit = async (id) => {
        if (!editingId) return;
        const backup = [...items];
        const oldItem = items.find(i => i._id === id);
        if (editText === oldItem.name) return setEditingId(null);

        setItems(items.map(i => i._id === id ? { ...i, name: editText } : i)); // Мгновенная правка в UI
        setEditingId(null);

        try {
            const r = await fetch(`/api/items/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: editText })
            });
            if (!r.ok) setItems(backup);
        } catch {
            setItems(backup);
        }
    };

    return (
        <div style={{ padding: '30px', maxWidth: '400px', margin: 'auto', fontFamily: 'sans-serif' }}>
            <div style={{ display: 'flex', marginBottom: '20px' }}>
                <input style={{ flex: 1 }} value={text} onChange={e => setText(e.target.value)} placeholder="Добавить..." />
                <button onClick={addItem}>+</button>
            </div>
            <ul style={{ padding: 0 }}>
                {items.map(item => (
                    <li key={item._id} style={{ display: 'flex', padding: '10px 0', borderBottom: '1px solid #eee' }}>
                        {editingId === item._id ? (
                            <input
                                autoFocus
                                value={editText}
                                onChange={e => setEditText(e.target.value)}
                                onBlur={() => saveEdit(item._id)}
                                onKeyDown={e => e.key === 'Enter' && saveEdit(item._id)}
                                style={{ flex: 1 }}
                            />
                        ) : (
                            <span
                                style={{ flex: 1, cursor: 'pointer', userSelect: 'none' }}
                                onDoubleClick={() => { setEditingId(item._id); setEditText(item.name); }}
                            >
                {item.name}
              </span>
                        )}
                        <button onClick={() => deleteItem(item._id)} style={{ marginLeft: '10px', cursor: 'pointer' }}>🗑️</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
