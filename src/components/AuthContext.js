import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';  // Correct import for Amplify

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { user, signOut, isAuthenticated } = useAuthenticator(); // Get user data and auth state from Amplify UI
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      // Use Amplify.Auth to get current user info
      Amplify.Auth.currentUserInfo()
        .then((userInfo) => {
          console.log('User info retrieved from Amplify.Auth.currentUserInfo():', userInfo);
          setCurrentUser(userInfo); // Set the user info
        })
        .catch((error) => {
          console.log('Error fetching user info from Amplify.Auth.currentUserInfo():', error);
          setCurrentUser(null);  // Set currentUser to null on error
        });
    } else {
      console.log('User is not authenticated');
      setCurrentUser(null);  // Clear user info when not authenticated
    }
  }, [isAuthenticated]);

  // Function to retrieve the email, checking the new `currentUser`
  const getEmail = () => {
    if (currentUser) {
      console.log('Current user object:', currentUser);  // Log the current user object
      // Check if email exists in currentUser attributes, otherwise fallback to other possible fields
      return currentUser.attributes?.email || currentUser.username || null;
    }
    console.log('No currentUser object found');
    return null;
  };

  const value = {
    currentUser,
    signOut,
    getEmail, // Expose the getEmail function to context consumers
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access auth context
export const useAuth = () => useContext(AuthContext);
