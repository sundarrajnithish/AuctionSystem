import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Components
import Navbar from './components/NavBar';

// Pages
import Auctions from './pages/Auctions';
import AuctionItems from './pages/AuctionItems';
import AuctionItem from './pages/AuctionItem';
import MyAuctions from './pages/MyAuctions';
import AuctionFormPage from './pages/AuctionFormPage';
import { Amplify } from 'aws-amplify';
import { Authenticator, withAuthenticator } from '@aws-amplify/ui-react';
import EditAuctionFormPage from './pages/EditAuctionFormPage';

import ItemFormPage from './pages/ItemFormPage';

import config from './amplifyconfiguration.json';

// Styles
import './App.css';
import '@aws-amplify/ui-react/styles.css';

// WebSocket Context
import { WebSocketProvider } from './components/WebSocketContext';

// Configure Amplify
Amplify.configure(config);

function App({ user }) {
  useEffect(() => {
    if (user) {
      // Save loginId to sessionStorage after login
      sessionStorage.setItem('loginId', user.signInDetails.loginId);
    }
  }, [user]);

  return (
    <Authenticator>
      <WebSocketProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Auctions />} /> {/* Auctions page */}
            <Route path="/auction-items/:auctionId" element={<AuctionItems />} /> {/* Auction Items page */}
            <Route path="/auction-item/:itemId" element={<AuctionItem />} /> {/* Auction Item detail page */}
            <Route path="/my-auctions" element={<MyAuctions />} /> {/* My Auctions page */}
            <Route path="/provider/add-auction" element={<AuctionFormPage />} /> {/* Product form page */}
            <Route path="/provider/edit-auction/:auctionId" element={<EditAuctionFormPage />} />
            <Route path="/list-item" element={<ItemFormPage />} /> {/* Product form page */}
          </Routes>
        </Router>
      </WebSocketProvider>
    </Authenticator>
  );
}

export default withAuthenticator(App);
