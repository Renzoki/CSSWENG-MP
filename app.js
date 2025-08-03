const express = require("express")
const app = express()
const hbs = require("handlebars")
const path = require('path')
const authRoutes = require('./routes/authRoutes')
const articleRoutes = require('./routes/articleRoutes')
const authController = require('./controllers/authController')
const uploadRoutes = require('./routes/uploadRoutes');
const mainWebRoutes = require('./routes/mainWebRoutes');
const connectDB = require('./config/connect')
const webRoutes = require('./routes/webRoutes');




const PORT = process.env.PORT || 3000

//Connect to db
connectDB();

// Templates and Static Files
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'templates'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('public/uploads'));  // serve files

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
<<<<<<< Updated upstream
<<<<<<< Updated upstream
app.use('/uploads', uploadRoutes);
app.use('/web', webRoutes);                    
=======
=======
>>>>>>> Stashed changes
app.use('/uploads', uploadRoutes);     
app.use('/mainWeb', mainWebRoutes);  

app.use('/', mainWebRoutes);
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes

app.get("/forgot", (req, res) => {
    res.render("ADMIN/forgot")
})

app.get("/drafts",authController.isAuthenticated, (req, res) => {
    res.render("ADMIN/drafts")
})

app.get("/view",authController.isAuthenticated, (req, res) => {
    res.render("ADMIN/view")
})

app.get("/published",authController.isAuthenticated, (req, res) => {
    res.render("ADMIN/published")
})

app.get("/users",authController.isAuthenticated, (req, res) => {
    res.render("ADMIN/users")
})

app.get("/account",authController.isAuthenticated, (req, res) => {
    res.render("ADMIN/account")
})

app.get("/create",authController.isAuthenticated, (req, res) => {
    res.render("ADMIN/create")
})

app.get("/post",authController.isAuthenticated, (req, res) => {
  res.render("ADMIN/post");
});

//FOR TESTING MAIN WEB PAGES ONLY 
app.get("/AboutUs", (req, res) => {
  res.render("Main/AboutUs");
});

app.get("/ArticlePage", (req, res) => {
  res.render("Main/ArticlePage");
});

app.get("/Dance", (req, res) => {
  res.render("Main/Dance");
});

app.get("/Faculty", (req, res) => {
  res.render("Main/Faculty");
});

app.get("/", (req, res) => {
  res.render("Main/index");
});

app.get("/Music", (req, res) => {
  res.render("Main/Music");
});

app.get("/News", (req, res) => {
  res.render("Main/News");
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})




