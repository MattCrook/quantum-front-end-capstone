const remoteURL = "http://localhost:8000";
// const remoteURL = process.env.REACT_APP_BASE_URL;

const ApiManager = {
  /************* USERS ********************/

  async getAllUsers() {
    const resp = await fetch(`${remoteURL}/userprofiles`);
    return await resp.json();
  },

  async getUserProfile(email) {
    const resp = await fetch(`${remoteURL}/userprofiles?email=${email}`);
    const result = await resp.json();
    const token = result.token;
    console.log(token);
    if ("token" in result) {
      localStorage.setItem("quantum_token", result.token);
    }
    return result;
  },

  async postNewUserProfile(newUser, token) {
    const data = await fetch(`${remoteURL}/userprofiles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(newUser),
    });
    const result = await data.json();
    if ("token" in result) {
      localStorage.setItem("quantum_token", result.token);
    }
  },

  // async getUserProfile(email) {
  //   var request = require("request");

  //   var options = {
  //     method: 'POST',
  //     url: 'https://dev-405n1e6w.auth0.com/oauth/token',
  //     headers: { 'content-type': 'application/x-www-form-urlencoded' },
  //     form:
  //     {
  //       grant_type: 'authorization_code',
  //       client_id: 'wnZJ4f90z3QCVelk8LXp6Uuxwi7hBeEE',
  //       client_secret: 'qlj7YWFbbiLc4XLg9iQ6rrRF8paSYX_00nHg9DPhC-bQ3k3rv5pKroUmOI4u94ct',
  //       code: 'AUTHORIZATION_CODE',
  //       redirect_uri: 'undefined'
  //     }
  //   };
  //   request(options, function (error, response, body) {
  //     if (error) throw new Error(error);

  //     console.log(body);
  //   });
  // },

  //  async postNewUserProfile(newUser) {
  //     const data = await fetch(`${remoteURL}/userprofiles`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Accept: "application/json",
  //       },
  //       body: JSON.stringify(newUser),
  //     });
  //     return await data.json();
  //   },

  async deleteUserProfile(id) {
    console.log("****************");
    const result = await fetch(`${remoteURL}/userprofiles/${id}`, {
      method: "DELETE",
    });
    return await result.json();
  },

  async deleteCredit(id, credits) {
    const data = await fetch(`${remoteURL}/userprofiles/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ credits }),
    });
    return await data.json();
  },

  async addCredit(id, credits) {
    const data = await fetch(`${remoteURL}/userprofiles/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ credits }),
    });
    return await data.json();
  },

  async updateCredit(editedObject) {
    return fetch(`${remoteURL}/userprofiles/${editedObject.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedObject),
    }).then((data) => data.json());
  },
  async putEditedProfile(editedObject) {
    return fetch(`${remoteURL}/userprofiles/${editedObject.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedObject),
    }).then((data) => data.json());
  },

  /*********** ROLLERCOASTERS ************/

  async getRollerCoastersWithAllExpanded(id) {
    const resp = await fetch(
      `${remoteURL}/rollercoasters/${id}?_expand=tracktype&_expand=manufacturer&_expand=park`
    );
    return await resp.json();
  },

  async getAllRollerCoastersWithAllExpanded() {
    const resp = await fetch(
      `${remoteURL}/rollercoasters?_expand=tracktype&_expand=manufacturer&_expand=park`
    );
    return await resp.json();
  },

  async postNewRollerCoaster(resource) {
    const data = await fetch(`${remoteURL}/rollercoasters`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resource),
    });
    return await data.json();
  },

  /************************ PARKS *********************/

  async postNewPark(resource) {
    const data = await fetch(`${remoteURL}/parks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resource),
    });
    return await data.json();
  },

  // async getParkWithRollerCoasters() {
  //   const data = await fetch(`${remoteURL}/parks/?_embed=rollerCoasters`);
  //   return await data.json();
  // },
  async getParks() {
    const resp = await fetch(`${remoteURL}/parks`);
    return await resp.json();
  },

  /******************** MANUFACTURERS ********************/

  async getAllManufacturers() {
    const resp = await fetch(`${remoteURL}/manufacturers`);
    return await resp.json();
  },

  // async getManufacturerWithRollerCoaster() {
  //   const data = await fetch(
  //     `${remoteURL}/manufacturers/?_embed=rollerCoasters`
  //   );
  //   return await data.json();
  // },

  async postNewManufacturer(resource) {
    const data = await fetch(`${remoteURL}/manufacturers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resource),
    });
    return await data.json();
  },

  /*********************** TRACK TYPES ******************/

  async getTrackTypes() {
    const resp = await fetch(`${remoteURL}/tracktype`);
    return await resp.json();
  },

  // async getRollerCoastersWithTrackType() {
  //   const data = await fetch(`${remoteURL}/trackTypes/?_embed=rollerCoasters`);
  //   return await data.json();
  // },

  async postNewTrackType(resource) {
    const data = await fetch(`${remoteURL}/tracktype`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resource),
    });
    return await data.json();
  },

  /***************** MESSAGES ********************/

  async getAllMessages() {
    const resp = await fetch(`${remoteURL}/messages?_expand=user`);
    return await resp.json();
  },

  async updateMessagesPut(editedObject) {
    const data = await fetch(`${remoteURL}/messages/${editedObject.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedObject),
    });
    return await data.json();
  },

  async postMessage(newObject) {
    const data = await fetch(`${remoteURL}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newObject),
    });
    return await data.json();
  },

  /******************** Database Check API calls on AddNewForm ***********************/

  async getParkByName(park) {
    const resp = await fetch(`${remoteURL}/parks?name=${park}`);
    return await resp.json();
  },
  async getManufacturerByName(manufacturer) {
    const resp = await fetch(`${remoteURL}/manufacturers?name=${manufacturer}`);
    return await resp.json();
  },
  async getTrackTypeByByName(trackType) {
    const resp = await fetch(`${remoteURL}/tracktype?name=${trackType}`);
    return await resp.json();
  },
};

export default ApiManager;
