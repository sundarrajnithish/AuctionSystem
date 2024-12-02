import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'; // Ensure styles are applied

const Home = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]); // State to store categories
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to track errors

  // Fetch categories from the API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://51br6s96b3.execute-api.ca-central-1.amazonaws.com/auctionsystem/category'); // Replace with your API URL
        const data = await response.json();
        
        // Extracting relevant data from the response
        const fetchedCategories = data.data.map(item => ({
          title: item.Title.S,
          description: item.Description.S,
          imgUrl: item.ImgUrl.S,
          Category: item.Category.S.toLowerCase(), // Using category as slug
        }));

        setCategories(fetchedCategories); // Update state with fetched categories
      } catch (err) {
        setError('Failed to fetch categories');
        console.error(err);
      } finally {
        setLoading(false); // Set loading to false after the request is complete
      }
    };

    fetchCategories();
  }, []); // Empty dependency array to run the effect once on component mount

  const handleCategoryClick = (category) => {
    // Navigate to the dynamic route
    navigate(`/products/${category.slug}`);
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading message while data is being fetched
  }

  if (error) {
    return <div>{error}</div>; // Show error message if there was a problem fetching data
  }

  return (
    <div className="home-container">
      <h1>EXPLORE AUCTION ITEMS</h1>
      <div className="category-grid">
        {categories.map((category, index) => (
          <div
            key={index}
            className="category-tile"
            onClick={() => handleCategoryClick(category)}  // Navigate to dynamic URL
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

export default Home;
