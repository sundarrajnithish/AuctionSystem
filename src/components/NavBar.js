import React from 'react';
import { Link } from 'react-router-dom';
//import { Authenticator } from '@aws-amplify/ui-react';
import './NavBar.css';

const NavBar = () => {
  return (
    //<Authenticator>
      //{({ signOut }) => ( // Destructure the signOut function from Authenticator
        <nav className="navbar" style={{ backgroundColor: 'blue', color: 'white' }}>
          <div className="navbar-logo">
            <Link to="/">Modern Auction</Link>
          </div>
          <ul className="navbar-links">
            <li><Link to="/home">Auction Home</Link></li>
            <li><Link to="/services">Books</Link></li>
            <li><Link to="/analytics">Cars</Link></li>
            <li><Link to="/dashboard">Luxuries</Link></li>
            <li><Link to="/about">Historical</Link></li>
            <li><Link to="/RegisterAuction">Register Auction</Link></li>
          </ul>
        </nav>
      //)}
    //</Authenticator>
  );
};

// Removed Singout Button
//<li>
// <button onClick={signOut} style={{ backgroundColor: 'transparent', color: 'white', border: 'none', cursor: 'pointer' }}>
// Sign Out
// </button>
// </li>

export default NavBar;
