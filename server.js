require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');

const Admin = require('./models/admin');

const indexRoutes = require('./routes/index');
const collectionsRoutes = require('./routes/collections');
const filesRoutes = require('./routes/files');

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3001', credentials: true }));

// ======================================================
// DATA BASE SETUP
// ======================================================

mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://localhost:27017/savingDatabase', {
    useNewUrlParser: true,
    useFindAndModify: false
});

// ======================================================
// PASSPORT CONFIGURATION
// ======================================================

app.use(
    session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false
    })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(Admin.createStrategy());
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());

// ======================================================
// ROUTES
// ======================================================

app.use('/', indexRoutes);
app.use('/collections/:typeOfFile', collectionsRoutes);
app.use('/:typeOfFile', filesRoutes);

// ======================================================
// APP RUNNING
// ======================================================

app.listen(process.env.PORT, () => {
    console.log(`App is running on port ${process.env.PORT}.`);
});
