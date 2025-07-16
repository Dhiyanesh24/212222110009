import React, { useState } from 'react';
import axios from 'axios';
import { log } from '../utils/logger';

export default function Home() {
  const [inputs, setInputs] = useState([{ url: '', shortcode: '', validity: '' }]);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const handleChange = (index, field, value) => {
    const updatedInputs = [...inputs];
    updatedInputs[index][field] = value;
    setInputs(updatedInputs);
  };

  const addRow = () => {
    if (inputs.length < 5) {
      setInputs([...inputs, { url: '', shortcode: '', validity: '' }]);
    }
  };

  const validateURL = url => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async () => {
    setError('');
    const links = [];

    for (const input of inputs) {
      if (!validateURL(input.url)) {
        setError(`Invalid URL: ${input.url}`);
        return;
      }
      const validity = input.validity ? parseInt(input.validity) : 30;
      if (isNaN(validity)) {
        setError(`Invalid validity: ${input.validity}`);
        return;
      }

      links.push({
        url: input.url,
        shortcode: input.shortcode || undefined,
        validity,
      });
    }

    try {
      const res = await axios.post('http://20.244.56.144:8080/shorten', { links });
      console.log('RESULTS:', res.data);
      setResults(res.data);
      log('frontend', 'info', 'page', 'Shortened URLs successfully');
    } catch (err) {
      console.error('Shorten API Error:', err);
      log('frontend', 'error', 'page', 'Shortening failed');
      setError('Something went wrong.');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>URL Shortener</h2>
      {inputs.map((input, idx) => (
        <div key={idx} style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Original URL"
            value={input.url}
            onChange={(e) => handleChange(idx, 'url', e.target.value)}
            style={{ marginRight: '10px' }}
          />
          <input
            type="text"
            placeholder="Shortcode (optional)"
            value={input.shortcode}
            onChange={(e) => handleChange(idx, 'shortcode', e.target.value)}
            style={{ marginRight: '10px' }}
          />
          <input
            type="number"
            placeholder="Validity in minutes"
            value={input.validity}
            onChange={(e) => handleChange(idx, 'validity', e.target.value)}
          />
        </div>
      ))}
      <button onClick={addRow}>➕ Add Row</button>
      <button onClick={handleSubmit} style={{ marginLeft: '10px' }}>
        🚀 Shorten
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {results.map((res, idx) => (
          <li key={idx}>
            {res.error ? (
              <span style={{ color: 'red' }}>{res.error}</span>
            ) : (
              <>
                <strong>{res.shortcode}</strong> ➜{' '}
                <a
                  href={`http://localhost:3000/${res.shortcode}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {`http://localhost:3000/${res.shortcode}`}
                </a>{' '}
                (Expires: {new Date(res.expiresAt).toLocaleString()})
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
