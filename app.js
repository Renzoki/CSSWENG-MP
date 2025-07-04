const express = require("express")
const app = express()
const hbs = require("handlebars")
const path = require('path')

const PORT = process.env.port || 3000

// Templates and Static Files
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'templates'));
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
    res.render("login")
})

app.get("/forgot", (req, res) => {
    res.render("forgot")
})

app.get("/drafts", (req, res) => {
    res.render("drafts")
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

