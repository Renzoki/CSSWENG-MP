const listContainer = document.querySelector("#list-items-container")
const searchBar = document.querySelector("#search-bar")

searchBar.value = ""
let copyOfList

//FETCH ARTICLES FROM DATABASE
const fetchArticles = async() => {
    try{
        const response = await fetch('/articles');
        const articles = await response.json();
        renderArticles(articles);
    }catch(err){
        console.error("Failed to fetch articles: " ,err);
    }
}

const renderArticles = (articles) => {
    listContainer.innerHTML = "";

    articles.forEach(article => {
        const item = document.createElement("div");
        item.className = "list-item";

        const formattedDate = article.publish_date //To truncate extra info
            ? new Date(article.publish_date).toLocaleDateString("en-US")
            : "N/A";

        const statusClass = article.status === "finished" ? "finished" : "unfinished";

        item.innerHTML = `
            <div class="date cell date-item"">${formattedDate|| 'N/A'}</div>
            <div class="article cell article-item">${article.title}</div>
            <div class="status cell status-item">
                <div class="status-info ${statusClass}">
                    ${statusClass.charAt(0).toUpperCase() + statusClass.slice(1)}
                </div>
            </div>
            <div class="spacing-div cell">
                <img class="duplicate-icon clickable" src="assets/duplicate-draft.png" alt="">
                <img class="delete-icon clickable" src="assets/delete-draft.png" alt="">
            </div>
        `;

        listContainer.appendChild(item);
    });
    
    copyOfList = Array.from(listContainer.children).map(child => child.cloneNode(true));
    listContainer.dataset.version = "original";
}

//SEARCH LOGIC
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

//Fetch articles listener
document.addEventListener("DOMContentLoaded", fetchArticles); 