import React from "react";
import { Accordion, AccordionSummary, AccordionDetails, Typography, Button } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Link } from "react-router-dom";
import "./ParticipationPage.css"; // Import custom styles

function ParticipationPage() {
    return (
        <div className="participation-guide">
            {/*<h1 className="logo">OneStopAuction</h1>*/}
            
            <div className="content">
                <h2>Participate Easily</h2>
                <p>Join us in making a difference! Follow these simple steps to participate in our auctions.</p>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6">Register</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            Create an account to get started. Register as a participant to start bidding on auctions.
                        </Typography>
                        <Link to="/RegisterAuction" style={{ textDecoration: 'none' }}>
                            <Button variant="contained" color="primary" className="register-button">
                                Start New Auction
                            </Button>
                        </Link>
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6">Browse Auctions</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            Explore a variety of items available for bidding. Find something you love and start bidding!
                        </Typography>
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6">Place Bids</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            Place your bids to win items. You can place multiple bids to increase your chances.
                        </Typography>
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6">Win & Pay</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            If you have the highest bid at the end of the auction, you win! Complete your payment to finalize.
                        </Typography>
                    </AccordionDetails>
                </Accordion>
            </div>
        </div>
    );
}

export default ParticipationPage;