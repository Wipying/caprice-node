var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes');
var users = require('./routes/user');
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

app.get('/', routes.index);
app.get('/users', users.list);
var bookId = 100;

function findBook(id){
    for(var i =0; i<books.length; i++){
        if(books[i].id === id){
            return books[i];
        }
    }
    return null;
}

function removeBook(id){
    var bookIndex = 0;
    for(var i=0; i<books.length; i++){
        if(books[i].id === id){
            bookIndex = i;
        }
    }
    books.splice(bookIndex, 1);
}

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

var books = [
    {id: 98, author: 'Stephen King', title: 'The Shining', year: 1977},
    {id: 99, author: 'George Orwell', title: 1949}];

app.get('/books', function (request, response) {
    response.header('Access-Control-Allow-Origin', '*');
    console.log('In GET function ');
    response.json(books);
});

app.get('/books/:id', function (request, response) {
    response.header('Access-Control-Allow-Origin', '*');
    console.log('Getting a book with id ' + request.params.id);
    var book = findBook(parseInt(request.params.id,10));
    if(book === null){
        response.send(404);
    }
    else{
        response.json(book);
    }
});

app.post('/books', function (request, response) {
    response.header('Access-Control-Allow-Origin', '*');
    var book = request.body;
    console.log('Saving book with the following structure ' + JSON.stringify(book));
    book.id = bookId++;
    books.push(book);
    response.send(book);
});

app.put('/books/:id', function (request, response) {
    response.header('Access-Control-Allow-Origin', '*');
    var book = request.body;
    console.log('Updating Book ' + JSON.stringify(book));
    varcurrentBook = findBook(parseInt(request.params.id,10));
    if(currentBook === null){
        response.send(404);
    }
    else{
        //save the book locally
        currentBook.title = book.title;
        currentBook.year = book.year;
        currentBook.author = book.author;
        response.send(book);
    }
});

app.delete('/books/:id', function (request, response) {
    console.log('calling delete');
    response.header('Access-Control-Allow-Origin', '*');
    var book = findBook(parseInt(request.params.id,10));
    if(book === null){
        console.log('Could not find book');
        response.send(404);
    }
    else
    {
        console.log('Deleting ' + request.params.id);
        removeBook(parseInt(request.params.id, 10));
        response.send(200);
    }
    response.send(200);
});

//additional setup to allow CORS requests
var allowCrossDomain = function(req, response, next) {
    response.header('Access-Control-Allow-Origin', "http://localhost");
    response.header('Access-Control-Allow-Methods', 'OPTIONS, GET,PUT,POST,DELETE');
    response.header('Access-Control-Allow-Headers', 'Content-Type');
    if ('OPTIONS' == req.method) {
        response.send(200);
    }
    else {
        next();
    }
};

app.use(allowCrossDomain);



if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

app.use(function(err, req, res, next) {
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
app.listen(8080);