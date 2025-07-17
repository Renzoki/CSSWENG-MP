document.addEventListener("DOMContentLoaded", () => {
  const currentPath = window.location.pathname.split("/")[1]; // e.g., "home"
  const currentSelected = document.querySelectorAll(`.${currentPath}`);

  currentSelected[0].querySelector(".navbutton").classList.add("selected")
  console.log(currentPath)
  console.log(currentSelected[0].querySelector(".navbutton"))
});