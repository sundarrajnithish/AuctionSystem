import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Authenticator } from '@aws-amplify/ui-react';
import { useWebSocket } from '../components/WebSocketContext';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { messages } = useWebSocket();
  const [auctionData, setAuctionData] = useState(null);
  const [auctionStartTime, setAuctionStartTime] = useState(null);
  const [isAuctionFinalized, setIsAuctionFinalized] = useState(false);
  const [processedMessageIds, setProcessedMessageIds] = useState(new Set());
  const [notifications, setNotifications] = useState(() => {
    // Retrieve notifications from sessionStorage on initial load
    const savedNotifications = sessionStorage.getItem('notifications');
    return savedNotifications ? JSON.parse(savedNotifications) : [];
  });
  const navigate = useNavigate();
  const userEmail = sessionStorage.getItem('loginId');

  // Toggle menu for mobile view
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Handle click on AuctionHub logo to navigate to home page
  const handleLogoClick = () => navigate('/');

  // Toggle notification dropdown
  const toggleNotifications = () => setIsNotificationsOpen(!isNotificationsOpen);

  // Clear all notifications
  const clearNotifications = () => {
    setNotifications([]);
    sessionStorage.setItem('notifications', JSON.stringify([])); // Clear notifications in sessionStorage
  };

  // Function to add notification
  const addNotification = useCallback((text) => {
    const newNotifications = [...notifications, { text, id: `${Date.now()}-${Math.random()}` }];
    setNotifications(newNotifications);
    sessionStorage.setItem('notifications', JSON.stringify(newNotifications)); // Save to sessionStorage
  }, [notifications]);

  const [lastCheckTime, setLastCheckTime] = useState(Date.now());
  const [auctionTimers, setAuctionTimers] = useState({});

  useEffect(() => {
    const globalTimer = setInterval(() => {
      setLastCheckTime(Date.now());
    }, 60000); // Check every minute

    return () => clearInterval(globalTimer);
  }, []);

  useEffect(() => {
    messages.forEach(message => {
      const messageId = JSON.stringify({ 
        MessageId: message.MessageId, 
        timestamp: message.NewImage['timestamp-last-bid'] || new Date().toISOString()
      });

      if (!processedMessageIds.has(messageId)) {
        const { bidders, 'item-name': itemName, 'timestamp-listed': timestampListed, 'timestamp-last-bid': timestampLastBid, 'seller-id': sellerId } = message.NewImage;
        const auctionTimestamp = timestampListed || timestampLastBid; // Use 'timestamp-listed' or 'timestamp-last-bid'
        // console.log('Auction Timestamp:', auctionTimestamp);

        if (bidders && bidders.length > 0) {
          setAuctionData({ ...message.NewImage, bidders });
          setAuctionStartTime(auctionTimestamp);

          const highestBidder = bidders.reduce(
            (max, bidder) => (parseFloat(bidder['bid-amount']) > parseFloat(max['bid-amount']) ? bidder : max),
            { 'bid-amount': '0' }
          );

          // Bid notification for current highest bidder
          if (bidders.some(bidder => bidder['bidder-id'] === userEmail)) {
            addNotification(`The current highest bidder on ${itemName} is bidding: $${highestBidder['bid-amount']} by ${highestBidder['bidder-id']}.`);
          }

          // Timer logic for auction completion
          const timer = setTimeout(() => {
            const now = new Date();
            const timeDifferenceInSeconds = (now - new Date(auctionTimestamp)) / 1000; // Convert to seconds
            // console.log('Time difference in seconds:', timeDifferenceInSeconds);
            
            // Use switch-case for different auction scenarios
            switch (true) {
              case timeDifferenceInSeconds >= 300: // 5 minutes in seconds
                if (highestBidder['bidder-id'] === userEmail) {
                  addNotification(`Congratulations! You have won the auction for ${itemName} with a bid of $${highestBidder['bid-amount']}.`);
                } else if (bidders.some(bidder => bidder['bidder-id'] !== userEmail)) {
                  addNotification(`The auction for ${itemName} has ended. The winning bid was $${highestBidder['bid-amount']} by ${highestBidder['bidder-id']}.`);
                }

                if (userEmail === sellerId) {
                  addNotification(`Your item "${itemName}" has been sold to ${highestBidder['bidder-id']} for $${highestBidder['bid-amount']}.`);
                }

                setAuctionTimers(prev => ({ ...prev, [message.MessageId]: null }));
                break;
              default:
                // console.log('Auction is still ongoing, no actions triggered.');
                break;
            }
          }, Math.max(0, 300000 - (Date.now() - new Date(auctionTimestamp).getTime()))); // Wait exactly 5 minutes from auction timestamp

          setAuctionTimers(prev => ({ ...prev, [message.MessageId]: timer }));
        }
        
        setProcessedMessageIds(prev => new Set(prev).add(messageId)); // Mark message as processed
      }
    });
  }, [messages, lastCheckTime, processedMessageIds, addNotification, userEmail, auctionTimers]);

  useEffect(() => {
    return () => {
      Object.values(auctionTimers).forEach(timer => clearTimeout(timer)); // Clean up all timers
    };
  }, []);

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

          <div className="notification-box">
            <button onClick={toggleNotifications} className="notification-icon">
              <i className="fas fa-bell"></i>
              {notifications.length > 0 && (
                <span className="notification-badge">{notifications.length}</span>
              )}
            </button>

            {isNotificationsOpen && (
              <div className="notification-tile">
                <ul>
                  {notifications.map(notification => (
                    <li key={notification.id} className="notification-item">
                      {notification.text}
                    </li>
                  ))}
                  {notifications.length === 0 && <li className="notification-item">No notifications available</li>}
                </ul>
                <button className="clear-notifications" onClick={clearNotifications}>
                  Clear All
                </button>
              </div>
            )}
          </div>
        </nav>
      )}
    </Authenticator>
  );
};

export default Navbar;
