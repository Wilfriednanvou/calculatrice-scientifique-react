import React from 'react';
import Calculatrice from './components/Calculatrice';
import './index.css';

function App() {
  return (
    <div className="app">
      <header>
        <h1>Calculatrice Avancée</h1>
        <p>Mode standard et scientifique avec historique et mémoire</p>
      </header>
      <main>
        <Calculatrice />
      </main>
      <footer>
        <p>© 2025 - Calculatrice Avancée en React.js</p>
      </footer>
    </div>
  );
}

export default App;