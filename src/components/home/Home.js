import React, { useState, useEffect } from "react";
import "bulma/css/bulma.css";
import { useAuth0 } from "../../contexts/react-auth0-context";
import { Link } from "react-router-dom";
import "./Home.css";
import Authenticate from "../auth/Authenticate";
import MicroModal from "micromodal";
import "../auth/Authenticate.css";

MicroModal.init({
  openTrigger: "data-micromodal-trigger",
  closeTrigger: "data-micromodal-close",
  openClass: "is-open",
  disableScroll: true,
  disableFocus: false,
  awaitOpenAnimation: true,
  awaitCloseAnimation: false,
  debugMode: true,
});

const Home = (props) => {
  const { loading, user, logout, clearStorage, isAuthenticated, djangoRestAuthLogout } = useAuth0();
  const { userProfile } = props;
  const { authUser } = props;
  const { isLoggedIn } = props;
  const { setIsLoggedIn } = props;
  const { hasLoggedIn } = props;
  const defaultProfilePicture = "https://aesusdesign.com/wp-content/uploads/2019/06/mans-blank-profile-768x768.png";



  useEffect(() => {
    if (isAuthenticated && isLoggedIn && props.authToken) {
      const quantumToken = props.authToken;
      console.log("QToken", quantumToken);
      console.log("Authtoekn", props.authToken);
      setIsLoggedIn(hasLoggedIn());
    } else {
      console.log("else");
      setIsLoggedIn(hasLoggedIn());
    }
  }, [props, hasLoggedIn, isLoggedIn, isAuthenticated, setIsLoggedIn]);


  return (
    <>
      <header>
        <nav id="home_navbar_container" className="navbar is-dark">
          <div className="navbar-menu is-active">
            {/* logo */}
            <button className="home-logo">Quantum Coasters</button>
            {/* menu items */}
            {/* if there is a user. show the logout button */}
            {!loading && user && isAuthenticated && (
              <>
                <div className="navbar-end">
                  {authUser.email ? (
                    <button className="navbar-item-home-name">
                      {authUser.first_name} {authUser.last_name}
                    </button>
                  ) : (
                    <div className="navbar_item_home_user_name">{user.email}</div>
                  )}
                  {!loading && userProfile.image ? (
                    <img
                      data-testid="home-profile-pic-testid"
                      id="profile-pic"
                      src={userProfile.image.image}
                      alt="My Avatar"
                    />
                  ) : (
                    <img
                      data-testid="home-profile-pic-testid"
                      id="profile-pic"
                      src={defaultProfilePicture}
                      alt="My Avatar"
                    />
                  )}
                  <div className="logout_btn_home_container">
                    <button
                      // onClick={() => logout({ returnTo: window.location.origin }, clearStorage())}
                      onClick={() => djangoRestAuthLogout(logout, clearStorage, authUser)}
                      className="logout-navbar-item"
                      data-testid="logout-btn-testid"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </nav>

        <div className="modal_btn_toggle_home">
          {!loading && user && userProfile.id && isAuthenticated && !isLoggedIn ? (
            <>
              <button
                className="modal_sign_in_btn_home"
                onClick={() => MicroModal.init()}
                data-micromodal-trigger="modal-1"
              >
                <i className="fas fa-user-lock"></i>Confirm Email
              </button>
              <Authenticate authUser={authUser} {...props} />
            </>
          ) : null}
        </div>

        {!authUser.email && !loading && user && isAuthenticated && !isLoggedIn && (
          <>
            <div className="banner-for-complete-profile">
              <h3 className="welcome-greeting" data-testid="welcome-greeting-testid">
                Welcome! Please click the button below and complete your profile to get started using Quantum.
              </h3>
            </div>
          </>
        )}
        <div className="hero is-fullheight">
          {!loading && !authUser.email && isAuthenticated && !isLoggedIn && (
            <Link data-testid="complete-profile-btn-testid" className="complete-profile-link" to="register/">
              Complete Profile
            </Link>
          )}
          <div className="hero-body bg-img" style={{ marginTop: "20px" }}></div>
        </div>
      </header>
      <div className="signature">
        <p>
          Made by <a href="https://matt-crook-io.now.sh/">Quantum Coasters</a> <i className="fas fa-trademark"></i>
        </p>
      </div>
    </>
  );
};
export default Home;

// if using the location object, and adding guard, grab the state of userProfile passed thru props (from register)
/* const userProfile = props.location && props.location.state && props.location.state.userProfile */
