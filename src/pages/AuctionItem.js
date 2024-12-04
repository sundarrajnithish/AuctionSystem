import React, { useState, useEffect } from 'react';
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

  // Fetch auction item details from the API
  useEffect(() => {
    const fetchAuctionItem = async () => {
      const url = `https://51br6s96b3.execute-api.ca-central-1.amazonaws.com/auctionsystem/auctions/items/item-details?item-id=${itemId}`;
      console.log('Fetching URL:', url);  // Log the URL to check its correctness

      try {
        const response = await fetch(url);
        const data = await response.json();
        console.log('API Response:', data);  // Log API response to check what data is returned
        
        if (data.message === "Items retrieved successfully") {
          const auctionItem = data.data[0]; // Get the item from the response
          const endTimestamp = new Date(auctionItem['timestamp-listed']).getTime() + 5 * 60 * 1000; // Auction ends after 5 minutes
          setItem(auctionItem);

          // Set the initial time left
          setTimeLeft(Math.max(0, Math.floor((endTimestamp - Date.now()) / 1000)));

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
        console.error('Error details:', err);  // Log the error
      }
    };

    fetchAuctionItem();
  }, [itemId]);

  // Function to handle bidding (disabled when the timer ends)
  const handleBid = () => {
    if (!timerActive) return;
    alert('Bid placed successfully!');
    // Optionally, trigger API to update bid here
  };

  // Format time as HH:MM:SS
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  // Render loading, error, or auction item details
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="auction-item-container">
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
    </div>
  );
};

export default AuctionItem;
