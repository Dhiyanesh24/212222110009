import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Stats() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://20.244.56.144:8080/stats').then(res => {
      setData(res.data);
    });
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Stats</h2>
      {data.map((item, idx) => (
        <div key={idx} style={{ marginBottom: 20 }}>
          <strong>{item.shortcode}</strong> → {item.originalURL}
          <br />
          Created: {new Date(item.createdAt).toLocaleString()}
          <br />
          Expires: {new Date(item.expiresAt).toLocaleString()}
          <br />
          Clicks: {item.clicks}
        </div>
      ))}
    </div>
  );
}
