import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Auctions = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]); // State to store auction categories
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to track errors
  const [registeredAuctions, setRegisteredAuctions] = useState([]); // State to store registered auction IDs

  const userId = sessionStorage.getItem("loginId"); // Get the user ID from session storage

  // Fetch categories from the API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://51br6s96b3.execute-api.ca-central-1.amazonaws.com/auctionsystem/auctions"
        );
        const data = await response.json();

        const fetchedCategories = data.data.map((item) => ({
          title: item["auction-name"].S,
          description: item["description"].S,
          imgUrl: item["img-url"].S,
          auctionId: item["auction-id"].S,
        }));

        setCategories(fetchedCategories); // Update state with fetched categories
      } catch (err) {
        setError("Failed to fetch auction items");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchRegisteredAuctions = async () => {
      if (!userId) return;

      try {
        const response = await fetch(
          `https://51br6s96b3.execute-api.ca-central-1.amazonaws.com/auctionsystem/auctions/registered-users?user-id=${userId}`
        );
        const data = await response.json();

        if (data.isRegistered) {
          setRegisteredAuctions(data["auction-ids"]);
        }
      } catch (err) {
        console.error("Failed to fetch registered auctions:", err);
      }
    };

    fetchCategories();
    fetchRegisteredAuctions();
  }, [userId]);

  // Handle Register button click
  const handleRegister = async (auctionId) => {
    try {
      const response = await fetch(
        `https://51br6s96b3.execute-api.ca-central-1.amazonaws.com/auctionsystem/auctions/registered-users?user-id=${userId}&auction-id=${auctionId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      alert("Registration successful!");

      // Update the registeredAuctions state to reflect the new registration
      setRegisteredAuctions((prev) => [...prev, auctionId]); // Add the auctionId to the list
    } catch (error) {
      console.error("Error registering for auction:", error);
    }
  };

  // Handle Deregister button click
  const handleDeregister = async (auctionId) => {
    try {
      const response = await fetch(
        `https://51br6s96b3.execute-api.ca-central-1.amazonaws.com/auctionsystem/auctions/registered-users?user-id=${userId}&auction-id=${auctionId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const Response = await response.json();
        alert("Deregistration failed: " + Response["message"]);
        throw new Error("Deregistration failed: " + Response["message"]);
      }

      alert("Deregistration successful!");

      // Update the registeredAuctions state to reflect the deregistration
      setRegisteredAuctions((prev) => prev.filter((id) => id !== auctionId)); // Remove the auctionId from the list
    } catch (error) {
      console.error("Error deregistering from auction:", error);
    }
  };

  const handleCategoryClick = (auctionId, title) => {
    sessionStorage.setItem("categoryTitle", title);
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
      <h1>EXPLORE LIVE AUCTIONS</h1>
      <div className="category-grid">
        {categories.map((category, index) => {
          const isRegistered = registeredAuctions.includes(category.auctionId);

          return (
            <div className="category-tile">
              <div className="category-image-container">
                <img
                  src={category.imgUrl}
                  alt={category.title}
                  className="category-img"
                />
                <div
                  className="category-description-overlay"
                  onClick={() =>
                    isRegistered
                      ? handleCategoryClick(category.auctionId, category.title)
                      : alert("Please register to view items")
                  }
                >
                  <p>{category.description}</p>
                </div>
              </div>
              <div className="category-content">
                <h2 className="category-title">{category.title}</h2>
                <div>
                  <button
                    className="category-button"
                    onClick={() =>
                      isRegistered
                        ? handleDeregister(category.auctionId)
                        : handleRegister(category.auctionId)
                    }
                  >
                    {isRegistered ? "Deregister" : "Register"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Auctions;
