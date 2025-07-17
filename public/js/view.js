const listContainer = document.querySelector("#list-items-container")
let copyOfList


// DUPLICATE, DELETE, and CONFIRMATION LOGIC
const modalContainer = document.querySelector('#modal-overlay');
const modalBox = document.querySelector("#modal")
const yes = document.querySelector("#confirmation-yes")
const no = document.querySelector("#confirmation-no")

listContainer.addEventListener("click", (e) => {
    if (e.target.className.includes("article-item")) { //TODO: INSERT BACKEND STUFF HERE (VIEW)
       //view page API call
    }
    else if (e.target.className.includes("archive-icon")) {
        actionController(e, archiveItem, "archive") //confirm and archive
    }
    else if (e.target.className.includes("edit-icon")) { //TODO: INSERT BACKEND STUFF HERE (EDIT)
       //edit page API call
    }
    else if (e.target.className.includes("delete-icon")) { //confirm and delete
        actionController(e, deleteItem, "delete")
        //delete api call
    }
})

const actionController = (e, func, action) => {
    const element = e.target.parentNode.parentNode //get element
    const articleTitle = element.querySelector(".article-item") //get title 
    const actionName = document.querySelector("#action-container-span")
    const popupArticleName = document.querySelector("#article-title-span")

    actionName.textContent = action
    popupArticleName.textContent = articleTitle.textContent //assign title to popup
    modalContainer.classList.remove('hidden'); //show popup

    modalContainer.addEventListener('click', w => {
        if (w.target === yes) {
            func(element)
            modalContainer.classList.add('hidden');
        } else if (w.target === no) {
            modalContainer.classList.add('hidden');
        }
        else if (w.target === modalContainer) {
            modalContainer.classList.add('hidden');
        }
    }, { once: true })
}

const archiveItem = (originalItem) => {
    if (listContainer.dataset.version === "original") {
        const copyOfItem = originalItem.cloneNode(true)
        let title = copyOfItem.querySelector(".article")
        title.textContent = `Copy of ${title.textContent.trim()}`
        listContainer.insertBefore(copyOfItem, originalItem)
    } else if (listContainer.dataset.version === "copy") {
        const copyOfItem = originalItem.cloneNode(true)
        let title = copyOfItem.querySelector(".article")
        title.textContent = `Copy of ${title.textContent}`
        listContainer.insertBefore(copyOfItem, originalItem)
        copyOfList.splice(copyOfList.indexOf(originalItem) + 1, 0, copyOfItem)
    }
}

const deleteItem = (item) => {
    listContainer.removeChild(item)

    if(listContainer.dataset.version === "copy")
        copyOfList.splice(copyOfList.indexOf(item), 1)
}