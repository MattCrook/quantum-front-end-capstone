// This is a folder of most the old code which was removed during the Refactor from using Json server, to uing my own custom built API

// // From RollerCoasterList.js
// //   handles user adding the credit. gets the email from State which was set above
// //   puts the rollerCoasterId into an array,
// //   POSTs to the userProfile
//   const handleAddCredit = (rollerCoasterId) => {
//     let credits = userProfile.userprofile.rollerCoaster_id;
//     credits.push({ rollerCoasterId });
//     const id = userProfile.userprofile.id;
//     ApiManager.addCredit(id, credits).then(() => {
//       ApiManager.getUserProfile(user.email).then((userData) => {
//         const profile = userData[0];
//         const creditsArray = profile.userprofile.rollerCoaster_id;
//         setUserProfile(profile);
//         setCredits(creditsArray);
//       });
//     });
//   };



// From API Manager
// async getUserProfile(email) {
//   const resp = await fetch(`${remoteURL}/users?email=${email}`, {
//     method: "GET",
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//       Authorization: 'JWT' + localStorage.getItem("accessToken"),
//     },
//   })
//   return await resp.json();
// },



// From ProfileList.js - Initial api call to get user profile and drill down into the credits array.
// const getUserCredits = async user => {
//   try {
//     const userProfileFromAPI = await ApiManager.getUserProfile(user.email);
//     setUserProfile(userProfileFromAPI[0]);
//     console.log(userProfileFromAPI)
//     const rollerCoasterIds = userProfileFromAPI[0].credits.map(credit => {
//       const creditId = credit.rollerCoasterId;
//       return creditId;
//     });
//     let promises = [];
//     rollerCoasterIds.forEach(creditId => {
//       promises.push(ApiManager.getRollerCoastersWithAllExpanded(creditId));
//     });
//     Promise.all(promises).then(data => {
//       setUserCredits(data);
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };