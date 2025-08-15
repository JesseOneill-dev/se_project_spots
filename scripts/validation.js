const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "modal__button_disabled",
  inputErrorClass: "modal__error",
  errorClass: "modal__error_visible",
};

const showInputError = (formElement, inputElement, errorMsg) => {
  const errorMsgID = inputElement.id + "-error";
  const errorMsgEL = document.querySelector("#" + errorMsgID);
  errorMsgEL.textContent = errorMsg;
  inputElement.classList.add("modal__input_type_error");
};

const hideInputError = (formElement, inputElement) => {
  const errorMsgID = inputElement.id + "-error";
  const errorMsgEL = document.querySelector("#" + errorMsgID);
  errorMsgEL.textContent = "";
  inputElement.classList.remove("modal__input_type_error");
};

const checkInputValidity = (formEl, inputElement) => {
  if (!inputElement.validity.valid) {
    showInputError(formEl, inputElement, inputElement.validationMessage);
  } else {
    hideInputError(formEl, inputElement);
  }
};

const hasInvalidInput = (inputList) => {
  return inputList.some((input) => {
    return !input.validity.valid;
  });
};

const toggleButtonState = (inputList, buttonElement) => {
  if (hasInvalidInput(inputList)) {
    disableButton(buttonElement);
    buttonElement.classList.add("modal__button_disabled");
  } else {
    buttonElement.disabled = false;
    buttonElement.classList.remove("modal__button_disabled");
  }
};

const disableButton = (buttonElement) => {
  buttonElement.disabled = true;
};

const setEventListeners = (formElement, config) => {
  const inputList = Array.from(
    formElement.querySelectorAll(config.inputSelector)
  );
  const buttonElement = formElement.querySelector(config.submitButtonSelector);
  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", function () {
      checkInputValidity(formElement, inputElement, config);
      toggleButtonState(inputList, buttonElement, config);
    });
  });

  toggleButtonState(inputList, buttonElement, config);
};

const enableValidation = (config) => {
  const formList = document.querySelectorAll(config.formSelector);
  formList.forEach((formEl) => {
    setEventListeners(formEl, config);
  });
};

enableValidation(settings);
