import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Stats from './pages/Stats';
import Redirector from './pages/Redirector';
import { setupMockBackend } from './mockBackend';

setupMockBackend();

export default function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/stats' element={<Stats />} />
      <Route path='/:shortcode' element={<Redirector />} />
    </Routes>
  );
}

