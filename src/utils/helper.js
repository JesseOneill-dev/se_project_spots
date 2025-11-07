export function setButtonText(
  btn,
  isLoading,
  loadingText = "Saving...",
  defaultText = "Save"
) {
  if (isLoading) {
    btn.textContent = loadingText;
  } else {
    btn.textContent = defaultText;
  }
}

export function setDelButtonText(
  btn,
  isLoading,
  loadingText = "Deleting...",
  defaultText = "Delete"
) {
  if (isLoading) {
    btn.textContent = loadingText;
  } else {
    btn.textContent = defaultText;
  }
}
