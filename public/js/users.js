const forms = document.querySelector("#add-user-forms")
const newUserButton = document.querySelector("#add-new-account-button")
const modalContainer = document.querySelector("#modal-overlay")
const listContainer = document.querySelector("#list-items-container")

forms.addEventListener("submit", (e) => {
    e.preventDefault()
})

newUserButton.addEventListener("click", (e) => {
    modalContainer.classList.remove('hidden');
})

const popUpConfirmation = () => {
    const yes = document.querySelector(".yes")
    const no = document.querySelector(".no")

    modalContainer.addEventListener('click', w => {
        if (w.target === yes) {
            newUserElement = createUserElement("2/14/2005", forms.newUserEmail.value) 
            listContainer.append(newUserElement)
            console.log("BLUE")
            //TODO: Insert submit logic here
            modalContainer.classList.add('hidden');
        } else if (w.target === no) {
            modalContainer.classList.add('hidden');
        }
        else if (w.target === modalContainer) {
            modalContainer.classList.add('hidden');
        }
    })
}

const createUserElement = (date, email) => {
    const container = document.createElement("div");
    container.classList.add("list-item");

    const dateDiv = document.createElement("div");
    dateDiv.className = "date cell date-item";
    dateDiv.textContent = date;

    const nameDiv = document.createElement("div");
    nameDiv.className = "account-name cell name-item";
    nameDiv.textContent = email;

    const spacingDiv = document.createElement("div");
    spacingDiv.className = "spacing-div cell";

    const img = document.createElement("img");
    img.className = "delete-icon clickable";
    img.src = "assets/remove-icon.png";

    spacingDiv.appendChild(img);
    container.appendChild(dateDiv);
    container.appendChild(nameDiv);
    container.appendChild(spacingDiv);

    return container;
}

popUpConfirmation()