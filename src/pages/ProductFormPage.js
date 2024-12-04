import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductFormPage.css';

const ProductFormPage = () => {
  const navigate = useNavigate();
  
  // State for form fields
  const [auctionName, setAuctionName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [startingBid, setStartingBid] = useState('');
  const [status, setStatus] = useState('active');
  const [userId, setUserId] = useState('user-002');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // Loading state

  // Image upload handler
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      // Adjust your S3 bucket API endpoint here
      const s3UploadUrl = 'https://your-s3-upload-endpoint'; 

      try {
        const response = await fetch(s3UploadUrl, {
          method: 'POST',
          body: formData,
        });
        if (response.ok) {
          const data = await response.json();
          setImageUrl(data.imageUrl); // Assume response contains the image URL
        } else {
          console.error('Failed to upload image');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!auctionName) newErrors.auctionName = 'Auction name is required';
    if (!startingBid || isNaN(startingBid)) newErrors.startingBid = 'Valid starting bid is required';
    if (!imageUrl) newErrors.imageUrl = 'Image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true); // Show loading
      const auctionData = {
        auctionName: auctionName,
        imgUrl: imageUrl,
        startingBid: startingBid,
        status: status,
        userId: userId,
        timestampCreated: new Date().toISOString(), // Automatic timestamp
      };

      try {
        const response = await fetch('https://51br6s96b3.execute-api.ca-central-1.amazonaws.com/auctionsystem/auctions/user-id', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(auctionData), // Send as JSON
        });

        const result = await response.json();
        if (response.ok) {
          alert('Auction added successfully!');
          navigate('/myauctions'); // Redirect after successful submission
        } else {
          alert('Failed to save auction');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while saving the auction.');
      } finally {
        setLoading(false); // Hide loading
      }
    }
  };

  return (
    <div className="product-form-page">
      <h1>Add New Auction</h1>
      <form onSubmit={handleSubmit}>
        {/* Auction Name */}
        <div>
          <label htmlFor="auctionName">Auction Name</label>
          <input
            type="text"
            id="auctionName"
            value={auctionName}
            onChange={(e) => setAuctionName(e.target.value)}
          />
          {errors.auctionName && <p className="error">{errors.auctionName}</p>}
        </div>

        {/* Image Upload */}
        <div>
          <label htmlFor="imageUrl">Image</label>
          <input
            type="file"
            id="imageUrl"
            accept="image/*"
            onChange={handleImageUpload}
          />
          {errors.imageUrl && <p className="error">{errors.imageUrl}</p>}
        </div>

        {/* Starting Bid */}
        <div>
          <label htmlFor="startingBid">Starting Bid</label>
          <input
            type="number"
            id="startingBid"
            value={startingBid}
            onChange={(e) => setStartingBid(e.target.value)}
            placeholder="Enter starting bid"
          />
          {errors.startingBid && <p className="error">{errors.startingBid}</p>}
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Add Auction'}
        </button>
      </form>
    </div>
  );
};

export default ProductFormPage;
