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
                console.log(data, textStatus, xhr);
            }
        });
        $.getJSON('scripts/blogArticles.json', function(data) {
            blog.init(data); // Fill the blog
            blog.addEvents(); // Add handlers to blog
        });
    });




})
