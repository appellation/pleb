const path = require('path');
require('dotenv').config({ path: path.join(process.cwd(), 'site', '.env') });

const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const app = express();

module.exports = (shardManager) => {
    app.use(express.static(path.join(__dirname, 'bin')));
    app.use(express.static(path.join(__dirname, 'assets')));
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(session({
        resave: false,
        saveUninitialized: false,
        secret: process.env.session_secret
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    process.env.NODE_ENV = 'development';
    app.set('views', path.join(__dirname, 'views/routes'));
    app.set('view engine', 'pug');
    app.set('shard', shardManager);
    app.disable('view cache');

    app.use((req, res, next) => {
        if(req.session.error) {
            res.locals.error = req.session.error;
            req.session.error = null;
        }

        if(req.session.success) {
            res.locals.success = req.session.success;
            req.session.success = null;
        }

        next();
    });

    app.use('/auth', require('./routes/auth'));
    app.use('/dashboard', require('./routes/dashboard'));
    app.use('/payments', require('./routes/payments'));

    app.get('/', (req, res) => {
        res.render('index');
    });

    app.listen(3000, () => {
        console.log('listening on port 3000');
    });
};