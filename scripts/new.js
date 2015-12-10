var blog = new Blog();

blog.buildArticle = function() {
    var prop = {};

    // read values from form
    prop.title = $('#article-title').val();
    prop.author = $('#article-author').val();
    prop.authorUrl = $('#article-author-url').val();
    prop.category = $('#article-category').val();

    if($('#article-published').is(':checked')) {
        console.log("yolo");
        prop.publishedOn = new Date();
    } else {
        prop.publishedOn = null;
    }

    $articleBody = $('#article-body').val();
    prop.markdown = $articleBody;

    // write JSON string
    $('#article-json').val(JSON.stringify(prop));

    return new Article(prop);
};

blog.buildPreview = function() {
    // display preview on page
    var newArticle = blog.buildArticle();
    $('#preview article').children().remove();
    newArticle.toHTML('#preview');

    $('pre code').each(function(i, block) {
        hljs.highlightBlock(block);
    });
};

$(function() {
    $.get('scripts/articleTemplate', blog.compileTemplate)
    .done(webDB.init());

    $('#add-article-btn').on('click', function () {
        var article = blog.buildArticle();
        webDB.execute([
            {
                'sql': 'INSERT INTO articles (title, author, authorUrl, category, publishedOn, markdown) VALUES (?, ?, ?, ?, ?, ?);',
                'data': [article.title, article.author, article.authorUrl, article.category, article.publishedOn, article.markdown]
            }
        ]);
    });

    $('#write').on('keyup', function(event) {
        event.preventDefault();
        blog.buildPreview();
    });
});
