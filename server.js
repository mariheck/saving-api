require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const indexRoutes = require('./routes/index');
const collectionsRoutes = require('./routes/collections');
const filesRoutes = require('./routes/files');

const app = express();
app.use(express.json());
app.use(cors());

// ======================================================
// DATA BASE SETUP
// ======================================================

mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost:27017/savingDatabase', {
    useNewUrlParser: true,
    useFindAndModify: false
});

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
