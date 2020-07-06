import React, { useState, useEffect } from "react";
import ProfileCard from "./ProfileCard";
import ApiManager from "../../modules/ApiManager";
import { useAuth0 } from "../../contexts/react-auth0-context";
import { confirmAlert } from "react-confirm-alert";
import "./Profile.css";
import "react-confirm-alert/src/react-confirm-alert.css";


const ProfileList = (props) => {
  const { user } = useAuth0();
  const [userCredits, setUserCredits] = useState([]);
  const [userProfile, setUserProfile] = useState({});
  const [isLoading, setIsLoading] = useState(false);



  const getUserCreditsToFetch = async (user) => {
    try {
      const userProfileFromAPI = await ApiManager.getUserProfile(user.email);
      const creditsToFetch = await ApiManager.getCreditIdFromApi();
      const profile = userProfileFromAPI[0];
      const filterUsersCredits = creditsToFetch.filter(
        (credit) => credit.userProfile === profile.userprofile.id
      );
      setUserProfile(profile);
      const creditsMap = filterUsersCredits.map((credit) => {
        const rollerCoasterId = credit.rollerCoaster;
        return rollerCoasterId;
      });
      let promises = [];
      creditsMap.forEach((item) => {
        promises.push(ApiManager.getRollerCoastersForUserProfile(item))
      });
      Promise.all(promises).then((data) => {
        setUserCredits(data);
      })
        .catch((error) => {
        console.log(error)
      })
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
              ApiManager.getCreditIdFromApi().then((credits) => {
                const filteredCreditToDelete = credits.filter(
                  (credit) => credit.rollerCoaster === creditId
                );
                ApiManager.deleteCredit(filteredCreditToDelete[0].id).then(() => {
                  ApiManager.getUserProfile(user.email).then(response => {
                    setUserProfile(response[0])
                  })
                });
              });
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
    getUserCreditsToFetch(user);
  }, [user, isLoading]);


  return (
    <>
      <nav className="navbar is-dark">
        <div className="container" id="nav-container-profile">
          <div className="navbar-brand">
            <button className="navbar-item">Quantum</button>
          </div>
          <button
            className="add-new-credit-btn"
            data-testid="add_new_credit_btn_testid"
            onClick={() => props.history.push("/users/new")}
          >
            Add New Credit
          </button>
          <button
            className="edit-profile-button"
            data-testid="edit_profile_btn_testid"
            onClick={() => props.history.push(`/profile/${userProfile.id}`)}
          >
            Edit Profile
          </button>
          <div className="name-container-profile-list">
            <p className="name-profile-list">
              {userProfile.first_name} {userProfile.last_name}
            </p>
            {userProfile.picUrl ? (
              <img id="profile-pic" src={userProfile.picUrl} alt="My Avatar" />
            ) : (
              <img id="profile-pic" src={user.picture} alt="My Avatar" />
            )}
          </div>
        </div>
      </nav>
      <p className="credits-title">Credits</p>
      <div
        className="profile-container-card"
        data-testid="profile_card_container_testid"
      >
        {userCredits.map((rollerCoaster) => (
          <ProfileCard
            key={rollerCoaster.id}
            userProfile={userProfile}
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
