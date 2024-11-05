import React from 'react';
import { Link } from 'react-router-dom';
import { Authenticator } from '@aws-amplify/ui-react';
import './NavBar.css';

const NavBar = () => {
  return (
    <Authenticator>
      {({ signOut }) => ( // Destructure the signOut function from Authenticator
        <nav className="navbar" style={{ backgroundColor: 'blue', color: 'white' }}>
          <div className="navbar-logo">
            <Link to="/">Roch's Auction</Link>
          </div>
          <ul className="navbar-links">
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/analytics">Analytics</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/about">About</Link></li>
            <li>
              <button onClick={signOut} style={{ backgroundColor: 'transparent', color: 'white', border: 'none', cursor: 'pointer' }}>
                Sign Out
              </button>
            </li>
          </ul>
        </nav>
      )}
    </Authenticator>
  );
};

export default NavBar;
