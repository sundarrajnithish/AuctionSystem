import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './AuctionFormPage.css';

const EditAuctionFormPage = () => {
  const { auctionId } = useParams(); // Retrieve auctionId from the route parameters
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [titleImage, setTitleImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch auction details
  useEffect(() => {
    const fetchAuctionDetails = async () => {
      if (!auctionId) return; // Handle case when auctionId is undefined
      setLoading(true);
      try {
        const response = await fetch(
          `https://51br6s96b3.execute-api.ca-central-1.amazonaws.com/auctionsystem/auctions/edit?auctionId=${auctionId}`
        );
  
        if (response.ok) {
          const data = await response.json();
          const auction = data; // No need to parse body, it's already parsed
          setName(auction["auction-name"]);
          setDescription(auction.description || '');  // Use empty string if description is missing
  
          // Clean out everything before the URL if necessary
          let imageUrl = auction["img-url"];
          
          // If the image URL contains a base64 prefix, clean it out
          if (imageUrl && imageUrl.startsWith('data:image/jpeg;base64,')) {
            imageUrl = imageUrl.replace('data:image/jpeg;base64,', ''); // Remove base64 prefix
          }
  
          // Set the cleaned URL for the image
          setTitleImage(imageUrl); // Store the URL as is
        } else {
          alert('Failed to fetch auction details.');
        }
      } catch (error) {
        console.error('Error fetching auction details:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchAuctionDetails();
  }, [auctionId]); // Fetch details whenever auctionId changes

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
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission for updating auction
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);

      // Get user-id from sessionStorage
      const userId = sessionStorage.getItem('loginId');
      if (!userId) {
        alert('User not logged in');
        setLoading(false);
        return;
      }

      const updatedAuctionData = {
        "auction-name": name,
        description: description,
        titleImage: titleImage, // Send cleaned URL or base64 string as needed
        "user-id": userId,
      };

      try {
        const response = await fetch(
          `https://51br6s96b3.execute-api.ca-central-1.amazonaws.com/auctionsystem/auctions/edit?auctionId=${auctionId}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedAuctionData),
          }
        );

        if (response.ok) {
          alert('Auction updated successfully!');
        } else {
          alert('Failed to update auction.');
        }
      } catch (error) {
        console.error('Error updating auction:', error);
        alert('An error occurred while updating the auction.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="auction-form-page">
      <h1>Edit Auction</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
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
            {titleImage && !titleImage.startsWith('data:image/jpeg;base64,') && (
              <img src={titleImage} alt="Preview" />
            )}
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Updating Auction...' : 'Update Auction'}
          </button>
        </form>
      )}
    </div>
  );
};

export default EditAuctionFormPage;
