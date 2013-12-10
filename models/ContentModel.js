var crypto = require("crypto"),
    MongoClient = require('mongodb').MongoClient,
    BaseModel = require("./Base"),
	model = new BaseModel();

var ContentModel = model.extend({
	insert: function(collection_name, data, callback) {
		data.ID = crypto.randomBytes(20).toString('hex'); 
		this.db.collection(collection_name).insert(data, {safe: true}, callback || function(){ });
	},
	update: function(collection_name, data, callback) {
        this.db.collection(collection_name).update({ID: data.ID}, data, {safe: true}, callback || function(){ });
	},
	getlist: function(collection_name, querydata, callback) {
       this.db.collection(collection_name).find(querydata || {}).toArray(function(err, records) {
            callback(err, records);
        });
	},
	getOne: function(collection_name, querydata, callback) {
		this.db.collection(collection_name).findOne(querydata, callback);
	},
    removeOne: function(collection_name, querydata, callback) {
//        this.db.collection(collection_name).findOne(querydata, function(err, doc) {
//            console.log(doc._id);
//            this.db.collection(collection_name).remove({ID: doc.ID}, {fsync: true}, function(err, numberOfRemovedDocs) {
//                callback(err, numberOfRemovedDocs);
//            });
//        });
        this.db.collection(collection_name).findAndRemove(querydata, callback);
        //this.db.collection(collection_name).findAndModify({query: querydata, remove: true});
    },
    massremove: function(collection_name, querydata, callback) {
        this.db.collection(collection_name).remove(querydata, {fsync: true}, function(err, numberOfRemovedDocs) {
            callback(err, numberOfRemovedDocs);
        });
    }//,
//    UserMessage : mongoose.model('UserMessage', new mongoose.Schema({
//        ID: String,
//        email: String,
//        comment: String
//    })),
//    BannerPicture: mongoose.model('BannerPicture', new mongoose.Schema({
//        ID: String,
//        path: String,
//        text: String,
//        fulltext: String
//    }))
});
module.exports = ContentModel;