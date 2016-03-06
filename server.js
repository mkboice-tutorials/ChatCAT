'use strict';
const express = require('express');
const app = express();
app.set('port', process.env.PORT ||3000);

let helloMiddleware = (req, res, next) => {
    req.hello = "Hello! It's me! I was wondering .... you get the idea!";
    next();
}

app.use(helloMiddleware);

app.get('/', (req, res, next) => {
    res.send('<h1>Hello Express!</h1>');
});

app.get('/dashboard', (req, res, next) => {
    res.send('<h1>This is the dashboard page! Middleware says: ' + req.hello + '</h1>');
})

app.listen(app.get('port'), ()=> {
    console.log('ChatCAT running on Port: ' + app.get('port'))
})