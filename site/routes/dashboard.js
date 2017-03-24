const express = require('express');
const passport = require('passport');
const Discord = require('../util/Discord');
const router = express.Router();

router.use((req, res, next) => {
    if(req.user) next();
    else res.redirect('/auth/login');
});

router.get('/', async (req, res) => {
    // console.log(req.user);
    // console.log(req.app.get('discord'));
    res.render('dashboard/index', {
        guilds: await req.user.request.guilds()
    });
});

module.exports = router;