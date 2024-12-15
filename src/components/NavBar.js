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
  const userEmail = sessionStorage.getItem('loginId'); // Get the logged-in user email

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
    handleNotifications(messages);
  }, [messages]);

  // Function to handle notification logic based on auction items and auctions table
  const handleNotifications = (messages) => {
    messages.forEach((message) => {
      if (message.Event === 'MODIFY') {
        if (message.SourceTable === 'auctions') {
          // Check if the user is registered for the auction
          const registeredUsers = message.NewImage['registered-users']?.L;
          if (registeredUsers && registeredUsers.some(user => user.S === userEmail)) {
            notifyUser(`You are registered for the auction: ${message.NewImage['auction-name'].S}`);
          }
        } else if (message.SourceTable === 'auction-items') {
          // Watch for changes in the bidders array
          const bidders = message.NewImage['bidders']?.L;
          const currentBid = message.NewImage['current-bid']?.N;
          const itemName = message.NewImage['item-name']?.S;
          const timestampListed = new Date(message.NewImage['timestamp-listed']?.S).getTime();
          const winnerEmail = message.NewImage['winner']?.S;
  
          if (bidders) {
            bidders.forEach((bidder) => {
              const bidderEmail = bidder.M['bidder-id']?.S;
              const bidAmount = bidder.M['bid-amount']?.N;
  
              if (bidderEmail === userEmail) {
                // Notify about successful bid
                notifyUser(`Your bid of $${bidAmount} is successful. Current bid: $${currentBid}`);
              }
  
              // Notify about any new bids (additional bidders)
              notifyUser(`${bidderEmail} has bid $${bidAmount}. Current bid: $${currentBid}`);
            });
          }
  
          // Winning notification if the user is the winner and auction has ended (5 mins from timestamp-listed)
          if (winnerEmail === userEmail && Date.now() - timestampListed > 5 * 60 * 1000) {
            notifyUser(`You have won the auction: ${itemName}`);
          }
        }
      }
    });
  };
  

  // Function to send a notification to the user
  const notifyUser = (message) => {
    // Push notification logic or set state to show the notification
    alert(message); // Simple alert for demonstration
  };

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
              <i className="fas fa-bell"></i>
              {notificationCount > 0 && (
                <span className="notification-badge">{notificationCount}</span>
              )}
            </button>

            {isNotificationsOpen && (
              <div className="notification-tile">
                <ul>
                  {messages.map((message, index) => (
                    <li key={index} className="notification-item">
                      {/* Display detailed notifications */}
                      {message.Event === 'MODIFY' && message.SourceTable === 'auctions' && (
                        <p>{message.NewImage['auction-name'].S} - You are registered for this auction!</p>
                      )}
                      {message.Event === 'MODIFY' && message.SourceTable === 'auction-items' && (
                        <p>{message.NewImage['item-name'].S} - Bid placed! Current bid: ${message.NewImage['current-bid'].N}</p>
                      )}
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
