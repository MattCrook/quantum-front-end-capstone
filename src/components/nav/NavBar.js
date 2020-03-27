import { useAuth0 } from "../../contexts/react-auth0-context";
import React from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import "./NavBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons"

const NavBar = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <nav>
      <ul>
        {isAuthenticated ? (
          <li>
            <Link className="nav-link" to="/home">
              {" "}
              Home{" "}
            </Link>
          </li>
        ) : null}
        {isAuthenticated ? (
          <li>
            <FontAwesomeIcon icon={faUser} />

            <Link className="nav-link" to="/users">
              {" "}
              Profile{" "}
            </Link>
          </li>
        ) : null}
        {isAuthenticated ? (
          <li>
            <Link className="nav-link" to="/leaderboard">
              {" "}
              Leader Board{" "}
            </Link>
          </li>
        ) : null}
        {isAuthenticated ? (
          <li>
            <Link className="nav-link" to="/messages">
              {" "}
              Forum{" "}
            </Link>
          </li>
        ) : null}
      </ul>
    </nav>
  );
};

export default withRouter(NavBar);
