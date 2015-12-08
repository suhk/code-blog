/*
    The main file with the non-object stuff
*/
$(function() {
    var blog = new Blog(); // Blog object

    $.get("scripts/articleTemplate", function(data) {
        Article.prototype.compiledTemplate = Handlebars.compile(data);
    }).done(function() {
        $.ajax({
            url: 'scripts/blogArticles.json',
            success: function(data, textStatus, xhr) {
                if(localStorage.getItem("data") == null || xhr.getResponseHeader('ETag') != localStorage.getItem("ETag")) {
                    localStorage.setItem("ETag", xhr.getResponseHeader('ETag'));
                    $.getJSON('scripts/blogArticles.json', function(data) {
                        localStorage.setItem("data", JSON.stringify(data));
                        blog.init(data); // Fill the blog
                        blog.addEvents(); // Add handlers to blog
                    });
                } else {
                    blog.init(JSON.parse(localStorage.getItem("data")));
                    blog.addEvents();
                }
            }
        });

    });




})
