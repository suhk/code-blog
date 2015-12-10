var blog = new Blog();

blog.checkForEditArticle = function () {
    if (blog.getParameterByKey('id')) {
        var id = blog.getParameterByKey('id');
        blog.loadArticleById(id);
        $('#add-article-btn').hide();
        $('#update-article-btn').show().data('article-id', id);
        $('#delete-article-btn').show().data('article-id', id);
        console.log('Found article to edit.');
    } else {
        console.log('No article to edit.');
    }
};

blog.loadArticleById = function (id) {
    // Grab just the one article from the DB
    webDB.execute(
        'select * from articles where id = ' + id,
        function (result) {
            if (result.length == 1) {
                blog.fillFormWithArticle(result[0]);
            }
        }
    );
};

blog.fillFormWithArticle = function (a) {
    //var checked = a.publishedOn ? true : false;
    $('#article-title').val(a.title);
    $('#article-author').val(a.author);
    $('#article-author-url').val(a.authorUrl);
    $('#article-category').val(a.category);
    $('#article-body').val(a.markdown);
    //$('#article-published').attr('checked', checked);
    blog.buildPreview();
};

blog.getParameterByKey = function(key) {
    var match = RegExp('[?&]' + key + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
};

$(function() {
    $.get('scripts/articleTemplate', blog.compileTemplate)
    .done(webDB.init())
    .done(blog.checkForEditArticle);
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

$('#update-article-btn').on('click', function () {
    var id = $(this).data('article-id');
    var a = blog.buildArticle();
    a.id = id;

    webDB.execute([
        {
            'sql': 'update articles set title=?, author=?, authorUrl=?, category=?, publishedOn=?, markdown=? where id = ' + a.id + ';',
            'data': [a.title, a.author, a.authorUrl, a.category, a.publishedOn, a.markdown]
        }
    ]);

});

blog.clearNewForm = function() {
    $('#article-title').val('');
    $('#article-author').val('');
    $('#article-author-url').val('');
    $('#article-category').val('');
    $('#article-body').val('');
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

$('#delete-article-btn').on('click', function () {
    var id = $(this).data('article-id');
    // Remove this record from the DB:
    webDB.execute('delete from articles where id=' + id);
    blog.buildPreview();
    blog.clearNewForm();
});

$('#write').on('mouseup keyup', function(event) {
    event.preventDefault();
    blog.buildPreview();
});
