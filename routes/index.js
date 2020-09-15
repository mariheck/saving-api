require('dotenv').config();

const express = require('express');
const router = express.Router({ mergeParams: true });
const nodemailer = require('nodemailer');
const middleware = require('../middleware');
const Admin = require('../models/admin');

// ======================================================
// NODEMAILER SETTING
// ======================================================

const transporter = nodemailer.createTransport({
    service: process.env.SERVICE,
    auth: {
        user: process.env.ACCOUNT,
        pass: process.env.PASS
    }
});

// ======================================================
// NODEMAILER ROUTE
// ======================================================

router.post('/contact', (req, res) => {
    const { name, email, phone, message } = req.body;

    const mailContent = `
    <p>
    ${name} </br> 
    ${email} </br> 
    ${phone} </br> 
    ${message}</p>`;

    const mailOptions = {
        from: process.env.ACCOUNT,
        to: process.env.ACCOUNT,
        subject: 'Saving - Nouveau Message',
        html: mailContent
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            res.status(400).json(err);
        } else {
            res.json(info);
        }
    });
});

// ======================================================
// ADMIN ROUTES
// ======================================================

// router.post('/register', (req, res) => {
//     const { username, password } = req.body;

//     const newAdmin = new Admin({ username });

//     Admin.register(newAdmin, password, err => {
//         if (err) {
//             res.status(400).json("Couldn't register.");
//         } else {
//             passport.authenticate('local')(req, res, () => {
//                 res.json('Successful registration.');
//             });
//         }
//     });
// });

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json('Missing credentials.');
    }

    const admin = new Admin({
        username,
        password
    });

    req.login(admin, err => {
        if (err) return res.status(400).json('Wrong credentials.');
        return res.json(req.user.username);
    });
});

router.get('/logout', (req, res) => {
    req.logout();
    res.json('Successfully logged out.');
});

router.put('/password', middleware.isLoggedIn, (req, res) => {
    const {
        username,
        oldPassword,
        newPassword,
        passwordConfirmation
    } = req.body;

    if (newPassword !== passwordConfirmation) {
        return res
            .status(400)
            .json('Password confirmation different from new password.');
    }

    Admin.findByUsername(username, (err, admin) => {
        if (err) {
            res.status(400).json("Couldn't find the requested admin.");
        } else {
            if (admin) {
                admin.changePassword(
                    oldPassword,
                    newPassword,
                    (error, authAdmin, passwordErr) => {
                        if (error || passwordErr) {
                            res.status(400).json(
                                "Couldn't update the password."
                            );
                        } else {
                            res.json('Password updated successfully.');
                        }
                    }
                );
            } else {
                res.status(400).json("Couldn't find the requested user.");
            }
        }
    });
});

// ======================================================
// FIREBASE ROUTES
// ======================================================

router.get('/firebase-config', (req, res) => {
    const firebaseConfig = {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        databaseURL: process.env.FIREBASE_DB_URL,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID
    };

    res.json(firebaseConfig);
});

module.exports = router;
