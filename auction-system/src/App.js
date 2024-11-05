import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';

// AWS Amplify imports
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import awsExports from './aws-exports';


import '@aws-amplify/ui-react/styles.css';

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
          {/* Additional routes can be added here */}
        </Routes>
      </Router>
    </Authenticator>
  );
}

export default App;
