const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'bin')));
app.use(express.static(path.join(__dirname, 'assets')));

process.env.NODE_ENV = 'development';
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.disable('view cache');

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(3000, () => {
    console.log('listening on port 3000');
});