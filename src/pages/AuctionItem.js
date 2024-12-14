import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './AuctionItem.css'; // Ensure styles are applied

const AuctionItem = () => {
  const { itemId } = useParams(); // Get item-id from URL params
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bidders, setBidders] = useState([]); // State to store bidders

  // Function to format time in mm:ss format
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Fetch auction item details from the API
  const fetchAuctionItem = async () => {
    const url = `https://51br6s96b3.execute-api.ca-central-1.amazonaws.com/auctionsystem/auctions/items/item-details?item-id=${itemId}`;
    console.log('Fetching URL:', url);

    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log('API Response:', data);

      if (data.message === 'Items retrieved successfully') {
        const auctionItem = data.data[0];
        const endTimestamp = new Date(auctionItem['timestamp-listed']).getTime() + 5 * 60 * 1000; // Auction ends after 5 minutes
        setItem(auctionItem);

        // Set the initial time left
        setTimeLeft(Math.max(0, Math.floor((endTimestamp - Date.now()) / 1000)));

        // Initialize bidders array
        setBidders(auctionItem['bidders'] || []); // Handle empty or undefined bidders

        // Start countdown timer
        const timerInterval = setInterval(() => {
          const remainingTime = Math.max(0, Math.floor((endTimestamp - Date.now()) / 1000));
          setTimeLeft(remainingTime);

          if (remainingTime === 0) {
            clearInterval(timerInterval);
            setTimerActive(false); // Disable bidding after auction ends
          }
        }, 1000);

        setLoading(false);
      } else {
        setError('Failed to fetch auction item details');
      }
    } catch (err) {
      setError('Error fetching auction item');
      console.error('Error details:', err);
    }
  };

  useEffect(() => {
    fetchAuctionItem();
  }, [itemId]);

  // Function to handle bidding (disabled when the timer ends)
  const handleBid = async () => {
    if (!timerActive) return;

    const currentBid = item['current-bid'];
    let bidAmount = parseFloat(prompt(`Enter your bid amount (current bid: $${currentBid}):`));

    if (isNaN(bidAmount) || bidAmount <= currentBid) {
      alert(`Bid must be greater than the current highest bid of $${currentBid}`);
      return;
    }

    const bidderId = sessionStorage.getItem('loginId'); // Ensure loginId is stored in sessionStorage
    if (!bidderId) {
      alert('You must be logged in to place a bid.');
      return;
    }

    const bidData = {
      'item-id': itemId,
      bidders: [...bidders, { 'bidder-id': bidderId, 'bid-amount': bidAmount }],
      'current-bid': bidAmount,
    };

    try {
      const response = await fetch(
        `https://51br6s96b3.execute-api.ca-central-1.amazonaws.com/auctionsystem/auctions/items/item-details?itemId=${itemId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bidData),
        }
      );

      const result = await response.json();
      if (result.message === 'Bid placed successfully') {
        alert('Bid placed successfully!');
        fetchAuctionItem(); // Re-fetch updated leaderboard and item details
      } else {
        alert('Failed to place bid');
      }
    } catch (error) {
      console.error('Error placing bid:', error);
      alert('Error placing bid');
    }
  };

  // Sort bidders from highest to lowest bid amount
  const sortedBidders = [...bidders].sort((a, b) => b['bid-amount'] - a['bid-amount']);

  return (
    <div className="auction-item-container">
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <>
          <h1>{item['item-name']}</h1>
          <div className="auction-item-details">
            <div className="auction-item-image">
              <img src={item['img-url']} alt={item['item-name']} className="auction-item-img" />
            </div>
            <div className="auction-item-info">
              <h2>Description</h2>
              <p>{item.description}</p>
              <h3>Current Bid: ${item['current-bid']}</h3>
              <h3>Starting Bid: ${item['starting-bid']}</h3>
              <h4>Seller: {item['seller-id']}</h4>
              <h4>Time Remaining: {formatTime(timeLeft)}</h4>

              <button
                className={`bid-button ${!timerActive ? 'disabled' : ''}`}
                onClick={handleBid}
                disabled={!timerActive}
              >
                {timerActive ? 'Place Bid' : 'Auction Ended'}
              </button>
            </div>
          </div>

          <div className="leaderboard">
            <h3>Leaderboard (All Bids)</h3>
            <ul>
              {sortedBidders.map((bidder, index) => (
                <li key={index} className="leaderboard-item">
                  <span className="bidder-id">{bidder['bidder-id']}</span>
                  <span className="bid-amount">${bidder['bid-amount']}</span>
                </li>
              ))}
            </ul>
          </div>

          {timeLeft === 0 && (
            <div className="auction-winner">
              <h2>{`Auction Ended. Winner: ${item['winner'] || 'No bids placed'}`}</h2>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AuctionItem;
