import React, { useState } from 'react';
import './AuctionFormPage.css';

const AuctionFormPage = () => {
  // State for form fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [titleImage, setTitleImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Handle title image changes
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => setTitleImage(reader.result.split(',')[1]); // Set base64 encoded string
    reader.readAsDataURL(file); // Convert file to base64
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!name) newErrors.name = 'Auction name is required';
    if (!description) newErrors.description = 'Description is required';
    if (!titleImage) newErrors.titleImage = 'Auction image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);

      // Get user-id from sessionStorage
      const userId = sessionStorage.getItem('loginId'); // Assuming loginId is the user ID

      // Check if userId exists
      if (!userId) {
        alert('User not logged in');
        setLoading(false);
        return;
      }

      // Correct the payload structure
      const auctionData = {
        "auction-name": name,
        "description": description,
        "titleImage": titleImage,  // Sending the base64 image data
        "user-id": userId // Sending the user-id
      };

      try {
        const response = await fetch('https://51br6s96b3.execute-api.ca-central-1.amazonaws.com/auctionsystem/auctions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(auctionData) // Send correctly formatted auction data
        });

        if (response.ok) {
          alert('Auction created successfully!');
          setName('');
          setDescription('');
          setTitleImage(null);
        } else {
          alert('Failed to save auction');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while saving the auction.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="auction-form-page">
      <h1>Create New Auction</h1>
      <form onSubmit={handleSubmit}>
        {/* Auction Name */}
        <div>
          <label htmlFor="name">Auction Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <p className="error">{errors.name}</p>}
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

        {/* Title Image */}
        <div className="image-preview">
          <label htmlFor="title-image">Upload Auction Image</label>
          <input
            type="file"
            id="title-image"
            accept="image/*"
            onChange={handleImageChange}
          />
          {titleImage && <img src={`data:image/jpeg;base64,${titleImage}`} alt="Preview" />}
          {errors.titleImage && <p className="error">{errors.titleImage}</p>}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Creating Auction...' : 'Add Auction'}
        </button>
      </form>
    </div>
  );
};

export default AuctionFormPage;
