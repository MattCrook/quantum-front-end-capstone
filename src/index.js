import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Auth0Provider } from "./contexts/react-auth0-context";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import config from "./auth_config.json";
import history from "./utils/history";
// import configureStore from './store'
// import createHistory from 'history/createBrowserHistory'
// import { ConnectedRouter } from 'react-router-redux'
// import { Provider } from 'react-redux


// const history = createHistory()
// const store = configureStore(history)



// A function that routes the user to the right place after login
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
    client_id={config.client_id}
    redirect_uri={`${window.location.origin}/home`}
    onRedirectCallback={onRedirectCallback}
    audience={config.audience}
    scope={config.scope}
    // connection={config.connection}
    // id_token_hint={config.id_token_hint}
  >
    <App />
  </Auth0Provider>,
  document.getElementById("root")
);

serviceWorker.unregister();
