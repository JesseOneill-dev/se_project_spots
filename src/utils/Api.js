// utils/Api.js

export default class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  //TODO- Create another method, getUserInfo (different base url)

  getAppInfo() {
    //TODO- Call getUserInfo in this array
    this.getUserInfo();
    return Promise.all([this.getInitialCards()]);
  }

  getUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "GET",
      headers: this._headers,
    }).then((res) => {
      if (res.ok) {
        return res.json();
        // console.log(res);
      }
      return Promise.reject(`Error: ${res.status}`);
    });
  }

  getInitialCards() {
    // ...
    return fetch(`${this._baseUrl}/cards`, {
      headers: this._headers,
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Error: ${res.status}`);
    });
  }

  // TODO- implement POST /cards

  addCards({ link, name }) {
    return fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({
        link,
        name,
      }),
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Error: ${res.status}`);
    });
  }

  editUserInfo({ name, about }) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        name,
        about,
      }),
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      Promise.reject(`Error: ${res.status}`);
    });
  }

  editAvatarInfo(avatar) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        avatar,
      }),
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      Promise.reject(`Error: ${res.status}`);
    });
  }

  deleteCard(id) {
    return fetch(`${this._baseUrl}/cards/${id}`, {
      method: "DELETE",
      headers: this._headers,
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      Promise.reject(`Error: ${res.status}`);
    });
  }

  toggleLike(id, isLiked) {
    const method = isLiked ? "DELETE" : "PUT";
    return fetch(`${this._baseUrl}/cards/${id}/likes`, {
      method: method,
      headers: this._headers,
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      Promise.reject(`Error: ${res.status}`);
    });
  }

  // Create another method, getUserInfo (different base url)
}

// DELETE https://around-api.en.tripleten-services.com/v1/cards/cardId
