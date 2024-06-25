import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Supondo que você tenha um arquivo CSS para estilos globais

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
