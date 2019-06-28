const express = require('express');
const path = require('path');
const exphbs  = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');

const app = express();

// Load exported Routes which belongs to /ideas
const ideas = require("./routes/ideas"); 

// Load exported Routes which belongs to /users
const users = require("./routes/users");

//Passport config
require("./config/passport")(passport);


// Map global promise - get rid of warning
mongoose.Promise = global.Promise;
//connect to  mongoose
mongoose.connect('mongodb://localhost/vidide-dev', {
  useNewUrlParser: true
}/*{
  useMongoClient: true
} -no longer needed*/
)
.then(()=> console.log('MongoDB connected... '))
.catch(err => console.log(err));

// Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static folder
app.use(express.static(path.join(__dirname, "public"))); /*sets the public folder to be the express static*/

// Method override middleware
app.use(methodOverride('_method'));

// Express session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Flash middleware
app.use(flash());

// Global variables
app.use(function(req, res, next){
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

// ***************ROUTES******************
// Index Route
app.get('/', (req, res) => {
  const title = 'Welcome';
  res.render('index', {
    title: title
  });
});

// About Route
app.get('/about', (req, res) => {
  res.render('about');
});


// Use Routes which were exported
app.use("/ideas", ideas);
app.use("/users", users);


const port = process.env.PORT || 5000;

app.listen(port, () =>{
  console.log(`Server started on port ${port}`);
});