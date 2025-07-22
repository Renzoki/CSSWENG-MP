//Each navbar item has a link and a class with the same name
//E.g. the drafts page navbar button has /drafts for its href and "drafts" as a class
document.addEventListener("DOMContentLoaded", () => {
  const currentPath = window.location.pathname.split("/")[1]; // e.g., "home"
  const currentSelected = document.querySelectorAll(`.${currentPath}`);

  currentSelected[0].querySelector(".navbutton").classList.add("selected") //highlights which page u are in (in the navbar)
}); 