const express = require("express")
const app = express()
const hbs = require("handlebars")
const path = require('path')
const authRoutes = require('./routes/authRoutes')
const connectDB = require('./config/connect')


const PORT = process.env.PORT || 3000

connectDB();

// Templates and Static Files
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'templates'));
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
    res.render("login")
})


app.use('/auth',authRoutes)

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})