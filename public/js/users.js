const forms = document.querySelector("#add-user-forms")
const newUserButton = document.querySelector("#add-new-account-button")
const modalContainerAdd = document.querySelector("#modal-overlay-add-user")
const modalContainerDel = document.querySelector("#modal-overlay-delete-user")
const listContainer = document.querySelector("#list-items-container")

forms.addEventListener("submit", (e) => {
    e.preventDefault()
})

//ADD A NEW USER
newUserButton.addEventListener("click", (e) => {
    modalContainerAdd.classList.remove('hidden');
})

const popUpConfirmation = () => {
    const yes = document.querySelector(".yes")
    const no = document.querySelector(".no")

    modalContainerAdd.addEventListener('click', w => {
        if (w.target === yes) {
            newUserElement = createUserElement("2/14/2005", forms.newUserEmail.value)
            listContainer.append(newUserElement)
            //TODO: Insert submit logic here
            modalContainerAdd.classList.add('hidden');
        } else if (w.target === no) {
            modalContainerAdd.classList.add('hidden');
        }
        else if (w.target === modalContainerAdd) {
            modalContainerAdd.classList.add('hidden');
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

//DELETE AN EXISTING USER 
listContainer.addEventListener("click", (e) => {
    if (e.target = document.querySelector(".delete-icon")) {
        const yes = document.querySelector(".delete-yes")
        const no = document.querySelector(".delete-no")

        modalContainerDel.classList.remove("hidden")
        const item = e.target.parentNode.parentNode
        const username = item.querySelector(".name-item").textContent
        const usernameHolder = modalContainerDel.querySelector("#username-placeholder")

        usernameHolder.textContent = username

        modalContainerDel.addEventListener('click', w => {
            if (w.target === yes) {
                listContainer.removeChild(item)
                //TODO: Insert delete logic here
                modalContainerDel.classList.add('hidden');
            } 
            modalContainerDel.classList.add('hidden'); //close the window regardless 
        }, { once: true })
    }
})
