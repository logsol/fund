import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Assuming you have a div with id 'root' in your HTML
const container = document.getElementById('root');

// Create a root
const root = ReactDOM.createRoot(container as HTMLElement);

// Render your app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
