import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Auth0Provider } from "./contexts/react-auth0-context";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
// import { BrowserRouter as Router } from "react-router-dom";
import config from "./auth_config.json";
import history from "./utils/history";

// A function that routes the user to the right place
// after login
const onRedirectCallback = appState => {
  history.push(
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname
  );
};

ReactDOM.render(
  <Auth0Provider
    domain={config.domain}
    client_id={config.clientId}
    redirect_uri={`${window.location.origin}/home`}
    onRedirectCallback={onRedirectCallback}
  >
    <App />
  </Auth0Provider>,
  document.getElementById("root")
);

serviceWorker.unregister();
