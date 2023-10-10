import { useEffect, useState } from 'react';
import './App.css';

// `https://api.frankfurter.app/latest?amount=100&from=EUR&to=USD`

function App() {
  const [value, setValue] = useState(0);
  const [convert, setConvert] = useState(0);
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('EUR');
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setError('');
        setConvert(0);
        const res = await fetch(
          `https://api.frankfurter.app/latest?amount=${Number(
            value
          )}&from=${from}&to=${to}`,
          { signal: controller.signal }
        );
        if (!res.ok) {
          throw new Error('Something went wrong!');
        }
        const data = await res.json();
        setConvert(data.rates[to]);
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message);
      }
    };
    fetchData();
    return () => {
      controller.abort();
    };
  }, [value, from, to]);
  return (
    <div className="App">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <select
        value={from}
        onChange={(e) => {
          if (e.target.value === to) {
            const tempFrom = e.target.value;
            setTo(from);
            setFrom(tempFrom);
          } else {
            setFrom(e.target.value);
          }
        }}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      <select
        value={to}
        onChange={(e) => {
          if (e.target.value === from) {
            const tempTo = e.target.value;
            setFrom(to);
            setTo(tempTo);
          } else {
            setTo(e.target.value);
          }
        }}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      <p>{value ? `${convert} ${to}` : 'OUTPUT'}</p>
    </div>
  );
}

export default App;
