import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";

const auctionTheme = createTheme({
  palette: {
    primary: {
      main: "#1a73e8", // A bold blue for main actions (e.g., bid button)
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#ffb400", // A gold-like color for auction highlights
      contrastText: "#ffffff",
    },
    background: {
      default: "#f5f5f5", // Light gray for the background
      paper: "#ffffff", // White for cards and modals
    },
    text: {
      primary: "#333333", // Dark gray for primary text
      secondary: "#555555", // Lighter gray for secondary text
    },
    error: {
      main: "#d32f2f", // Red for error states
    },
    success: {
      main: "#388e3c", // Green for success states
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    h1: {
      fontFamily: "Pacifico, cursive", // Custom font for branding
      fontSize: "2.5rem",
      fontWeight: 700,
      color: "#1a73e8",
    },
    h2: {
      fontWeight: 700,
      fontSize: "2rem",
      color: "#1a73e8",
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.75rem",
      color: "#333333",
    },
    body1: {
      fontSize: "1rem",
      color: "#555555",
    },
    body2: {
      fontSize: "0.875rem",
      color: "#555555",
    },
    button: {
      textTransform: "none", // Disable uppercase for buttons
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Rounded buttons
          padding: "10px 20px",
        },
        containedPrimary: {
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16, // Rounded corners for cards
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#1a73e8",
          color: "#ffffff",
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h1: {
          textAlign: "center",
        },
      },
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={auctionTheme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
