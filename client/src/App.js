import { useEffect, useState } from 'react';

function App() {
    const [items, setItems] = useState([]);
    const [text, setText] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState('');

    const fetchItems = () => {
        fetch('/api/items').then(res => res.json()).then(setItems);
    };

    useEffect(fetchItems, []);

    // --- УДАЛЕНИЕ (ОПТИМИСТИЧНОЕ) ---
    const deleteItem = async (id) => {
        const previousItems = [...items]; // Сохраняем стейт на случай ошибки
        setItems(items.filter(item => item._id !== id)); // Удаляем мгновенно

        try {
            const res = await fetch(`/api/items/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error();
        } catch (err) {
            setItems(previousItems); // Возвращаем назад при ошибке
            alert("Не удалось удалить на сервере");
        }
    };

    // --- РЕДАКТИРОВАНИЕ (ОПТИМИСТИЧНОЕ) ---
    const saveEdit = async (id) => {
        if (!editingId) return;

        const previousItems = [...items];
        const oldName = items.find(i => i._id === id).name;

        // Если текст не изменился, просто выходим
        if (editText === oldName) {
            setEditingId(null);
            return;
        }

        // Обновляем мгновенно в UI
        setItems(items.map(item => item._id === id ? { ...item, name: editText } : item));
        setEditingId(null);

        try {
            const res = await fetch(`/api/items/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: editText })
            });
            if (!res.ok) throw new Error();
        } catch (err) {
            setItems(previousItems); // Откат при ошибке
            alert("Ошибка сохранения");
        }
    };

    const addItem = async () => {
        if (!text.trim()) return;
        // Для добавления лучше дождаться ID от сервера, чтобы потом можно было удалить/править
        const res = await fetch('/api/items', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: text })
        });
        setText('');
        fetchItems();
    };

    return (
        <div style={{ padding: '40px', maxWidth: '400px', margin: '0 auto' }}>
            <div style={{ marginBottom: '20px' }}>
                <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Новая задача..." />
                <button onClick={addItem}>+</button>
            </div>

            <ul style={{ listStyle: 'none', padding: 0 }}>
                {items.map(item => (
                    <li key={item._id} style={{ display: 'flex', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                        {editingId === item._id ? (
                            <input
                                autoFocus
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                onBlur={() => saveEdit(item._id)} // Сохранение при клике вне поля
                                onKeyDown={(e) => e.key === 'Enter' && saveEdit(item._id)} // Сохранение по Enter
                                style={{ flex: 1 }}
                            />
                        ) : (
                            <span
                                style={{ flex: 1, cursor: 'pointer' }}
                                onDoubleClick={() => { // РЕДАКТИРОВАНИЕ ПО ДВОЙНОМУ КЛИКУ
                                    setEditingId(item._id);
                                    setEditText(item.name);
                                }}
                            >
                {item.name}
              </span>
                        )}
                        <button onClick={() => deleteItem(item._id)} style={{ marginLeft: '10px' }}>🗑️</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
