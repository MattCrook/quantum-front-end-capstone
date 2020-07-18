import React from "react";
import { useAuth0 } from "../../contexts/react-auth0-context";
import "../home/Home.css";
import "bulma/css/bulma.css";


const LandingPage = () => {
  const { loading, user, loginWithRedirect, logout, clearStorage } = useAuth0();


  return (
    <header>
      <nav className="navbar is-dark">
        <div className="container">
          <div className="navbar-menu is-active">
            {/* logo */}
            <div className="navbar-brand">
              <button id="quantum_logo" className="navbar-item">Quantum Coasters</button>
            </div>

            {/* menu items */}
            <div className="navbar-end">
              {/* if there is no user. show the login button */}
              {!loading && !user && (
                <button onClick={loginWithRedirect} className="navbar-item">
                  Login
                </button>
              )}

              {/* if for some reason user lands on this page and is logged in, show home and logout button */}
              {!loading && user && (
                <button onClick={logout} className="navbar-item">
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
      <div className="hero is-fullheight">
        <div className="hero-body bg-img" style={{marginTop: "20px"}}>
          <div className="container has-text-centered login-foo"></div>
        </div>
      </div>
    </header>
  );
};

export default LandingPage;
