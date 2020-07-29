import React, { useState, useEffect } from "react";
import ProfileCard from "./ProfileCard";
import userManager from "../../modules/users/userManager";
import creditManager from "../../modules/credits/creditManager";
import rollerCoasterManager from "../../modules/rollerCoasters/rollerCoasterManager";
import { useAuth0 } from "../../contexts/react-auth0-context";
import { confirmAlert } from "react-confirm-alert";
import "./Profile.css";
import "react-confirm-alert/src/react-confirm-alert.css";

const ProfileList = (props) => {
  const { user, clearStorage, logout } = useAuth0();
  // const [userCredits, setUserCredits] = useState([]);
  // const [userProfile, setUserProfile] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { authUser } = props;
  const userId = authUser.id;
  const defaultProfilePicture = "https://aesusdesign.com/wp-content/uploads/2019/06/mans-blank-profile-768x768.png";

  const getUserCreditsToFetch = async (userId) => {
    try {
      const userProfileFromAPI = await userManager.getUserProfileEmbeddedAuthUser(userId);
      const creditsToFetch = await creditManager.getCreditIdFromApi();
      const profile = userProfileFromAPI[0];
      const filterUsersCredits = creditsToFetch.filter((credit) => credit.userProfile === profile.id);
      props.setUserProfile(profile);
      props.setUserCredits(profile.credits);

      const creditsMap = filterUsersCredits.map((credit) => {
        const rollerCoasterId = credit.rollerCoaster;
        return rollerCoasterId;
      });
      let promises = [];
      creditsMap.forEach((item) => {
        promises.push(rollerCoasterManager.getRollerCoastersForUserProfile(item));
      });
      Promise.all(promises)
        .then((data) => {
          props.setUserRollerCoasters(data);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (err) {
      console.log(err);
    }
  };


  const deleteCredit = (creditId) => {
    try {
      confirmAlert({
        title: "Confirm to delete",
        message: "Are you sure you want to remove this credit?",
        buttons: [
          {
            label: "Yes",
            onClick: () => {
              setIsLoading(true);
              creditManager.getCreditIdFromApi().then((credits) => {
                  const filteredCreditToDelete = credits.filter((credit) => credit.rollerCoaster === creditId);
                  creditManager
                    .deleteCredit(filteredCreditToDelete[0].id)
                    .then(() => {
                      userManager
                        .getUserProfileEmbeddedAuthUser(userId)
                        .then(() => {
                          getUserCreditsToFetch(userId)
                          // const profile = response[0];
                          // const credits = profile.credits;
                          // props.setUserProfile(profile);
                          // props.setUserCredits(credits);
                          // props.setUserRollerCoasters()
                        });
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                })
                .catch((error) => {
                  console.log(error);
                });
              setIsLoading(false);
            },
          },
          {
            label: "No",
            onClick: () => "",
          },
        ],
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (props) {
      getUserCreditsToFetch(userId);
    }
  }, [user, props.authUser, userId]);

  return (
    <>
      <nav id="nav_profile_list_container" className="navbar is-dark">
        <div className="navbar-brand">
          <button id="quantum_logo" className="navbar-item">
            Quantum Coasters
          </button>
        </div>

        <button
          className="add-new-credit-btn inset"
          data-testid="add_new_credit_btn_testid"
          onClick={() => props.history.push("/user/parks/addcredit")}
        >Add New Credit</button>

        <button
          className="edit-profile-button inset"
          data-testid="edit_profile_btn_testid"
          onClick={() => props.history.push(`/profile/${props.userProfile.id}`)}
        >
          Edit Profile
        </button>

        <div className="name-container-profile-list">
          <p className="name-profile-list">
            {authUser.first_name} {authUser.last_name}
          </p>
          {props.userProfile.image ? (
            <img
              id="profile-pic"
              src={props.userProfile.image.image}
              alt="My Avatar"
            />
          ) : (
            <img id="profile-pic" src={defaultProfilePicture} alt="My Avatar" />
          )}
          <button
            onClick={() =>
              logout({ returnTo: window.location.origin }, clearStorage())
            }
            className="logout-navbar-item"
            data-testid="logout-btn-testid"
          >
            Logout
          </button>
        </div>
      </nav>
      <div className="credits-title">Credits</div>
      <div className="total_credits_profile_list">
        Total: {props.userCredits.length}
      </div>
      <div
        className="profile-container-card"
        data-testid="profile_card_container_testid"
      >
        {props.userRollerCoasters.map((rollerCoaster) => (
          <ProfileCard
            key={rollerCoaster.id}
            userProfile={props.userProfile}
            authUser={authUser}
            rollerCoaster={rollerCoaster}
            manufacturer={rollerCoaster.manufacturer}
            park={rollerCoaster.park}
            trackType={rollerCoaster.tracktype}
            deleteCredit={deleteCredit}
            {...props}
          />
        ))}
      </div>
    </>
  );
};

export default ProfileList;
