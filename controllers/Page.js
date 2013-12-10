var crypto = require('crypto'),
    BaseController = require("./Base"),
	View = require("./../views/Base"),
	model = new (require("./../models/ContentModel"));


module.exports = BaseController.extend({ 
	name: "Page",
	content: null,
	run_and_get_db_content: function(route, req, res, next) {
        model.setDB(req.db);
		var self = this;
        this.getDbContent(route, function() {
            (new View(res, route)).render(self.content);
		});
	},
    run: function (route, model, collection_name, querydata, req, res, next) {
        var self = this;
        this.getDbContent(model, collection_name, querydata, function(err, content) {
            new View(res, route).render(content);
        });
    },
    run_simple: function (route, res, content, next) {
        var self = this;
        self.content = content;
        new View(res, route).render(self.content);
    },
    getDbContent: function(model, collection_name, querydata, callback) {
		var self = this;
		self.content = {};
		model.getlist(collection_name, querydata, function(err, records) {
			self.content = records;
			callback(err, records);
		});
	},
    setDbContent: function (model, collection_name, content, callback) {
        var self = this;
        var action;
        if (content && content.ID && content.ID != '') {
            action = 'update';
        }
        else {
            action = 'insert';
        }
        model[action](collection_name, content, function(err, record) {
            self.content = content;
            callback(err, record);
        });
    },
    delDbContent: function(req, collection_name, callback) {
        //args could be req.query
        if(req.query && req.query.action === "delete" && req.query.id) {
            model.remove(collection_name, req.query.id, callback);
        } else {
            callback();
        }
    },
    removeDbContent: function (model, collection_name, querydata, callback) {
        model.massremove(collection_name, querydata, callback);
    },
    removeDbRecord: function (model, collection_name, querydata, callback)  {
        model.removeOne(collection_name, querydata, callback);
    }
});


var example = function(model, req) {

    process.stdout.write('removing mass data from db...');
    Page.removeDbContent(model, 'usermessages', { email: 'stathizzz@yahoo.com' }, function(err, removedDocs) {
        if (err) throw err;
        process.stdout.write('success!\n');
        //console.log(JSON.stringify(removedDocs));
    });

    process.stdout.write('removing one record  from db...');
    Page.removeDbRecord(model, 'usermessages', { email: '456@rwqerw.gt' }, function(err, removedDoc) {
        if (err) throw err;
        process.stdout.write('success!\n');
        //console.log(JSON.stringify(removedDoc));
    });

    process.stdout.write('getting data from db...');
    Page.getDbContent(model, 'usermessages', { 'email': 'stathizzz@yahoo.com' }, function(err, records) {
        if (err) throw err;
        process.stdout.write('success!\n');
        //console.log(JSON.stringify(records));
    });

    process.stdout.write('inserting data on db...');
    Page.setDbContent(model, 'usermessages', { email: req.body.email,
        comment: req.body.comments}, function (err, record) {
        if (err) throw err;
        process.stdout.write('success!\n');
        //console.log(JSON.stringify(record));
    });
};