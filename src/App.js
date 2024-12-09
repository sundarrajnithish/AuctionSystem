// Packages
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Components
import Navbar from './components/navbar.js';

// Pages
import Auctions from './pages/Auctions';
import AuctionItems from './pages/AuctionItems';
import AuctionItem from './pages/AuctionItem';
import MyAuctions from './pages/MyAuctions';
import ProductFormPage from './pages/ProductFormPage';


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
        <Route path="/my-auctions" element={<MyAuctions />} /> {/* My Auctions page */}
        <Route path="/provider/add-auction" element={<ProductFormPage />} /> {/* Product form page */}
        
      </Routes>
    </Router>
  );
}

export default App;
