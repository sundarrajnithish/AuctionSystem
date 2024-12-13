// Packages
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Components
import Navbar from './components/NavBar';

// Pages
import Auctions from './pages/Auctions';
import AuctionItems from './pages/AuctionItems';
import AuctionItem from './pages/AuctionItem';
import MyAuctions from './pages/MyAuctions';
import ProductFormPage from './pages/ProductFormPage';
import {Amplify} from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import awsconfig from './aws-exports';
import { AuthProvider } from './components/AuthContext'; // Import AuthProvider



// Styles
import './App.css';
import '@aws-amplify/ui-react/styles.css';

// Configure Amplify
Amplify.configure(awsconfig);


function App() {
  return (
    <Authenticator>
      <AuthProvider>
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
    </AuthProvider>
    </Authenticator>
  );
}

export default App;
