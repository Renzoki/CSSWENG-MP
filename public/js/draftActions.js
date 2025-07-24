// const listContainer = document.querySelector("#list-items-container")
// const searchBar = document.querySelector("#search-bar")

// searchBar.value = ""
// let currentArticles = [];

// //FETCH ARTICLES FROM DATABASE
// const fetchArticles = async() => {
//     try{
//         const response = await fetch('/articles');
//         const articles = await response.json();
//         currentArticles = articles;
//         renderArticles(currentArticles);
//     }catch(err){
//         console.error("Failed to fetch articles: " ,err);
//     }
// }

// const renderArticles = (articles) => {
//     listContainer.innerHTML = "";

//     articles.forEach(article => {
//         const item = document.createElement("div");
//         item.className = "list-item";

//         item.dataset.title = article.title;
//         item.dataset.creationDate = article.creation_date;

//         const formattedDate = article.publish_date //To truncate extra info
//             ? new Date(article.publish_date).toLocaleDateString("en-US")
//             : "N/A";

//         const statusClass = article.status;

//         item.innerHTML = `
//             <div class="date cell date-item"">${formattedDate|| 'N/A'}</div>
//             <div class="article cell article-item">${article.title}</div>
//             <div class="status cell status-item">
//                 <div class="status-info ${statusClass}">
//                     ${statusClass.charAt(0).toUpperCase() + statusClass.slice(1)}
//                 </div>
//             </div>
//             <div class="spacing-div cell">
//                 <img class="duplicate-icon clickable" src="assets/duplicate-draft.png" alt="">
//                 <img class="delete-icon clickable" src="assets/delete-draft.png" alt="">
//             </div>
//         `;

//         listContainer.appendChild(item);
//     });
    
//     copyOfList = Array.from(listContainer.children).map(child => child.cloneNode(true));
//     listContainer.dataset.version = "original";
// }

// //SEARCH LOGIC
// searchBar.addEventListener("input", (e) => {
//     if (searchBar.value) {
//         if (listContainer.dataset.version === "original") {
//             copyOfList = Array.from(listContainer.children).map(child => child.cloneNode(true));
//         }
//         listContainer.dataset.version = "copy"
//         listContainer.innerHTML = ""

//         const searchResult = searchArticles(searchBar.value)
//         searchResult.forEach(item => {
//             listContainer.append(item)
//         })

//     } else {
//         listContainer.dataset.version = "original"
//         listContainer.innerHTML = ""
//         copyOfList.forEach(item => {
//             listContainer.append(item)
//         })
//     }
// })

// const searchArticles = (query) => {
//     let queriedItems = []
//     query = query.toLowerCase()

//     copyOfList.forEach(article => {
//         title = article.querySelector(".article").textContent.toLowerCase()
//         if (title.includes(query)) {
//             queriedItems.push(article)
//         }
//     })

//     return queriedItems
// }

// //CLICK HANDLER
// listContainer.addEventListener("click", async (e) => {
//     const item = e.target.closest(".list-item");
//     if (!item) return;

//     const title = item.dataset.title;
//     const creation_date = item.dataset.creationDate;

//     //DELETE
//     if (e.target.className.includes("delete-icon")) {
//         try{
//             const response = await fetch('/articles/delete',{
//                 method: 'DELETE',
//                 headers: {'Content-Type': 'application/json'},
//                 body: JSON.stringify({ title,creation_date})
//             });

//             const result = await response.json();
//             alert(result.message);
//             fetchArticles()
//         }catch (err){
//             console.error("Delete failed: ",err);
//         }
//     }

//     //DUPLICATE
//     if (e.target.classList.contains("duplicate-icon")) {
//     const original = currentArticles.find(a =>
//         a.title === title && a.creation_date === creation_date
//     );

//     if (original) {
//         const { _id, __v, creation_date, ...copyData } = original; //fields that shouldnt be copied
//         copyData.title = `Copy of ${original.title}`;

//             try {
//                 const res = await fetch('/articles', {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify(copyData)
//                 });

//                 const result = await res.json();
                
//                 if(res.ok){
//                     alert("Successfully duplicated article!");
//                 }

//                 fetchArticles(); 
//             } catch (err) {
//                 console.error("Failed to duplicate article:", err);
//             }
//         }
//     }
// })

// //Fetch articles listener
// document.addEventListener("DOMContentLoaded", fetchArticles); 