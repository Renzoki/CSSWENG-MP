const listContainer = document.querySelector("#list-items-container")
const sortByDate = document.querySelector(".sort-date")
const sortByTitle = document.querySelector(".sort-title")
const sortByStatus = document.querySelector(".sort-status")

sortByDate.addEventListener("click", (e) => {
    let listItems = Array.from(document.querySelectorAll(".list-item")) //#1 get the list
    listContainer.innerHTML = ""
    sortDates(listItems)

    if (sortByDate.dataset.direction === "asc") {
        sortByDate.dataset.direction = "des"
        listItems.reverse()
        sortByDate.setAttribute("src", "assets/arrow-downward.png")
    } else {
        sortByDate.dataset.direction = "asc"
        sortByDate.setAttribute("src", "assets/arrow-upward.png")
    }

    listItems.forEach(item => listContainer.append(item))               //#4 put the sorted list back
})

sortByTitle.addEventListener("click", (e) => {
    let listItems = Array.from(document.querySelectorAll(".list-item")) //#1 get the list
    listContainer.innerHTML = ""
    sortTitles(listItems)                                   

    if (sortByTitle.dataset.direction === "asc") {
        sortByTitle.dataset.direction = "des"
        listItems.reverse()
        sortByTitle.setAttribute("src", "assets/arrow-downward.png")
    } else {
        sortByTitle.dataset.direction = "asc"
        sortByTitle.setAttribute("src", "assets/arrow-upward.png")
    }

    listItems.forEach(item => listContainer.append(item))               //#4 put the sorted list back
})

sortByStatus.addEventListener("click", (e) => {
    let listItems = Array.from(document.querySelectorAll(".list-item")) //#1 get the list
    listContainer.innerHTML = ""
    sortStatuses(listItems)

    if (sortByStatus.dataset.direction === "asc") {
        sortByTitle.dataset.direction = "des"
        listItems.reverse()
        sortByStatus.setAttribute("src", "assets/arrow-downward.png")
    } else {
        sortByStatus.dataset.direction = "asc"
        sortByStatus.setAttribute("src", "assets/arrow-upward.png")
    }

    listItems.forEach(item => listContainer.append(item))               //#4 put the sorted list back
})

const sortDates = (list) => { //bubble sort
    let swapped = true;
    do {
        swapped = false;
        for (let i = 1; i < list.length; i++) {
            const dateA = list[i - 1].querySelector(".date").textContent;
            const dateB = list[i].querySelector(".date").textContent;

            const [monthA, dayA, yearA] = dateA.split("/").map(Number);
            const [monthB, dayB, yearB] = dateB.split("/").map(Number);

            const dateObjA = new Date(yearA, monthA - 1, dayA);
            const dateObjB = new Date(yearB, monthB - 1, dayB);

            if (dateObjB < dateObjA) {
                const temp = list[i - 1];
                list[i - 1] = list[i];
                list[i] = temp;
                swapped = true;
            }
        }
    } while (swapped);

    return list;
};

const sortTitles = (list) => {
    let sorted = false
    while (!sorted) {
        sorted = true
        for (let i = 1; i < list.length; i++) {
            let title1 = list[i - 1].querySelector(".article").textContent
            let title2 = list[i].querySelector(".article").textContent

            if (title1 < title2) {
                const temp = list[i - 1]
                list[i - 1] = list[i]
                list[i] = temp
                sorted = false
            }
        }
    }

    return list;
}

const sortStatuses = (list) => {
    let finished = []
    let unfinished = []

    list.forEach(item => {
        if(item.querySelector(".finished"))
            finished.push(item)
        else 
            unfinished.push(item)
    })

    return finished.concat(unfinished)
}