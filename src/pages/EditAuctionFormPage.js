import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const EditAuctionFormPage = () => {
  const { auctionId } = useParams(); // Retrieve auctionId from the route parameters
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
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
          setDescription(auction.description || ""); // Use empty string if description is missing

          // Clean out everything before the URL if necessary
          let imageUrl = auction["img-url"];

          // If the image URL is not in base64, fetch it and convert to base64
          if (imageUrl && !imageUrl.startsWith("data:image/jpeg;base64,")) {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const reader = new FileReader();
            reader.onloadend = () => setTitleImage(reader.result.split(",")[1]); // Set base64 string
            reader.readAsDataURL(blob); // Convert to base64
          } else {
            setTitleImage(
              imageUrl ? imageUrl.replace("data:image/jpeg;base64,", "") : null
            ); // Clean if base64
          }
        } else {
          alert("Failed to fetch auction details.");
        }
      } catch (error) {
        console.error("Error fetching auction details:", error);
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
    reader.onloadend = () => setTitleImage(reader.result.split(",")[1]); // Set base64 encoded string
    reader.readAsDataURL(file); // Convert file to base64
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!name) newErrors.name = "Auction name is required";
    if (!description) newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission for updating auction
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);

      // Get user-id from sessionStorage
      const userId = sessionStorage.getItem("loginId");
      if (!userId) {
        alert("User not logged in");
        setLoading(false);
        return;
      }

      const updatedAuctionData = {
        "auction-name": name,
        description: description,
        titleImage: titleImage, // Send base64 string for the image
        "user-id": userId,
      };

      try {
        const response = await fetch(
          `https://51br6s96b3.execute-api.ca-central-1.amazonaws.com/auctionsystem/auctions/edit?auctionId=${auctionId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedAuctionData),
          }
        );

        if (response.ok) {
          alert("Auction updated successfully!");
          window.history.back();
        } else {
          alert("Failed to update auction.");
        }
      } catch (error) {
        console.error("Error updating auction:", error);
        alert("An error occurred while updating the auction.");
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
            {errors.description && (
              <p className="error">{errors.description}</p>
            )}
          </div>

          {/* Title Image */}
          <div className="image-preview">
            <label htmlFor="title-image">Update Auction Image</label>
            <input
              type="file"
              id="title-image"
              accept="image/*"
              onChange={handleImageChange}
            />
            {titleImage && (
              <img
                key={titleImage}
                src={`data:image/jpeg;base64,${titleImage}`}
                alt="Preview"
              />
            )}
            {errors.titleImage && <p className="error">{errors.titleImage}</p>}
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Updating Auction..." : "Update Auction"}
          </button>
        </form>
      )}
    </div>
  );
};

export default EditAuctionFormPage;
