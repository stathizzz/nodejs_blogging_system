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
var _ = require("underscore"),
	View = require("./../views/Base");

module.exports = {
    name: "base",
    extend: function(child) {
	    return _.extend({}, this, child);
    },
    run: function(req, res, next, callback) {
	    if (callback) callback();
    },
    runAuthenticated: function(req, res, next, callback) {
        var self = this;
        if(this.authorize(req)) {
            console.log('authorized');
            req.session.melhouse_authorized = true;
            req.session.save();

            if (callback) callback();
        } else {
            console.log('not authorized');
            new View(res, 'admin-login').render({
                title: 'Please login',
                ID: '',
                picture: '',
                bannerTag: '',
                pictureTag: '',
                text: '',
                type: ''
            });
        }
    }
};

