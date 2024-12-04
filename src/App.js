// Packages
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Components
import Navbar from './components/Navbar';

// Pages
import Auctions from './pages/Auctions';
import AuctionItems from './pages/AuctionItems';
import AuctionItem from './pages/AuctionItem';

// Styles
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Auctions />} /> {/* Auctions page */}
        <Route path="/auction-items/:auctionId" element={<AuctionItems />} /> {/* Auction Items page */}
        <Route path="/auction-item/:itemId" element={<AuctionItem />} /> {/* Auction Item detail page */}
      </Routes>
    </Router>
  );
}

export default App;
