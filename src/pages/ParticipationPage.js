import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
  Grid2,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Link } from "react-router-dom";
// import "../styles/ParticipationPage.css"; // Import custom styles

function ParticipationPage() {
  return (
    <Grid2
      container
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "row",
      }}
      spacing={{ xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }}
      columns={{ xl: 50, lg: 40, md: 30, sm: 20, xs: 10 }}
      marginBlock={1}
    >
      {/*<h1 className="logo">OneStopAuction</h1>*/}

      <Grid2>
        <Typography variant="h3">Participate Easily</Typography>
        <p>
          Join us in making a difference! Follow these simple steps to
          participate in our auctions.
        </p>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Register</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Create an account to get started. Register as a participant to
              start bidding on auctions.
            </Typography>
            <Link to="/RegisterAuction" style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                color="primary"
                className="register-button"
              >
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
              Explore a variety of items available for bidding. Find something
              you love and start bidding!
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Place Bids</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Place your bids to win items. You can place multiple bids to
              increase your chances.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Win & Pay</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              If you have the highest bid at the end of the auction, you win!
              Complete your payment to finalize.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Grid2>
    </Grid2>
  );
}

export default ParticipationPage;
