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
var BaseController = require("./Base"),
	View = require("./../views/Base"),
    Poet = require('poet'),
    config = require('./../config'),
    Page = require('./Page');

module.exports = BaseController.extend({ 
	name: "Blog",
	content: null,
	run: function(model, req, res, next) {
		model.setDB(req.db);
		var self = this;
		this.getContent(function() {
			var v = new View(res, 'blog');
			v.render(self.content);
		});
	},
    getArticle: function(model, filter, callback) {
        var self = this;
        self.content = undefined;
        model.getlist('blog_articles', filter, function(err, records) {
            if(records.length > 0) {
                self.content = records[0];
            }
            if (callback) callback(err, self.content);
        });
    },
    saveArticle: function(model, post, req, res, callback) {
        Page.setDbContent(model, 'blog_articles', { url: post.url, content: post.content,
            preview: post.preview, dateAdded: new Date()}, callback);
    },
    deleteArticle: function(model, filter, callback) {
        model.removeOne('blog_articles', filter, callback);
    },
    initPoet: function (app, callback) {
        var poet = Poet(app, {
            postsPerPage: 5,
            posts: './views/blog/_posts',
            metaFormat: 'json'
        });
        poet.options.routes[ '/' + config('blog_name') + '/post/:post' ] = 'blog-post';
        poet.options.routes[ '/' + config('blog_name') + '/page/:page' ] = 'blog-page';
        poet.options.routes[ '/' + config('blog_name') + '/tag/:tag' ] = 'blog-tag';
        poet.options.routes[ '/' + config('blog_name') + '/tags' ] = 'blog-tags';
        poet.options.routes[ '/' + config('blog_name') + '/categories' ] = 'blog-categories';
        poet.options.routes[ '/' + config('blog_name') + '/category/:category' ] = 'blog-category';

        poet.init(function () {

            poet.clearCache();
            Object.keys(poet.posts).map(function (title) {
                var post = poet.posts[title];
                post.title = post.title;
            });

            if (callback) callback(poet);
        });
    },
    formatLanguageTables : function (tablename) {
        switch(blog_language) {
            case blog_languages.greek:
                return tablename +'_gr';
            case blog_languages.english:
                return tablename;
            default:
                return tablename;
        }
    },
    selectLanguageBasedOnInput : function(input) {
        switch(input) {
            case "en-us":
                console.log("English US selected.");
                blog_language = blog_languages.english;
                break;
            case "el-gr":
                console.log("Greek selected.");
                blog_language = blog_languages.greek;
                break;
            default:
                console.log("No language selected.");
                break;
        }
    },
    getBlogLanguage: function(lang) {
        var blog_language;
        if (blog_language === undefined) {
            //default language is greek
            if (lang && (lang.language === lang.languages.greek)) {
                blog_language = blog_languages.greek;
            }
            else if(lang && (lang.language === lang.languages.english)) {
                blog_language = blog_languages.english;
            }
            else {
                if (blog_language === undefined) {
                    blog_language = blog_languages.greek;
                }
            }

        }
        return blog_language;
    }
});

var blog_languages = {
    english:{
        title: "Spheenx Blog",
        tag: 'tag',
        tags: 'tags',
        category: 'category',
        categories: 'categories',
        browse: 'Browse through the blog',
        all_categories: 'All Categories',
        posts_in_categories: ' posts in category ',
        all_tags: 'All Tags',
        posts_tagged: ' posts tagged ',
        send_reply: 'Send Reply'
    },
    greek:{
        title: "Spheenx Blog",
        tag: 'ετικέτα',
        tags: 'ετικέτες',
        category: 'κατηγορία',
        categories: 'κατηγορίες',
        browse: 'Ψάξτε τα ιστογράμματα',
        all_categories: 'Όλες οι κατηγορίες',
        posts_in_categories: ' κείμενα στην κατηγορία ',
        all_tags: 'Όλες οι ετικέτες',
        posts_tagged: ' κείμενα με ετικέτα ',
        send_reply: "Αποστολή απάντησης"
    }
};




