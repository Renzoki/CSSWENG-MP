const loginForm = document.getElementById("login-form");
const forgotForm = document.getElementById("forgot-form");

if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = loginForm.email.value.trim();
        const password = loginForm.password.value;

        if (email.length < 11) {
            alert("Email must be at least 11 characters long");
            return;
        }
        if (!password) {
            alert("Password required!");
            return;
        }

        try {
            const response = await fetch("/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                window.location.href = data.redirect;
            } else {
                alert(data.message);
            }

        } catch (error) {
            console.error(error);
            alert("Server error! Please try again.");
        }
    });
}

if (forgotForm) {
    forgotForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = forgotForm.email.value.trim();

        if (!email) {
            alert("Please enter your email.");
            return;
        }

        try {
            const response = await fetch("/forgot_password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            });

            const result = await response.json();

            if (response.ok) {
                alert("Temporary password sent to your email.");
                window.location.href = "/";
            } else {
                alert(result.error || "Something went wrong.");
            }

        } catch (err) {
            console.error(err);
            alert("Server error! Please try again.");
        }
    });
}

window.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const message = params.get('message');

    if (message) {
        setTimeout(() => {
            alert(message);
        }, 500);
    }
});
