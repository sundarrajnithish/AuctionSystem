import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auctions.css'; // Ensure styles are applied

const Auctions = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]); // State to store categories
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to track errors

  // Fetch categories from the API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://51br6s96b3.execute-api.ca-central-1.amazonaws.com/auctionsystem/auctions');
        const data = await response.json();

        const fetchedCategories = data.data.map(item => ({
          title: item['auction-name'].S,
          description: item['description'].S,
          imgUrl: item['img-url'].S,
          auctionId: item['auction-id'].S, // Added auctionId for navigation
        }));

        setCategories(fetchedCategories); // Update state with fetched categories
      } catch (err) {
        setError('Failed to fetch auction items');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (auctionId, title) => {
    // Store the category title in sessionStorage
    sessionStorage.setItem('categoryTitle', title);
    console.log('categoryTitle:', title);
    // Navigate to AuctionItems page with auction-id in the URL
    navigate(`/auction-items/${auctionId}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="home-container">
      <h1>EXPLORE ACTIVE AUCTIONS</h1>
      <div className="category-grid">
      {categories.map((category, index) => (
        <div
          key={index}
          className="category-tile"
          onClick={() => handleCategoryClick(category.auctionId, category.title)} // Pass both auctionId and title
        >
          <img src={category.imgUrl} alt={category.title} className="category-img" />
          <div className="category-content">
            <h2 className="category-title">{category.title}</h2>
            <p className="category-description">{category.description}</p>
          </div>
        </div>
      ))}
      </div>
    </div>
  );
};

export default Auctions;
