import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './AuctionItems.css'; // Ensure styles are applied

const AuctionItems = () => {
  const { auctionId } = useParams(); // Get auction-id from URL params
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Store the auctionId in sessionStorage
  useEffect(() => {
    if (auctionId) {
      sessionStorage.setItem('auctionId', auctionId); // Store auctionId in sessionStorage
    }
  }, [auctionId]);

  // Fetch auction items for the specific auction-id
  const fetchAuctionItems = async () => {
    try {
      const response = await fetch(`https://51br6s96b3.execute-api.ca-central-1.amazonaws.com/auctionsystem/auctions/items?auction-id=${auctionId}`);
      const data = await response.json();

      if (data.message === "Items retrieved successfully") {
        const fetchedItems = data.data.map(item => ({
          id: item['item-id'],
          itemName: item['item-name'],
          description: item.description,
          imgUrl: item['img-url'],
          currentBid: item['current-bid'],
          startingBid: item['starting-bid'],
          sellerId: item['seller-id'],
          bidderId: item['bidder-id'],
          timestampListed: item['timestamp-listed'],
          timestampLastBid: item['timestamp-last-bid'],
          winner: item['winner'],
        }));

        setItems(fetchedItems); // Update state with fetched items
      } else {
        setError('No items found for this auction.');
      }
    } catch (err) {
      setError('Failed to fetch auction items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctionItems();
  }, [auctionId]); // Refetch if auctionId changes

  const handleItemClick = (itemId) => {
    navigate(`/auction-item/${itemId}`); // Navigate to item detail page
  };

  const handleListItems = () => {
    setLoading(true); // Trigger loading state when button is clicked
    setItems([]); // Clear existing items if any
    fetchAuctionItems(); // Re-fetch the auction items
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const AuctionName = sessionStorage.getItem('categoryTitle'); // Get the auction category name

  return (
    <div className="auction-items-container">
      <button onClick={handleListItems} className="list-items-btn">
        List Auction Items
      </button>
      <h1>ITEMS LISTED IN {AuctionName}</h1>

      {/* List Your Items Tile */}
      

      <div className="item-grid">
        <div
        className="item-tile list-your-items-tile"
        onClick={() => navigate('/list-item')} // Redirect to listing page
      >
        <div className="item-content">
          <h2 className="item-title">List Your Items</h2>
          <h2 className="item-description">Click here to list your items in this auction.</h2>
        </div>
      </div>
        {items.map(item => (
          <div
            key={item.id} // Use item.id as the key
            className="item-tile"
            onClick={() => handleItemClick(item.id)} // Navigate to item detail
          >
            <img src={item.imgUrl} alt={item.itemName} className="item-img" />
            <div className="item-content">
              <h2 className="item-title">{item.itemName}</h2>
              <p className="item-description">{item.description}</p>
              <p className="item-bid">
                Current Bid: ${item.currentBid} (Starting: ${item.startingBid})
              </p>
              <p className="item-bid">
                 {item.winner ? `Won by ${item.winner}` : "Active"}
              </p>
              <p className="item-seller">
                Seller: {item.sellerId}
              </p>
              <p className="item-listed">
                Listed: {new Date(item.timestampListed).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuctionItems;
