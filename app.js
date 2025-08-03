const express = require("express")
const app = express()
const hbs = require("handlebars")
const path = require('path')
const authRoutes = require('./routes/authRoutes')
const articleRoutes = require('./routes/articleRoutes')
const authController = require('./controllers/authController')
const uploadRoutes = require('./routes/uploadRoutes');
const connectDB = require('./config/connect')


const PORT = process.env.PORT || 3000

//Connect to db
connectDB();

// Templates and Static Files
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'templates'));
app.use(express.static(path.join(__dirname, 'public')));

//Middleware
const session = require('express-session')
const MongoStore = require('connect-mongo')
app.use(express.json()) //used to parse data into a JSON
app.use(session({ //establishing a session
    secret: process.env.SESSION_SECRET || 'defaultsecret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI}),
    cookie: { maxAge: 1000 * 60 * 60 * 24 } //1 day cookie

}))


//Routes
app.use('/admin',authRoutes)
app.use('/articles',articleRoutes)
app.use('/uploads', express.static('public/uploads'));  // serve files
app.use('/uploads', uploadRoutes);                    

app.get("/forgot", (req, res) => {
    res.render("forgot")
})

app.get("/drafts",authController.isAuthenticated, (req, res) => {
    res.render("drafts")
})

app.get("/view",authController.isAuthenticated, (req, res) => {
    res.render("view")
})

app.get("/published",authController.isAuthenticated, (req, res) => {
    res.render("published")
})

app.get("/users",authController.isAuthenticated, (req, res) => {
    res.render("users")
})

app.get("/account",authController.isAuthenticated, (req, res) => {
    res.render("account")
})

app.get("/create",authController.isAuthenticated, (req, res) => {
    res.render("create")
})

app.get("/post",authController.isAuthenticated, (req, res) => {
  res.render("post");
});

app.get("/view",authController.isAuthenticated, (req, res) => {
  res.render("view");
});

app.get("/articles/createPage/:id", authController.isAuthenticated, (req, res) => {
    res.render("create");
});



app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

