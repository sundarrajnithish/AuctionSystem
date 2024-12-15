import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Authenticator } from '@aws-amplify/ui-react';
import { useWebSocket } from './WebSocketContext'; // Assuming you have WebSocket context
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false); // For opening/closing notification dropdown
  const { messages } = useWebSocket(); // Access WebSocket messages from context
  const [notificationCount, setNotificationCount] = useState(0); // Store the count of new notifications
  const navigate = useNavigate(); // Hook to handle navigation

  // Toggle menu for mobile view
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle click on AuctionHub logo to navigate to home page
  const handleLogoClick = () => {
    navigate('/');
  };

  // Toggle notification dropdown
  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  // Update notification count when new messages are received
  useEffect(() => {
    setNotificationCount(messages.length);
  }, [messages]); // This will trigger every time `messages` array changes

  console.log('Messages:', messages);

  return (
    <Authenticator>
      {({ signOut }) => (
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
              <li><a href="/">Live Auctions</a></li>
              <li><a href="/my-auctions">My Auctions</a></li>
              <li>
                <button
                  onClick={signOut}
                  style={{
                    backgroundColor: 'transparent',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Sign Out
                </button>
              </li>
            </ul>
          </div>

          {/* Notification Bell and Tile */}
          <div className="notification-box">
            <button onClick={toggleNotifications} className="notification-icon">
            <i className="fas fa-inbox" style={{ fontSize: '20px', color: 'white' }}></i>
              {notificationCount > 0 && (
                <span className="notification-badge">{notificationCount}</span>
              )}
            </button>

            {isNotificationsOpen && (
              <div className="notification-tile">
                <ul>
                  {messages.map((message, index) => (
                    <li key={index} className="notification-item">
                      <p>{message.Event}: {message.NewImage?.item}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </nav>
      )}
    </Authenticator>
  );
};

export default Navbar;
