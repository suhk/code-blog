articleController = {};

articleController.index = function() {
    $.get('/scripts/articleTemplate', blog.compileTemplate)
        .done($.ajax({
            type: 'HEAD',
            url: 'scripts/blogArticles.json',
            success: blog.callDB
        }));
};
