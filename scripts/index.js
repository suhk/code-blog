/*
    The main file with the non-object stuff
*/
$(function() {
    var blog = new Blog(); // Blog object

    // Grab the article template and make a handlebars function
    blog.compileTemplate = function(data) {
        Article.prototype.compiledTemplate = Handlebars.compile(data);
    };

    blog.pullJSON = function(data, textStatus, xhr) {
        // Check localStorage to see if data has changed
        // If so, then pull from json file and update localStorage
        if(localStorage.getItem('data') == null || xhr.getResponseHeader('ETag') != localStorage.getItem('ETag')) {
            localStorage.setItem('ETag', xhr.getResponseHeader('ETag'));

            // Grab the JSON using ajax
            $.getJSON('scripts/blogArticles.json', function(data) {
                localStorage.setItem('data', JSON.stringify(data));
                blog.init(data); // Fill the blog
                blog.addEvents(); // Add handlers to blog
            });
        } else {
            // Otherwise, just pull articles from localStorage
            blog.init(JSON.parse(localStorage.getItem('data'))); // Fill the blog
            blog.addEvents(); // Add handlers to blog
        }
    };

    $.get('scripts/articleTemplate', blog.compileTemplate)
        .done($.ajax({
            url: 'scripts/blogArticles.json',
            success: blog.pullJSON
        }));

});
