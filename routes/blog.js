var Blog = require('./../controllers/Blog'),
    config = require('./../config'),
    Page = require('./../controllers/Page');

exports.setup_all = function(model, app) {

    Blog.initPoet(app, function (poet) {
        console.log("Initialized blogging!");
        poet.addRoute('/admin/' + config('blog_name'), function (req, res) {

                Page.run_simple('admin-blog', res, {
                    url: req.url,
                    blog_lang: Blog.getBlogLanguage(),
                    username: req.session.username,
                    isAuthenticated: req.session.melhouse_authorized,
                    blog_name: config('blog_name'),
                    poet: poet,
                    posts: posts});
        });

        poet.addRoute('/' + config('blog_name') + '/post/:post', function (req, res) {
            var post = poet.helpers.getPost(req.params.post);
            if (post) {

                Blog.getArticle(model, { url: post.url }, function(err, article) {
                    if (err) throw err;
                    if (!article) {
                        Blog.saveArticle(model, post, req, res, function(err, new_article) {
                            if (err) throw err;
                             Page.run_simple('blog/blog-post', res, {
                                url: req.url,
                                blog_lang: Blog.getBlogLanguage(),
                                username: req.session.username,
                                isAuthenticated: req.session.melhouse_authorized,
                                blog_name: config('blog_name'),
                                poet: poet,
                                post: post,
                                article: new_article
                            });
                        });

                    } else {
                        Page.run_simple('blog/blog-post', res, {
                            url: req.url,
                            blog_lang: Blog.getBlogLanguage(),
                            username: req.session.username,
                            isAuthenticated: req.session.melhouse_authorized,
                            blog_name: config('blog_name'),
                            poet: poet,
                            post: post,
                            article: article
                        });
                    }

                });
            } else {
                res.send(404);
            }
        });

        poet.addRoute('/' + config('blog_name') + '/tag/:tag', function (req, res) {
            var taggedPosts = poet.helpers.postsWithTag(req.params.tag);
            if (taggedPosts.length) {
                Page.run_simple('blog/blog-tag', res, {
                    url: req.url,
                    blog_lang: Blog.getBlogLanguage(),
                    username: req.session.username,
                    isAuthenticated: req.session.melhouse_authorized,
                    blog_name: config('blog_name'),
                    poet: poet,
                    posts: taggedPosts,
                    tag: req.params.tag
                });
            }
        });

        poet.addRoute('/' + config('blog_name') + '/tags', function (req, res) {
            Page.run_simple('blog/blog-tags', res, {
                url: req.url,
                blog_lang: Blog.getBlogLanguage(),
                username: req.session.username,
                isAuthenticated: req.session.melhouse_authorized,
                blog_name: config('blog_name'),
                poet: poet
            });
        });

        poet.addRoute('/' + config('blog_name') + '/category/:category', function (req, res) {
            var categorizedPosts = poet.helpers.postsWithCategory(req.params.category);
            if (categorizedPosts.length) {
                Page.run_simple('blog/blog-category', res, {
                    url: req.url,
                    blog_lang: Blog.getBlogLanguage(),
                    username: req.session.username,
                    isAuthenticated: req.session.melhouse_authorized,
                    blog_name: config('blog_name'),
                    poet: poet,
                    posts: categorizedPosts,
                    category: req.params.category
                });
            }
        });

        poet.addRoute('/' + config('blog_name') + '/page/:page', function (req, res) {
            var page = req.params.page,
                lastPost = page * poet.options.postsPerPage;
            Page.run_simple('blog/blog-page', res, {
                url: req.url,
                blog_lang: Blog.getBlogLanguage(),
                username: req.session.username,
                isAuthenticated: req.session.melhouse_authorized,
                blog_name: config('blog_name'),
                poet: poet,
                posts: poet.helpers.getPosts(lastPost - poet.options.postsPerPage, lastPost),
                page: page
            });
        });

        poet.addRoute('/' + config('blog_name'), function (req, res) {
            var page = 1,
                lastPost = page * poet.options.postsPerPage;
            Page.run_simple('blog/blog-page', res, {
                                                    url: req.url,
                                                    blog_lang: Blog.getBlogLanguage(),
                                                    username: req.session.username,
                                                    isAuthenticated: req.session.melhouse_authorized,
                                                    blog_name: config('blog_name'),
                                                    poet: poet,
                                                    posts: poet.helpers.getPosts(lastPost - poet.options.postsPerPage, lastPost),
                                                    page: page
            });
        });
    });

};