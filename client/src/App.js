import { useEffect, useState } from 'react';

function App() {
  const [msg, setMsg] = useState('');

  useEffect(() => {
    // На Vercel запрос пойдет на тот же домен в папку /api
    fetch('/api/message')
        .then(res => res.json())
        .then(data => setMsg(data.message));
  }, []);

  return <h1>{msg}</h1>;
}
export default App;
