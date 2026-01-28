import { useEffect, useState } from 'react';

function App() {
  const [items, setItems] = useState([]);
  const [text, setText] = useState('');

  const fetchItems = () => {
    fetch('/api/items').then(res => res.json()).then(setItems);
  };

  useEffect(fetchItems, []);

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
        <button onClick={addItem}>Добавить в БД</button>
        <ul>
          {items.map(item => <li key={item._id}>{item.name}</li>)}
        </ul>
      </div>
  );
}
export default App;
