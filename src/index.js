import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import config from "./amplifyconfiguration.json";
//styles
import "./Styles/App.css";
import "@aws-amplify/ui-react/styles.css";

//wrapper Imports
import { Authenticator } from "@aws-amplify/ui-react";
import { WebSocketProvider } from "./components/WebSocketContext";

//amplify Imports
import { Amplify } from "aws-amplify";

Amplify.configure(config);
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Authenticator>
      <WebSocketProvider>
        <App />
      </WebSocketProvider>
    </Authenticator>
  </React.StrictMode>
);
