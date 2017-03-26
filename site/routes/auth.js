const express = require('express');
const passport = require('passport');
const {OAuth2Strategy} = require('passport-oauth');
const Discord = require('../util/Discord');

const baseURL = 'https://discordapp.com/api/oauth2';
const users = new Map();

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
        const discord = new Discord(accessToken);

        try {
            done(null, Object.assign(await discord.profile(), { request: discord }));
        } catch (e) {
            done(e);
        }
    })
);

passport.serializeUser((user, done) => {
    users.set(user.id, user);
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    done(null, users.get(id));
});

router.get('/login', passport.authenticate('discord', {
    scope: ['guilds', 'identify']
}));

router.get('/callback', passport.authenticate('discord', {
    successRedirect: '/dashboard',
    failureRedirect: '/'
}));

module.exports = router;