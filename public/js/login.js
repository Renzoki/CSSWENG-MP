const form = document.querySelector("#forms")

console.log(forms.email.value)

form.addEventListener("submit", (e) => {
    if(forms.email.value.length > 11){ //If the length of the submitted email is too short
        //TODO: Warn User that their input is too short
    }  

    //TODO: API call to server (wala pang route for this)
    if(forms.password.value){
        
    }
})