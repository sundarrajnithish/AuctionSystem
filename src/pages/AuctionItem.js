import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getAuctionItem,
  updateAuctionItem,
} from "../Services/auctionItemServices";
import Swal from "sweetalert2";

const AuctionItem = () => {
  const { itemId } = useParams();
  const [item, setItem] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bidders, setBidders] = useState([]);

  // Function to format time in mm:ss format
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  // Fetch auction item details from the API
  const fetchAuctionItem = async () => {
    // console.log("Fetching URL:", url);
    getAuctionItem(itemId)
      .then(
        (res) => {
          const data = res.data;
          const bidders = data.data[0]["bidders"] || [];
          sessionStorage.setItem("bidders", JSON.stringify(bidders));
          if (data.message === "Items retrieved successfully") {
            const auctionItem = data.data[0];
            setItem(auctionItem);

            const endTimestamp =
              new Date(auctionItem["timestamp-listed"]).getTime() +
              5 * 60 * 1000; // Auction ends after 5 minutes
            const currentTime = Date.now();
            const remainingTime = Math.max(
              0,
              Math.floor((endTimestamp - currentTime) / 1000)
            );
            setTimeLeft(remainingTime);
            setTimerActive(remainingTime > 0);

            setBidders(auctionItem["bidders"] || []);
            setLoading(false);

            if (remainingTime > 0) {
              // Start countdown timer
              const timerInterval = setInterval(() => {
                const updatedTime = Math.max(
                  0,
                  Math.floor((endTimestamp - Date.now()) / 1000)
                );
                setTimeLeft(updatedTime);

                if (updatedTime === 0) {
                  clearInterval(timerInterval);
                  setTimerActive(false);
                }
              }, 1000);

              return () => clearInterval(timerInterval); // Cleanup timer on component unmount
            }
          } else {
            setError("Failed to fetch auction item details");
          }
        },
        (err) => {
          console.log(err);
        }
      )
      .catch((err) => {
        console.log(err);
        setError("Error fetching auction item");
      });
  };

  // Effect to fetch data initially
  useEffect(() => {
    fetchAuctionItem();
  }, [itemId]);

  const bid = sessionStorage.getItem("bidders");
  // Debugging
  // console.log('Bid:', bid);
  // console.log(bid.length);

  // Handle bidding
  const handleBid = async () => {
    if (!timerActive) return;

    const currentBid = item["current-bid"];
    let bidAmount = parseFloat(
      prompt(`Enter your bid amount (current bid: $${currentBid}):`)
    );

    if (isNaN(bidAmount) || bidAmount <= currentBid) {
      Swal.fire({
        title: `Bid must be greater than the current highest bid of $${currentBid}`,
      });
      return;
    }

    const bidderId = sessionStorage.getItem("loginId"); // Ensure loginId is stored in sessionStorage
    if (!bidderId) {
      Swal.fire({ title: "You must be logged in to place a bid." });
      return;
    }

    const bidData = {
      "item-id": itemId,
      bidders: [...bidders, { "bidder-id": bidderId, "bid-amount": bidAmount }],
      "current-bid": bidAmount,
    };

    updateAuctionItem(itemId, bidData)
      .then(
        (res) => {
          const data = res.data;
          if (data.message === "Bid placed successfully") {
            Swal.fire({ title: "Bid placed successfully!" });
            fetchAuctionItem(); // Re-fetch updated leaderboard and item details
          } else {
            Swal.fire({ title: "Failed to place bid" });
          }
        },
        (err) => {
          console.log(err);
        }
      )
      .catch((error) => {
        console.error("Error placing bid:", error);
        Swal.fire({ title: "Error placing bid" });
      });
  };

  // Sort bidders from highest to lowest bid amount
  const sortedBidders = [...bidders].sort(
    (a, b) => b["bid-amount"] - a["bid-amount"]
  );

  return (
    <div className="auction-item-container">
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <>
          <h1>{item["item-name"]}</h1>
          <div className="auction-item-details">
            <div className="auction-item-image">
              <img
                src={item["img-url"]}
                alt={item["item-name"]}
                className="auction-item-img"
              />
            </div>
            <div className="auction-item-info">
              <h2>Description</h2>
              <p>{item.description}</p>
              <h3>
                Starting Bid: ${item["starting-bid"]} | Current Bid: $
                {item["current-bid"]}
              </h3>
              <h4>Seller: {item["seller-id"]}</h4>
              <h4>Time Remaining: {formatTime(timeLeft)}</h4>

              <button
                className={`bid-button ${!timerActive ? "disabled" : ""}`}
                onClick={handleBid}
                disabled={!timerActive}
              >
                {timerActive ? "Place Bid" : "Auction Ended"}
              </button>
            </div>
          </div>

          <div className="leaderboard">
            <h3>Leaderboard</h3>
            <ul>
              {sortedBidders.map((bidder, index) => (
                <li key={index} className="leaderboard-item">
                  <span className="bidder-id">{bidder["bidder-id"]}</span>
                  <span className="bid-amount">${bidder["bid-amount"]}</span>
                </li>
              ))}
            </ul>
          </div>

          {timeLeft === 0 &&
            (() => {
              return (
                <div className="auction-winner">
                  <h2>
                    Auction Ended. Winner: $
                    {item["winner"] || "No bids placed, restarting..."}
                  </h2>
                </div>
              );
            })()}

          {timeLeft === 0 &&
            bid.length < 3 &&
            (() => {
              setTimeout(() => {
                console.log("Time expired. Reloading the page...");
                window.location.reload();
              }, 2000); // Reload after 2 seconds
              return <div></div>;
            })()}
        </>
      )}
    </div>
  );
};

export default AuctionItem;
