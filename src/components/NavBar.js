import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Navbar.css';

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
    <nav className="navbar">
      <div className="navbar-logo">
        <span onClick={handleLogoClick} style={{ cursor: 'pointer' }}>AuctionHub</span> {/* Clickable logo */}
      </div>
      <button className="menu-toggle" onClick={toggleMenu}>
        ☰
      </button>
      <ul className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
        <li><a href="/">Auctions</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
