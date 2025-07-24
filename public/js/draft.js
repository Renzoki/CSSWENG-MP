const listContainer = document.querySelector("#list-items-container");
const searchBar = document.querySelector("#search-bar");
const modalContainer = document.querySelector("#modal-overlay");
const yes = document.querySelector("#confirmation-yes");
const no = document.querySelector("#confirmation-no");

searchBar.value = "";

let allArticles = [];

// Fetch only finished or unfinished
const fetchArticles = async () => {
    try {
        const response = await fetch('/articles');
        const articles = await response.json();

        // Filter to only "finished" or "unfinished"
        allArticles = articles.filter(article =>
            article.status === "finished" || article.status === "unfinished"
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
        item.dataset.creationDate = article.creation_date;
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
                <img class="duplicate-icon clickable" src="assets/duplicate-draft.png" alt="">
                <img class="delete-icon clickable" src="assets/delete-draft.png" alt="">
            </div>
        `;

        listContainer.appendChild(item);
    });

    listContainer.dataset.version = "original";
};

// Search logic
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

// Modal confirmation for delete or duplicate
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
            } else if (action === "duplicate") {
                const { _id, __v, creation_date, ...copyData } = article;
                copyData.title = `Copy of ${article.title}`;
                try {
                    const res = await fetch('/articles', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(copyData)
                    });
                    const result = await res.json();
                    if (res.ok) alert("Successfully duplicated article!");
                    fetchArticles();
                } catch (err) {
                    console.error("Duplicate failed:", err);
                }
            }

            modalContainer.classList.add("hidden");
        } else if (event.target === no || event.target === modalContainer) {
            modalContainer.classList.add("hidden");
        }
    }, { once: true });
};

// Handle clicks on list items
listContainer.addEventListener("click", async(e) => {
    const item = e.target.closest(".list-item");
    if (!item) return;

    const title = item.dataset.title;
    const creation_date = item.dataset.creationDate;

    const article = allArticles.find(
        a => a.title === title && a.creation_date === creation_date
    );
    if (!article) return;

    if (e.target.classList.contains("delete-icon")) {
        confirmModal("delete", article);
    }

    if (e.target.classList.contains("duplicate-icon")) {
        confirmModal("duplicate", article);
    }

    if (e.target.classList.contains("status-info")) {
    const status = e.target;
    const item = status.closest(".list-item");
    const id = item.dataset.id;

    const newStatus = status.classList.contains("finished") ? "unfinished" : "finished";

    try {
        const res = await fetch(`/articles/status/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus })
        });

        const result = await res.json();

        if (res.ok) {
            // Update badge UI
            status.classList.remove("finished", "unfinished");
            status.classList.add(newStatus);
            status.textContent = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
            status.style.backgroundColor = newStatus === "finished" ? "#52914E" : "#CD3546";

            // Show confirmation alert
            alert(`Status changed to ${newStatus}`);
        } else {
            alert(result.message || "Failed to update status.");
        }
    } catch (err) {
        console.error("Failed to update status:", err);
        alert("Error updating status.");
    }
    }
});

// Initial load
document.addEventListener("DOMContentLoaded", fetchArticles);
