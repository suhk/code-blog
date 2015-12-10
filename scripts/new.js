var blog = new Blog();


$(function() {
    $.get('scripts/articleTemplate', blog.compileTemplate)
    .done(webDB.init());
});

blog.buildArticle = function() {
    var prop = {};

    // read values from form
    prop.title = $('#article-title').val();
    prop.author = $('#article-author').val();
    prop.authorUrl = $('#article-author-url').val();
    prop.category = $('#article-category').val();
    prop.publishedOn = new Date();

    $articleBody = $('#article-body').val();
    prop.markdown = $articleBody;
    return new Article(prop);
};

blog.buildPreview = function() {
    var prop = {};

    // read values from form
    prop.title = $('#article-title').val();
    prop.author = $('#article-author').val();
    prop.authorUrl = $('#article-author-url').val();
    prop.category = $('#article-category').val();
    prop.publishedOn = new Date();

    $articleBody = $('#article-body').val();
    prop.markdown = $articleBody;

    // display preview on page
    var newArticle = new Article(prop);
    $('#preview article').children().remove();
    newArticle.toHTML('#preview');

    // write JSON string
    $('#article-json').val(JSON.stringify(prop));

    $('pre code').each(function(i, block) {
        hljs.highlightBlock(block);
    });
};

$('#add-article-btn').on('click', function () {
    var article = blog.buildArticle();
    webDB.execute([
        {
            'sql': 'INSERT INTO articles (title, author, authorUrl, category, publishedOn, markdown) VALUES (?, ?, ?, ?, ?, ?);',
            'data': [article.title, article.author, article.authorUrl, article.category, article.publishedOn, article.markdown]
        }
    ]);
});

$('#write').on('mouseup keyup', function(event) {
    event.preventDefault();
    blog.buildPreview();
});
