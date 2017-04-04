const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const {OAuth2Strategy} = require('passport-oauth');

const baseURL = 'https://discordapp.com/api/oauth2';
const router = express.Router();

passport.use('discord',
    new OAuth2Strategy({
        tokenURL: `${baseURL}/token`,
        authorizationURL: `${baseURL}/authorize`,
        clientID: process.env.client_id,
        clientSecret: process.env.client_secret,
        callbackURL: `${process.env.HOSTNAME}/auth/callback`
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            done(null, { accessToken, refreshToken });
        } catch (e) {
            done(e);
        }
    })
);

router.get('/login', passport.authenticate('discord', {
    scope: ['guilds', 'identify']
}));

router.get('/callback', passport.authenticate('discord', { session: false }), (req, res) => {
    const token = jwt.sign({
        token: req.user.accessToken,
        refresh: req.user.refreshToken
    }, process.env.jwt_secret);

    res.json({ token });
});

module.exports = router;
