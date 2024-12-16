import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


import './MyAuctions.css';

const MyAuctions = ({ user }) => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteAuctionId, setDeleteAuctionId] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [successPopupVisible, setSuccessPopupVisible] = useState(false);
  const navigate = useNavigate();

  const userEmail = sessionStorage.getItem('loginId');
  // console.log(userEmail);

  const fetchAuctions = async (userEmail) => {
    setLoading(true);
    setError(null);
    // console.log(userEmail);
    try {
      const response = await fetch(
        `https://51br6s96b3.execute-api.ca-central-1.amazonaws.com/auctionsystem/auctions/user-id?user-id=${userEmail}`
      );
      const data = await response.json();
      setAuctions(data.auctions);
    } catch (err) {
      setError('You have no auctions listed');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (auctionId) => {
    navigate(`/provider/edit-auction/${auctionId}`);
  };

  const handleDelete = (auctionId) => {
    setDeleteAuctionId(auctionId);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    setShowDeleteConfirmation(false);
    setLoading(true);

    try {
      const response = await fetch(
        `https://51br6s96b3.execute-api.ca-central-1.amazonaws.com/auctionsystem/auctions/edit?auctionId=${deleteAuctionId}`,
        {
          method: 'DELETE',
        }
      );

      if (response.ok) {
        setSuccessPopupVisible(true);
        fetchAuctions(userEmail); // Refresh auctions list after deletion
      } else {
        throw new Error('Failed to delete auction');
      }
    } catch (error) {
      setError('Error deleting auction');
    } finally {
      setLoading(false);
    }
  };

  // Ensure email is not null or undefined before rendering
  useEffect(() => {
    if (userEmail) {
      fetchAuctions(userEmail); // Fetch auctions when component mounts
    }
  }, [userEmail]); // Depend on userEmail to refetch when it changes

  if (!userEmail) {
    return <div>User not authenticated or email missing</div>;
  }

  return (
    <div className="my-auctions-container">
      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}

      <h1>YOUR ACTIVE AUCTIONS</h1>
      
      <div className="auction-grid">
        <div className="add-auction-tile" onClick={() => navigate('/provider/add-auction')}>
          <div className="add-auction-tile-content">
            <span className="add-auction-text">Add Auction</span>
          </div>
        </div>

        {auctions.map((auction) => (
          <div key={auction['auction-id']} className="auction-card">
            <img src={auction['img-url']} alt={auction['auction-name']} className="auction-image" />
            <div className="auction-details">
              <h2 className="auction-name">{auction['auction-name']}</h2>
              <p className="auction-bids">{auction['description']}</p>
              <div className="auction-actions">
                <button onClick={() => handleEdit(auction['auction-id'])}>Edit</button>
                <button onClick={() => handleDelete(auction['auction-id'])}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showDeleteConfirmation && (
        <div className="confirmation-modal">
          <p>Are you sure you want to delete this auction?</p>
          <button className="confirm-button" onClick={confirmDelete}>Yes</button>
          <button className="cancel-button" onClick={() => setShowDeleteConfirmation(false)}>No</button>
        </div>
      )}

      {successPopupVisible && (
        <div className="success-popup">
          <p>Auction has been deleted successfully.</p>
          <button className="ok-button" onClick={() => setSuccessPopupVisible(false)}>OK</button>
        </div>
      )}
    </div>
  );
};

export default MyAuctions;
