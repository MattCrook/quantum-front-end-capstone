import React, { useState, useEffect } from "react";
import { useAuth0 } from "./contexts/react-auth0-context";
import { BrowserRouter as Router } from "react-router-dom";
import NavBar from "./components/nav/NavBar";
import ApplicationViews from "./components/ApplicationViews";
import history from "./utils/history";
import ApiManager from "./modules/ApiManager";
import "./App.css";
import "bulma/css/bulma.css";
import CssBaseline from "@material-ui/core/CssBaseline";
// import accessToken from "./utils/reducers/authReducers";
//browser-tabs-lock-key-auth0.lock.getTokenSilently

const App = (props) => {
  const { loading, user, getTokenSilently, getTokenWithPopup } = useAuth0();
  const [userProfile, setUserProfile] = useState([]);

  // fetching the userProfile (when i was using json server) to check if there is one. Will determine conditional rendering
  // further down in app. If there is no user profile, the rest of the app is blocked or hidden so user has to fill out
  // complete profile form.

  useEffect(() => {
    if (user) {
      getTokenSilently(user)
        .then((response) => {
          localStorage.setItem("accessToken", JSON.stringify(response));
        })
        .then(() => {
          ApiManager.getUserProfile(user.email, user)
            .then((userProfileFromAPI) => {
              if (userProfileFromAPI.length > 0) {
                sessionStorage.setItem("credentials", JSON.stringify(user.email));
                const sub = user.sub;
                localStorage.setItem("user_sub_token_id", sub);
                setUserProfile(userProfileFromAPI[0]);
              } else {
                console.log("DON'T HAVE USER YET.");
                setUserProfile({});
              }
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((err) => {
          console.log(err);
      })
    }
    return () => user;
  }, [user, getTokenSilently]);


  if (loading) {
    return <div className="loading_pop_up">Loading...</div>;
  }

  return (
    <>
      <CssBaseline />
      <Router history={history}>
        <NavBar
          userProfile={userProfile}
          setUserProfile={setUserProfile}
          {...props}
        />
        <ApplicationViews
          userProfile={userProfile}
          setUserProfile={setUserProfile}
          {...props}
        />
      </Router>
    </>
  );
};
export default App;
