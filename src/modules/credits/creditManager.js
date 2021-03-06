const remoteURL = process.env.REACT_APP_REMOTE_API_URL;

const creditManager = {
  async deleteCredit(id) {
    return await fetch(`${remoteURL}/api/credits/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer" + localStorage.getItem("accessToken"),
      },
    });
  },

  async addCredit(creditObj) {
    const data = await fetch(`${remoteURL}/api/credits`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer" + localStorage.getItem("accessToken"),
      },
      Accept: "application/json",
      body: JSON.stringify(creditObj),
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

  async getCreditIdFromApi() {
    const data = await fetch(`${remoteURL}/api/credits`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer" + localStorage.getItem("accessToken"),
      },
    });
    return await data.json();
  },
};

export default creditManager;
