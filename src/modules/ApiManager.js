const remoteURL = "http://localhost:8200";


const ApiManager = {

  async getRollerCoastersWithAllExpanded(id) {
    const resp = await fetch(`${remoteURL}/rollerCoasters/${id}?_expand=trackType&_expand=manufacturer&_expand=park`);
    return await resp.json();
  },

  async getRollerCoasters() {
    const resp = await fetch(`${remoteURL}/rollerCoasters`);
    return await resp.json();
  },
  async getUser(id) {
    const resp = await fetch(`${remoteURL}/users/${id}`);
    return await resp.json();
  },

  async getAllUserCredits(user) {
    const resp = await fetch(`${remoteURL}/users/${user}?_expand=credits`);
    return await resp.json();
  },

  async post(newUser) {
    const data = await fetch(`${remoteURL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newUser)
    });
    return await data.json();
  },

  async postNewRollerCoaster(resource) {
    const data = await fetch(`${remoteURL}/rollerCoasters`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(resource)
    });
    return await data.json();
  },

  async getAllManufacturers() {
    const resp = await fetch(`${remoteURL}/manufacturers`);
    return await resp.json();
  },

  async getManufacturerWithRollerCoaster() {
    const data = await fetch(
      `${remoteURL}/manufacturers/?_embed=rollerCoasters`
    );
    return await data.json();
  },

  async getParkWithRollerCoasters() {
    const data = await fetch(`${remoteURL}/parks/?_embed=rollerCoasters`);
    return await data.json();
  },

  async getRollerCoastersWithTrackType() {
    const data = await fetch(`${remoteURL}/trackTypes/?_embed=rollerCoasters`);
    return await data.json();
  },

  async getAllMessages() {
    const resp = await fetch(`${remoteURL}/messages`);
    return await resp.json();
  },

  async updateMessagesPut(editedObject) {
    const data = await fetch(`${remoteURL}/messages/${editedObject.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(editedObject)
    });
    return await data.json();
  },

  async postMessage(newObject) {
    const data = await fetch(`${remoteURL}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newObject)
    });
    return await data.json();
  }
};

export default ApiManager;
