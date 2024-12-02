// Packages
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Components
import Navbar from './components/Navbar';


// Styles
import './App.css';


function App() {
  return (
    <Router>
        <Navbar />
    </Router>
  );
}

export default App;
