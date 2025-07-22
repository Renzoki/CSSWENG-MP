const form = document.querySelector("form")
const warning = document.querySelector(".warning")

form.addEventListener("submit", (e) => {
    e.preventDefault();
    if(checkPasswordRequirements())
        popUpConfirmation()
})

form.newPassword.addEventListener("input", (e) => {
    checkPasswordRequirements()
})

form.confirmPassword.addEventListener("input", (e) => {
    checkPasswordRequirements()
})

const popUpConfirmation = () => {
    const modalContainer = document.querySelector("#modal-overlay")
    const yes = document.querySelector(".yes")
    const no = document.querySelector(".no")

    modalContainer.classList.remove('hidden');
    modalContainer.addEventListener('click', w => {
        if (w.target === yes) {
            //TODO: Insert API call here
            modalContainer.classList.add('hidden');
        } else if (w.target === no) {
            modalContainer.classList.add('hidden');
        }
        else if (w.target === modalContainer) {
            modalContainer.classList.add('hidden');
        }
    }, { once: true })
}

const checkPasswordRequirements = () => {
    if (isTooShort()) {
        warning.textContent = "*Your password is too short."
        warning.classList.remove("hidden")
    } else if (isTooLong()) {
        warning.textContent = "*Your password is too long."
        warning.classList.remove("hidden")
    } else if (hasNoNumber()) {
        warning.textContent = "*Please include numbers in your password."
        warning.classList.remove("hidden")
    } else if (hasNoUppercase()) {
        warning.textContent = "*Please include uppercase letters in your password."
        warning.classList.remove("hidden")
    } else if (hasNoLowercase()) {
        warning.textContent = "*Please include lowercase letters in your password."
        warning.classList.remove("hidden")
    } else if (hasNoSymbol()) {
        warning.textContent = "*Please include symbols in your password."
    } else if (isNotMatching()) {
        warning.textContent = "*Your passwords do not match!"
        warning.classList.remove("hidden")
    } else {
        warning.classList.add("hidden")
        return true
    }

    return false
}

const isNotMatching = () => form.newPassword.value !== form.confirmPassword.value
const isTooShort = () => form.newPassword.value.length < 8
const isTooLong = () => form.newPassword.value.length > 30
const hasNoUppercase = () => !/[A-Z]/.test(form.newPassword.value)
const hasNoLowercase = () => !/[a-z]/.test(form.newPassword.value)
const hasNoNumber = () => !/\d/.test(form.newPassword.value)
const hasNoSymbol = () => !/[^A-Za-z0-9]/.test(form.newPassword.value)
