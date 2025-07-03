const form = document.querySelector("#forms")


form.addEventListener("submit", (e) => {
    const email = form.email.value
    const password = form.password.value

    if(email < 11){ //If the length of the submitted email is too short
        e.preventDefault();
        alert("Email must be atleast 11 characters long");
        return;
    }  

    //TODO: API call to server (wala pang route for this)
    if(password){
        console.log("Password is provided, ready for API call")
    }
})