var MongoClient = require('mongodb').MongoClient,
    config = require('./../config');

module.exports = function(db) {
    this.db = db;
};
module.exports.prototype = {
	extend: function(properties) {
		var Child = module.exports;
		Child.prototype = module.exports.prototype;
		for(var key in properties) {
			Child.prototype[key] = properties[key];
		}
		return Child;
	},
    initDB : function(db_name, callback, err) {
        var conStr = "mongodb://" + config('local').mongo.host + ":" + config('local').mongo.port + "/" + db_name;
        var self = this;
        MongoClient.connect(conStr, function(err, db) {
            self.db = db;
            self.db_name = db_name;
            callback(err, db);
        });
    },
	setDB: function(db) {
		this.db = db;
	},
    getDB: function() {
        return this.db;
    },
    getDBName: function () {
        return this.db_name;
    },
	collection: function(name) {
		if(this.db._collection) return this.db._collection;
		return this.db._collection = this.db.collection(name);
	}
};

