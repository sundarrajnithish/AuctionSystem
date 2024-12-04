import React, { useState } from 'react';
import './styles/Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <span>AuctionHub</span>
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