const listContainer = document.querySelector("#list-items-container");
const searchBar = document.querySelector("#search-bar");
const modalContainer = document.querySelector("#modal-overlay");
const yes = document.querySelector("#confirmation-yes");
const no = document.querySelector("#confirmation-no");

searchBar.value = "";
let allArticles = [];

// Fetch only published
const fetchArticles = async () => {
    try {
        const response = await fetch('/articles');
        const articles = await response.json();

        // Filter only published
        allArticles = articles.filter(article =>
            article.status === "posted" || article.status === "published"
        );

        renderArticles(allArticles);
    } catch (err) {
        console.error("Failed to fetch articles:", err);
    }
};

const renderArticles = (articles) => {
    listContainer.innerHTML = "";

    articles.forEach(article => {
        const item = document.createElement("div");
        item.className = "list-item";
        item.dataset.title = article.title;
        item.dataset.publishDate = article.publish_date;
        item.dataset.id = article._id;

        const formattedDate = article.publish_date
            ? new Date(article.publish_date).toLocaleDateString("en-US")
            : "N/A";

        item.innerHTML = `
            <div class="date cell date-item">${formattedDate}</div>
            <div class="article cell article-item">${article.title}</div>
            <div class="status cell status-item">
                <div class="status-info ${article.status}">
                    ${article.status.charAt(0).toUpperCase() + article.status.slice(1)}
                </div>
            </div>
            <div class="spacing-div cell">
                <img class="archive-icon clickable" src="assets/archive-icon.png" alt="">
                <img class="edit-icon clickable" src="assets/edit-icon.png" alt="">
                <img class="delete-icon clickable" src="assets/delete-draft.png" alt="">
            </div>
        `;

        listContainer.appendChild(item);
    });

    listContainer.dataset.version = "original";
};

// Search
searchBar.addEventListener("input", () => {
    const query = searchBar.value.toLowerCase();

    if (query) {
        const results = allArticles.filter(article =>
            article.title.toLowerCase().includes(query)
        );
        renderArticles(results);
    } else {
        renderArticles(allArticles);
    }
});

// Modal actions
const confirmModal = (action, article) => {
    const actionName = document.querySelector("#action-container-span");
    const popupArticleName = document.querySelector("#article-title-span");

    actionName.textContent = action;
    popupArticleName.textContent = article.title;
    modalContainer.classList.remove("hidden");

    modalContainer.addEventListener("click", async (event) => {
        if (event.target === yes) {
            if (action === "delete") {
                try {
                    const res = await fetch(`/articles/${article._id}`, {
                        method: 'DELETE'
                    });
                    const result = await res.json();
                    alert(result.message);
                    fetchArticles();
                } catch (err) {
                    console.error("Delete failed:", err);
                }
            } else if (action === "archive") {
                try {
                    const res = await fetch(`/articles/status/${article._id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ status: "archived" })
                    });
                    const result = await res.json();
                    alert(result.message);
                    fetchArticles();
                } catch (err) {
                    console.error("Archive failed:", err);
                }
            }

            modalContainer.classList.add("hidden");
        } else if (event.target === no || event.target === modalContainer) {
            modalContainer.classList.add("hidden");
        }
    }, { once: true });
};

// Handle item clicks
listContainer.addEventListener("click", (e) => {
    const item = e.target.closest(".list-item");
    if (!item) return;

    const id = item.dataset.id;
    const article = allArticles.find(a => a._id === id);
    if (!article) return;

    if (e.target.classList.contains("delete-icon")) {
        confirmModal("delete", article);
    }

    if (e.target.classList.contains("archive-icon")) {
        confirmModal("archive", article);
    }

    if (e.target.classList.contains("edit-icon")) {
        //TEMPORARY, IDK WHERE TO REDIRECT
        window.location.href = `/articles/createPage/${article._id}`;
    }
});

document.addEventListener("DOMContentLoaded", fetchArticles);
