import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./components/Navbar/NavBar";
import Home from "./pages/Home";

// AWS Amplify imports
import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import awsExports from "./aws-exports";

import "@aws-amplify/ui-react/styles.css";
import RegisterAuction from "./pages/RegisterAuction";

// Configure Amplify with AWS settings
Amplify.configure(awsExports);

function App() {
  return (
    <Authenticator>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/RegisterAuction" element={<RegisterAuction />} />
          {/* Additional routes can be added here */}
        </Routes>
      </Router>
    </Authenticator>
  );
}

export default App;
