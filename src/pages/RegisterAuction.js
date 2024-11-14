import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Authenticator } from "@aws-amplify/ui-react";
import "./RegisterAuction.css";

function RegisterAuction() {
    const [auctionName, setAuctionName] = useState("");
    const [category, setCategory] = useState("");
    const [startingBid, setStartingBid] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleCreateAuction = (e) => {
        e.preventDefault();

        // Form validation logic
        if (!auctionName || !category || !startingBid || !description || !image) {
            setErrorMessage("All fields are required.");
            return;
        }

        // Registration logic here (e.g., send data to API)
        console.log("Auction created with:", {
            auctionName,
            category,
            startingBid,
            description,
            image
        });
        setErrorMessage("");
        alert("Auction created successfully!");

        // Clear the form
        setAuctionName("");
        setCategory("");
        setStartingBid("");
        setDescription("");
        setImage(null);
        setPreview(null);
    };

    return (
        <div className="new-auction-page">
            <div className="auction-card">
                <h2>Create New Auction</h2>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <form onSubmit={handleCreateAuction}>
                    <label>Auction Name</label>
                    <input
                        type="text"
                        value={auctionName}
                        onChange={(e) => setAuctionName(e.target.value)}
                        placeholder="Enter auction name"
                        required
                    />

                    <label>Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        <option value="">Select a category</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Furniture">Furniture</option>
                        <option value="Art">Art</option>
                        <option value="Fashion">Fashion</option>
                        <option value="Collectibles">Collectibles</option>
                    </select>

                    <label>Starting Bid ($)</label>
                    <input
                        type="number"
                        value={startingBid}
                        onChange={(e) => setStartingBid(e.target.value)}
                        placeholder="Enter starting bid"
                        required
                    />

                    <label>Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe the item"
                        required
                    />

                    <label>Upload Image</label>
                    <input type="file" accept="image/*" onChange={handleImageUpload} required />
                    {preview && <img src={preview} alt="Preview" className="image-preview" />}

                    <button type="submit" className="btn-create-auction">Create Auction</button>
                </form>
            </div>
        </div>
    );
}

export default RegisterAuction;
