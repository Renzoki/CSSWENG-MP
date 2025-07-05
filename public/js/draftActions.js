const listContainer = document.querySelector("#list-items-container")

//SEARCH LOGIC
const searchBar = document.querySelector("#search-bar")

searchBar.value = ""
let copyOfList

searchBar.addEventListener("input", (e) => {
    if (searchBar.value) {
        if (listContainer.dataset.version === "original") {
            copyOfList = Array.from(listContainer.children).map(child => child.cloneNode(true));
        }
        listContainer.dataset.version = "copy"
        listContainer.innerHTML = ""

        const searchResult = searchArticles(searchBar.value)
        searchResult.forEach(item => {
            listContainer.append(item)
        })

    } else {
        listContainer.dataset.version = "original"
        listContainer.innerHTML = ""
        copyOfList.forEach(item => {
            listContainer.append(item)
        })
    }
})

const searchArticles = (query) => {
    let queriedItems = []
    query = query.toLowerCase()

    copyOfList.forEach(article => {
        title = article.querySelector(".article").textContent.toLowerCase()
        if (title.includes(query)) {
            queriedItems.push(article)
        }
    })

    return queriedItems
}

listContainer.addEventListener("click", (e) => {
    if (e.target.className.includes("duplicate-icon")) {
        if (listContainer.dataset.version === "original") { //copy to copyList while duplicating in original
            copyOfList = Array.from(listContainer.children).map(child => child.cloneNode(true));
        } else if (listContainer.dataset.version === "copy") { //copy to original while duplicating during search
            console.log(copyOfList)
            duplicateItem(e.target.parentNode.parentNode, "copy")
            console.log(copyOfList)

        }
    }

    if (e.target.className.includes("delete-icon")) {
        if (listContainer.dataset.version === "original") {
            copyOfList = Array.from(listContainer.children).map(child => child.cloneNode(true));
        }
    }
})

// DUPLICATE AND DELETE ITEMS LOGIC 
listContainer.addEventListener("click", (e) => {
    if (e.target.className.includes("duplicate-icon")) {
        duplicateItem(e.target.parentNode.parentNode, "original")
    }

    if (e.target.className.includes("delete-icon")) {
        deleteItem(e.target.parentNode.parentNode, "original")
    }
})

const duplicateItem = (originalItem, version) => {
    if (version === "original") {
        const copyOfItem = originalItem.cloneNode(true)
        let title = copyOfItem.querySelector(".article")
        title.textContent = `Copy of ${title.textContent.trim()}`
        listContainer.insertBefore(copyOfItem, originalItem)
    } else if (version === "copy") {
        const copyOfItem = originalItem.cloneNode(true)
        let title = copyOfItem.querySelector(".article")
        title.textContent = `Copy of ${title.textContent}`
        copyOfList.splice(copyOfList.indexOf(originalItem) + 1, 0, copyOfItem)
    }
}

const deleteItem = (item, version) => {
    if (version === "original")
        listContainer.removeChild(item)
    else if (version === "copy")
        copyOfList.removeChild(item)
}
