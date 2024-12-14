import React, { useState } from 'react';
import './ItemFormPage.css';

const ItemFormPage = () => {
  // State for form fields
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [startingBid, setStartingBid] = useState('');
  const [currentBid, setCurrentBid] = useState('');
  const [itemImage, setItemImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Handle image changes
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => setItemImage(reader.result.split(',')[1]); // Set base64 encoded string
    reader.readAsDataURL(file); // Convert file to base64
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!itemName) newErrors.itemName = 'Item name is required';
    if (!description) newErrors.description = 'Description is required';
    if (!startingBid || isNaN(startingBid)) newErrors.startingBid = 'Starting bid is required and must be a number';
    if (!currentBid || isNaN(currentBid)) newErrors.currentBid = 'Current bid is required and must be a number';
    if (!itemImage) newErrors.itemImage = 'Item image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
  
      // Get auction-id and user-id from sessionStorage
      const auctionId = sessionStorage.getItem('auctionId'); // Assuming auctionId is stored
      const userId = sessionStorage.getItem('loginId'); // Assuming loginId is the user ID
  
      // Check if auctionId and userId exist
      if (!auctionId || !userId) {
        alert('Auction or User not found');
        setLoading(false);
        return;
      }
  
      // Correct the payload structure
      const itemData = {
        "item-name": itemName,
        "description": description,
        "starting-bid": startingBid,
        "current-bid": currentBid,
        "img-url": itemImage,  // Sending the base64 image data
        "auction-id": auctionId,
        "seller-id": userId,
        "bidder-id": '', // Initially no bidder
        "timestamp-listed": new Date().toISOString(),
        "timestamp-last-bid": "none"
      };
  
      try {
        const response = await fetch('https://51br6s96b3.execute-api.ca-central-1.amazonaws.com/auctionsystem/auctions/items/item-details', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(itemData) // Send correctly formatted item data
        });
  
        if (response.ok) {
          alert('Item listed successfully!');
          setItemName('');
          setDescription('');
          setStartingBid('');
          setCurrentBid('');
          setItemImage(null);
          window.history.back();
        } else {
          alert('Failed to list item');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while listing the item.');
      } finally {
        setLoading(false);
      }
    }
  };
  

  return (
    <div className="item-form-page">
      <h1>List New Item</h1>
      <form onSubmit={handleSubmit}>
        {/* Item Name */}
        <div>
          <label htmlFor="item-name">Item Name</label>
          <input
            type="text"
            id="item-name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          {errors.itemName && <p className="error">{errors.itemName}</p>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            rows="5"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {errors.description && <p className="error">{errors.description}</p>}
        </div>

        {/* Starting Bid */}
        <div>
          <label htmlFor="starting-bid">Starting Bid</label>
          <input
            type="number"
            id="starting-bid"
            value={startingBid}
            onChange={(e) => setStartingBid(e.target.value)}
          />
          {errors.startingBid && <p className="error">{errors.startingBid}</p>}
        </div>

        {/* Current Bid */}
        <div>
          <label htmlFor="current-bid">Current Bid</label>
          <input
            type="number"
            id="current-bid"
            value={currentBid}
            onChange={(e) => setCurrentBid(e.target.value)}
          />
          {errors.currentBid && <p className="error">{errors.currentBid}</p>}
        </div>

        {/* Item Image */}
        <div className="image-preview">
          <label htmlFor="item-image">Upload Item Image</label>
          <input
            type="file"
            id="item-image"
            accept="image/*"
            onChange={handleImageChange}
          />
          {itemImage && <img src={`data:image/jpeg;base64,${itemImage}`} alt="Preview" />}
          {errors.itemImage && <p className="error">{errors.itemImage}</p>}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Listing Item...' : 'List Item'}
        </button>
      </form>
    </div>
  );
};

export default ItemFormPage;
