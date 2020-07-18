import React, { useState, useEffect } from "react";
import ApiManager from "../../modules/ApiManager";
import { useAuth0 } from "../../contexts/react-auth0-context";
import { confirmAlert } from "react-confirm-alert";
// import keys from "../../keys/Keys";
// import ImageUploader from "react-images-upload";
import "./Profile.css";

const EditProfile = (props) => {
  const { user, logout, loading } = useAuth0();
  const { userProfileId } = props;

  const [userCredits, setUserCredits] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState({ id: "", image: "" });
  const [apiUser, setApiUser] = useState({
    id: "",
    first_name: "",
    last_name: "",
    username: "",
    email: user.email,
  });

  const [userProfile, setUserProfile] = useState({
    id: userProfileId,
    address: "",
    image_id: "",
    credits: "",
  });

  const defaultProfilePicture = "https://aesusdesign.com/wp-content/uploads/2019/06/mans-blank-profile-768x768.png";
  const defaultQPicture = "https://cdn.dribbble.com/users/2908839/screenshots/6292457/shot-cropped-1554473682961.png"

  const getProfileAndCredits = async (user) => {
    try {
      const authUserFromAPI = await ApiManager.getAuthUser(user.email);
      const creditsToFetch = await ApiManager.getCreditIdFromApi();
      const authProfile = authUserFromAPI[0];
      setApiUser(authProfile);

      const userProfileFromAPI = await ApiManager.getUserProfileEmbeddedAuthUser(authProfile.id);
      const profile = userProfileFromAPI[0];
      setUserProfile(profile);
      if (profile.image) {
        const imageId = profile.image.id;
        const getImage = await ApiManager.getAuthUserImage(imageId);
        setImage(getImage);
      } else {
        setImage(defaultProfilePicture);
      }
      const filterUsersCredits = creditsToFetch.filter((credit) => credit.userProfile === profile.id);
      setUserCredits(filterUsersCredits[0]);
    } catch (err) {
      console.log(err);
    }
  };

  const handleInputChangeUserProfile = (e) => {
    const stateToChange = { ...userProfile };
    stateToChange[e.target.id] = e.target.value;
    setUserProfile(stateToChange);
  };

  const handleInputChangeUser = (e) => {
    const stateToChange = { ...apiUser };
    stateToChange[e.target.id] = e.target.value;
    setApiUser(stateToChange);
  };

  const handleImageUpload = (event) => {
    const inputFile = event.target.files[0];
    // A hackey way of kicking the file out of the input
    // when validations fail
    const clearInput = () => (document.getElementById("image").value = "");
    // First check if the user actually ended up uploading a file
    if (inputFile) {
      // Then, check if it's an image
      if (!inputFile.type.startsWith("image/")) {
        alert("Only image files are supported");
        clearInput();
        // Then check if it's smaller than 5MB
      } else if (inputFile.size > 5000000) {
        alert("File size cannot exceed 5MB");
        clearInput();
      } else {
        // The image is only set in state
        // if the above validations pass
        const stateToChange = { ...image };
        stateToChange[event.target.id] = inputFile;
        setImage(stateToChange);
      }
    }
  };


  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const editedAuthUser = {
      id: apiUser.id,
      first_name: apiUser.first_name,
      last_name: apiUser.last_name,
      username: apiUser.username,
      email: user.email,
    };

    if (!loading && userProfile && userProfile.image) {
      const editedUserProfile = {
        id: userProfileId,
        address: userProfile.address,
        image_id: image.id,
        credits: userProfile.credits,
      };
      const updateAuthUser = await ApiManager.putEditedAPIUser(editedAuthUser);
      const updateUserProfile = await ApiManager.putEditedUserProfile(editedUserProfile);
    } else {
      const editedUserProfile = {
        id: userProfileId,
        address: userProfile.address,
        image_id: "",
        credits: userProfile.credits,
      };
      const updateAuthUser = await ApiManager.putEditedAPIUser(editedAuthUser);
      const updateUserProfile = await ApiManager.putEditedUserProfile(editedUserProfile);
    }
    setIsLoading(false);
    window.alert("Profile has been updated!");
    props.history.push("/users");
  };

  const gatherFormData = () => {
    const formdata = new FormData();
    if (image.image === "") {
      formdata.append("image", null);
    } else {
      formdata.append("image", image.image);
    }
    return formdata;
  };

  const handleImageFromSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = gatherFormData();
    const postNewImage = await ApiManager.postNewImage(formData);
    setImage(postNewImage);
    const image_id = postNewImage.id;

    const newUserProfileObject = {
      id: userProfileId,
      address: userProfile.address,
      image_id: image_id,
      credits: userProfile.credits,
    };
    setUserProfile(newUserProfileObject);
    setIsLoading(false);
  };

  const deleteUserProfile = (id) => {
    try {
      confirmAlert({
        title: "Confirm to delete",
        message:
          "Are you sure you want to delete your profile? Once this is done you will no longer have an account and will loose your credits.",
        buttons: [
          {
            label: "Yes",
            onClick: () =>
              ApiManager.deleteUserProfile(id).then(() => logout()),
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
    getProfileAndCredits(user);
    setIsLoading(false);
  }, [user]);



  return (
    <>
      <nav className="navbar-edit-profile">
        <div className="edit-profile-title-container">
          <h4 className="edit-profile-title">Edit Your Profile</h4>
        </div>
        <div className="delete-profile-button-container">
          <button
            className="delete-profile-button"
            data-testid="delete_profile_btn_testid"
            onClick={() => deleteUserProfile(apiUser.id)}
          >
            Delete Profile
          </button>
        </div>
      </nav>

      <div className="profile-pic-container">
        <div className="profile-pic-flex-box">
          {!loading && userProfile && image.image ? (
            <img id="edit-profile-pic" src={image.image} alt="My Avatar" />
          ) : (
              <img id="edit-profile-pic" src={defaultQPicture} alt="My default pic"/>
            )}

          <form className="uploadPicture" onSubmit={handleImageFromSubmit} encType="multipart/form-data">
            <div className="change-profile-pic">
              <label className="label_upload_profile_pic" htmlFor="image">Profile picture</label>
              <input
                name="image"
                id="image"
                type="file"
                accept="image/*"
                className="file-upload"
                onChange={handleImageUpload}
                value=""
              />
            </div>
            <button type="submit" className="change_photo_btn" disabled={isLoading}>
              Change Photo
            </button>
          </form>

        </div>
        <div className="profile-info-container">
          <div className="user_info_title">Profile Info</div>
          <div className="user_info"><strong>First Name: </strong>{apiUser.first_name}</div>
          <div className="user_info"><strong>Last Name: </strong>{apiUser.last_name}</div>
          <div className="user_info"><strong>Username: </strong>{apiUser.username}</div>
          <div className="user_info"><strong>Address: </strong>{userProfile.address}</div>
          {!loading && userCredits ? (
            <div className="user_info"><strong>Total Credits: </strong>{userCredits.length}</div>
          ) : (
            <div className="user_info"><strong>Total Credits: </strong>0</div>
          )}
        </div>
      </div>

      <form className="edit-profile-form" onSubmit={handleFormSubmit}>
        <div className="profile-inputs">
          <label className="first_name" htmlFor="first_name">First Name</label>
          <input
            className="input"
            onChange={handleInputChangeUser}
            type="text"
            id="first_name"
            required
            // autoFocus
            value={apiUser.first_name}
          />
          <label htmlFor="last_name">Last Name</label>

          <input
            className="input"
            onChange={handleInputChangeUser}
            type="text"
            id="last_name"
            required
            // autoFocus
            value={apiUser.last_name}
          />
          <label htmlFor="username">Username</label>
          <input
            className="input"
            onChange={handleInputChangeUser}
            type="text"
            id="username"
            required
            // autoFocus
            value={apiUser.username}
          />
          <label htmlFor="address">Address</label>
          <input
            className="input"
            onChange={handleInputChangeUserProfile}
            type="text"
            id="address"
            required
            // autoFocus
            value={userProfile.address}
          />
          <button className="edit-create-btn" type="submit" disabled={isLoading}>
            Confirm Changes
          </button>
        </div>
      </form>
      <div className="signature">
                <p>Made by <a href="https://matt-crook-io.now.sh/">Quantum Coasters</a> <i className="far fa-copyright"></i>
                </p>
            </div>
    </>
  );
};

export default EditProfile;
