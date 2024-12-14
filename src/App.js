import React, { useEffect } from 'react';
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
import { Authenticator, withAuthenticator } from '@aws-amplify/ui-react';

import config from './amplifyconfiguration.json';

// Styles
import './App.css';
import '@aws-amplify/ui-react/styles.css';

// Configure Amplify
Amplify.configure(config);

function App({ user }) {
  useEffect(() => {
    if (user) {
      // Save loginId to sessionStorage after login
      sessionStorage.setItem('loginId', user.signInDetails.loginId);
    }
  }, [user]); // Only runs when the user object changes

  return (
    <Authenticator>
      <Router>
        <Navbar />
        {/* <h1>Logged in as {user?.signInDetails?.loginId}</h1> */}
        <Routes>
          <Route path="/" element={<Auctions />} /> {/* Auctions page */}
          <Route path="/auction-items/:auctionId" element={<AuctionItems />} /> {/* Auction Items page */}
          <Route path="/auction-item/:itemId" element={<AuctionItem />} /> {/* Auction Item detail page */}
          <Route path="/my-auctions" element={<MyAuctions />} /> {/* My Auctions page */}
          <Route path="/provider/add-auction" element={<ProductFormPage />} /> {/* Product form page */}
        </Routes>
      </Router>
    </Authenticator>
  );
}

export default withAuthenticator(App);
