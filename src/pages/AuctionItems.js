import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './AuctionItems.css'; // Ensure styles are applied

const AuctionItems = () => {
  const { auctionId } = useParams(); // Get auction-id from URL params
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch auction items for the specific auction-id
  useEffect(() => {
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

    fetchAuctionItems();
  }, [auctionId]); // Refetch if auctionId changes

  const handleItemClick = (itemId) => {
    navigate(`/auction-item/${itemId}`); // Navigate to item detail page
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const AuctionName = sessionStorage.getItem('categoryTitle');

  return (
    <div className="auction-items-container">
      <h1>ITEMS LISTED IN {AuctionName}</h1>
      <div className="item-grid">
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
            <p className="item-seller">
                Seller: {item.sellerId}
            </p>
            <p className="item-last-bid">
                Last Bid: {item.timestampLastBid !== "none" ? item.timestampLastBid : "No bids yet"}
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
