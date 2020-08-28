const express = require('express');
const router = express.Router({ mergeParams: true });
const nodemailer = require('nodemailer');

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

router.post('/login', (req, res) => {
    const { pseudo, password } = req.body;

    if (!pseudo || !password) {
        return res.status(400).json('Wrong credentials.');
    }

    if (pseudo === 'Admin' && password === 'mdp123') {
        return res.json({ pseudo: 'Admin' });
    } else {
        return res.status(400).json('Wrong credentials.');
    }
});

module.exports = router;
