/*
 Copyright (c) 2013, Efstathios D. Sfecas  <stathizzz@gmail.com>
 All rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright
 notice, this list of conditions and the following disclaimer.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
 IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED
 TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
 PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER
 OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
var express = require('express'),
    http = require('http'),
    path = require('path'),
    url = require('url'),
    fs = require('fs'),
    stylus = require('stylus'),
    MongoClient = require('mongodb').MongoClient,
    model = new (require('./models/ContentModel')),
    config = require('./config'),
    Blog = require('./controllers/Blog');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
/* enable jade */
app.set('view engine', 'jade');
/* enable stylus css editor */
app.use(stylus.middleware(path.join(__dirname, 'public')));
app.use(express.favicon());
/* enable logger */
app.use(express.logger('dev'));
/* enable html body parsing */
app.use(express.bodyParser());
/* enable PUT and DELETE requests to be parsed on client*/
app.use(express.methodOverride());
/* aneble cookies on browser */
app.use(express.cookieParser('mel-house-site'));
/* enable session on server memory */
app.use(express.session({secret: 'exo-ena-mystiko'}));
/* enable router */
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


/* Error page handling when router fails */
app.use (function (req, res) {
    res.send(404, "Page not found");
    //res.render("error", {msg: "Page not found!"});
});

/* Error handling when we throw a new Error when the router fails */
app.use(function (err, req, res, next) {
    res.status(err.status || 404);
    res.send(err.message);
    //res.render("error", {msg: err.message});
});

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

model.initDB('BlogCollection', function(err, con) {
    if (err) throw err;

    http.createServer(app).listen(app.get('port'), function() {
        console.log(
            'Successfully connected to ' + model.getDBName(),
            '\nExpress server listening on port ' + config('local').port
        );

        //routes binder
        ['blog'].map(function(controllerName) {
            var controller = require('./routes/' + controllerName);
            controller.setup_all(model, app);
        });
        console.log("Successfully setup Routes !");


    });
});