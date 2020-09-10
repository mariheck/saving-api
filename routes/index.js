const express = require('express');
const router = express.Router({ mergeParams: true });
const nodemailer = require('nodemailer');
const passport = require('passport');
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
        return res.status(400).json('Wrong credentials.');
    }

    const admin = new Admin({
        username,
        password
    });

    req.login(admin, err => {
        if (err) {
            res.status(400).json('Wrong credentials.');
        } else {
            passport.authenticate('local')(req, res, () => {
                res.json(req.user.username);
            });
        }
    });
});

router.get('/logout', (req, res) => {
    req.logout();
    res.json('Successfully logged out.');
});

router.put('/password', (req, res) => {
    const {
        username,
        oldPassword,
        newPassword,
        passwordConfirmation
    } = req.body;

    if (newPassword !== passwordConfirmation) {
        console.log('newPassword !== passwordConfirmation');
        return res
            .status(400)
            .json('Password confirmation different from new password.');
    }

    Admin.findByUsername(username, (err, admin) => {
        if (err) {
            res.status(400).status("Couldn't find the requested user.");
        } else {
            if (admin) {
                admin.changePassword(oldPassword, newPassword, error => {
                    if (error) {
                        res.status(400).status("Couldn't update the password.");
                    } else {
                        res.json('Password updated successfully.');
                    }
                });
            } else {
                res.status(400).status("Couldn't find the requested user.");
            }
        }
    });
});

module.exports = router;
