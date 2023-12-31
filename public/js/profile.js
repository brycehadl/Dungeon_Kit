const newFormHandler = async (event) => {
  event.preventDefault();

  document.location.replace("/character");
};

const delButtonHandler = async (event) => {
  if (event.target.hasAttribute("data-id")) {
    const id = event.target.getAttribute("data-id");

    const response = await fetch(`/api/characters/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      document.location.replace("/profile");
    } else {
      alert("Failed to delete character!");
    }
  }
};

document
  .querySelector(".new-character")
  .addEventListener("click", newFormHandler);

document
  .querySelector(".character-list")
  .addEventListener("click", delButtonHandler);
