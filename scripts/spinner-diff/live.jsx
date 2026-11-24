// Live check of Spinner in a real page: ?reduced stubs prefers-reduced-motion.
// The pane this was checked in doesn't tick requestAnimationFrame while hidden: use timers.
window.requestAnimationFrame = (cb) => setTimeout(() => cb(performance.now()), 16);
window.cancelAnimationFrame = (id) => clearTimeout(id);
// ?reduced stubs prefers-reduced-motion: reduce (and lets window.__setReduced(bool) flip it live).
const listeners = new Set();
let reduced = new URLSearchParams(location.search).has('reduced');
const real = window.matchMedia.bind(window);
window.matchMedia = (q) => (q.includes('reduced-motion') ? {
  get matches() { return reduced; },
  addEventListener: (_, f) => listeners.add(f),
  removeEventListener: (_, f) => listeners.delete(f),
} : real(q));
window.__setReduced = (v) => { reduced = v; listeners.forEach((f) => f()); };
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Spinner } from '../../src/Spinner/Spinner.jsx';
createRoot(document.getElementById('root')).render(
  <div style={{ background: '#f5f5f5', padding: 20 }}><Spinner id="n" /><Spinner id="l" size="large" styleType="dark" /></div>,
);
