import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Authenticator } from '@aws-amplify/ui-react';

import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate(); // Hook to handle navigation

  // Toggle menu for mobile view
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle click on AuctionHub logo to navigate to home page
  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <Authenticator>
      {({ signOut }) => ( // Destructure the signOut function from Authenticator
    <nav className="navbar">
      <div className="navbar-left">
        <button className="menu-toggle" onClick={toggleMenu}>
          ☰
        </button>
      </div>

      <div className="navbar-logo" onClick={handleLogoClick}>
        <img 
          src="https://auctionhub-assets.s3.ca-central-1.amazonaws.com/Logo.png" 
          className="navbar-logo-image"
          alt="AuctionHub Logo"
          style={{ cursor: 'pointer', marginRight: '10px' }} 
        />
        <span style={{ cursor: 'pointer' }}>AuctionHub</span>
      </div>

      <div className="navbar-right">
        <ul className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
          <li><a href="/">Auctions</a></li>
          <li><a href="/my-auctions">My Auctions</a></li>
          <li>
              <button onClick={signOut} style={{ backgroundColor: 'transparent', color: 'white', border: 'none', cursor: 'pointer' }}>
                Sign Out
              </button>
            </li>
        </ul>
        
      </div>
    </nav>
    )}
    </Authenticator>
  );
};

export default Navbar;
