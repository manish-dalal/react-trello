import React from 'react';
// Components
import Board from './components/Board';
import Header from './components/Header';
import Footer from './components/Footer';
// Stylesheets
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <Board />
      <Footer />
    </div>
  );
}

export default App;
