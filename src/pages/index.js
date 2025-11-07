import "./index.css";
import "../scripts/validation.js";
import {
  disableButton,
  settings,
  resetInputError,
} from "../scripts/validation.js";
("../scripts/validation.js");
import Api from "../utils/Api.js";
import { setButtonText, setDelButtonText } from "../utils/helper.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "286500a4-5aaf-4e51-95bd-3eeb8016679a",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, userData]) => {
    cards.forEach(function (item) {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });

    profileImageEl.src = userData.avatar;
    profileNameEl.textContent = userData.name;
    profileDescriptionEl.textContent = userData.about;
  })
  .catch((err) => {
    console.error(err);
  });

const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editSubmitModal = editProfileModal.querySelector(".modal__form");
const editInputModal = editProfileModal.querySelectorAll(".modal__input");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);

const newPostBtn = document.querySelector(".profile__add-btn");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const newPostModal = document.querySelector("#new-post-modal");
const addCardFormElement = newPostModal.querySelector(".modal__form");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");
const newInputModal = newPostModal.querySelectorAll(".modal__input");
const newNameInput = newPostModal.querySelector("#modal-description-input");
const newLinkInput = newPostModal.querySelector("#card-image-input");
const cardSubmitBtn = newPostModal.querySelector(".modal__btn");

const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");
const profileImageEl = document.querySelector(".profile__avatar");

const previewModal = document.querySelector("#preview-modal");
const previewModalCloseBtn = previewModal.querySelector(".modal__close-btn");
const previewImageEl = previewModal.querySelector(".modal__image");
const previewNameEl = previewModal.querySelector(".modal__caption");

const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

// Avatar form elements
const avatarModal = document.querySelector("#avatar-modal");
const avatarFormElement = avatarModal.querySelector(".modal__form");
const avatarCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarSubmitBtn = avatarModal.querySelector(".modal_btn-del");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");

// Delete form elements
const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form");
const deleteCloseBtn = deleteModal.querySelector(".modal__close-btn");
const deleteCancelBtn = deleteModal.querySelector(".modal__btn-cancel");

let selectedCard;
let selectedCardId;

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeEl = cardElement.querySelector(".card__like-btn");

  data.isLiked
    ? cardLikeEl.classList.add("card__like-btn_active")
    : console.log("not liked");

  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;

  function handleLike(evt, id) {
    evt.preventDefault();
    const isLiked = evt.target.classList.contains("card__like-btn_active");
    api
      .toggleLike(id, isLiked)
      .then((res) => {
        evt.target.classList.toggle("card__like-btn_active");
      })
      .catch(console.error);
  }

  const cardLikeBtnEl = cardElement.querySelector(".card__like-btn");
  cardLikeBtnEl.addEventListener("click", (evt) => handleLike(evt, data._id));

  const cardDelBtnEl = cardElement.querySelector(".card__delete-btn");
  cardDelBtnEl.addEventListener("click", (evt) => {
    handleDeleteCard(cardElement, data._id);
  });

  cardImageEl.addEventListener("click", () => {
    previewImageEl.src = data.link;
    previewImageEl.alt = data.name;
    previewNameEl.textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
}

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", escapeModal);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", escapeModal);
}

function handleProfileFormSubmit(evt) {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  // submitBtn.textContent = "Saving...";
  setButtonText(submitBtn, true);

  api
    .editUserInfo({
      name: editProfileNameInput.value,
      about: editProfileDescriptionInput.value,
    })
    .then((data) => {
      profileNameEl.textContent = data.name;
      profileDescriptionEl.textContent = data.about;
      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  // submitBtn.textContent = "Saving...";
  setButtonText(submitBtn, true);

  api
    .addCards({ link: newLinkInput.value, name: newNameInput.value })
    .then((data) => {
      const cardElement = getCardElement(data);
      cardsList.prepend(cardElement);
      disableButton(cardSubmitBtn, settings);
      newNameInput.value = "";
      newLinkInput.value = "";
      closeModal(newPostModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  // submitBtn.textContent = "Saving...";
  setButtonText(submitBtn, true);

  api
    .editAvatarInfo(avatarInput.value)
    .then((data) => {
      console.log(data.avatar);
      profileImageEl.src = data.avatar;
      closeModal(avatarModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setDelButtonText(submitBtn, true);
  api
    .deleteCard(selectedCardId)
    .then((res) => {
      console.log(res);

      console.log(selectedCard);
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      setDelButtonText(submitBtn, false);
    });
}

function handleDeleteCard(cardElement, cardId) {
  console.log(cardId);
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
}

function escapeModal(evt) {
  if (evt.key === "Escape") {
    evt.preventDefault();
    const openedModal = document.querySelector(".modal_is-opened");
    closeModal(openedModal);
  }
}

editProfileModal.addEventListener("click", (evt) => {
  if (evt.target === evt.currentTarget) {
    closeModal(editProfileModal);
  }
});

editProfileBtn.addEventListener("click", () => {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  resetInputError(editSubmitModal, editInputModal, settings);
  openModal(editProfileModal);
});

editSubmitModal.addEventListener("submit", handleProfileFormSubmit);
addCardFormElement.addEventListener("submit", handleAddCardSubmit);

avatarModalBtn.addEventListener("click", () => {
  openModal(avatarModal);
});

avatarFormElement.addEventListener("submit", handleAvatarSubmit);
deleteForm.addEventListener("submit", handleDeleteSubmit);

editProfileCloseBtn.addEventListener("click", () => {
  closeModal(editProfileModal);
});

newPostBtn.addEventListener("click", () => {
  openModal(newPostModal);
});

newPostCloseBtn.addEventListener("click", () => {
  closeModal(newPostModal);
});

newPostModal.addEventListener("click", (evt) => {
  if (evt.target === evt.currentTarget) {
    closeModal(newPostModal);
  }
});

avatarCloseBtn.addEventListener("click", () => {
  closeModal(avatarModal);
});

deleteModal.addEventListener("click", (evt) => {
  if (evt.target === evt.currentTarget) {
    closeModal(deleteModal);
  }
});

avatarModal.addEventListener("click", (evt) => {
  if (evt.target === evt.currentTarget) {
    closeModal(avatarModal);
  }
});

previewModal.addEventListener("click", (evt) => {
  if (evt.target === evt.currentTarget) {
    closeModal(previewModal);
  }
});

previewModalCloseBtn.addEventListener("click", () => {
  closeModal(previewModal);
});

deleteCloseBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});

deleteCancelBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});
