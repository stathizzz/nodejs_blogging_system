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

