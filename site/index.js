const path = require('path');
require('dotenv').config({ path: path.join(process.cwd(), 'site', '.env') });

const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');
const redis = require('redis');

const app = express();

module.exports = (shardManager) => {
    app.use(helmet());
    app.use(cors());
    app.use(express.static(path.join(__dirname, 'bin')));
    app.use(express.static(path.join(__dirname, 'assets')));
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(passport.initialize());

    app.set('view engine', 'pug');
    app.set('shard', shardManager);
    app.set('redis', redis.createClient());

    app.use('/dashboard', require('./routes/dashboard'));
    app.use('/auth', require('./routes/auth'));
    app.use('/payments', require('./routes/payments'));

    app.get('/', (req, res) => {
        res.send('hi');
    });

    app.listen(process.env.PORT || 3000, process.env.IP || '0.0.0.0', () => {
        console.log('listening on port 3000');
    });
};