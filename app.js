const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const app = express();


var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session');

const port = 5000;

const {getHomePage} = require('./routes/index');
const {showNotificationPage} = require('./routes/show-notification') ;
const {addNotificationPage, addNotification, deleteNotification, editNotification, editNotificationPage} = require('./routes/notification');

const {showUserPage} = require('./routes/show-user') ;
const {addUserPage, addUser, deleteUser, editUser, editUserPage} = require('./routes/user');

//login stuff


// create connection to database
// the mysql.createConnection function takes in a configuration object which contains host, user, password and the database name.
const db = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'rememe'
});

// connect to database
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});
global.db = db;

// configure middleware
app.set('port', process.env.port || port); // set express to use this port
app.set('views', __dirname + '/views'); // set express to look in this folder to render our view
app.set('view engine', 'ejs'); // configure template engine
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // parse form data client
app.use(express.static(path.join(__dirname, 'public'))); // configure express to use public folder
app.use(fileUpload()); // configure fileupload
//login stuff
app.use(morgan('dev'));
app.use(cookieParser());

app.use(session({
    secret: 'justasecret',
    resave:true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());



// routes for the app

app.get('/', getHomePage);
app.get('/add', addNotificationPage);
app.get('/edit/:id', editNotificationPage);
app.get('/delete/:id', deleteNotification);
app.get('/show', showNotificationPage);
app.post('/add', addNotification);
app.post('/edit/:id', editNotification);

app.get('/adduser', addUserPage);
app.get('/edituser/:id', editUserPage);
app.get('/deleteuser/:id', deleteUser);
app.get('/showuser', showUserPage);
app.post('/adduser', addUser);
app.post('/edituser/:id', editUser);


//-------------------------START of login section

require('./config/passport')(passport);
require('./app/routes.js')(app, passport);


//-------------------------END of login section

// set the app to listen on the port
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});