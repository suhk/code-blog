var blog = new Blog();

blog.checkForEditArticle = function () {
  if (blog.getParameterByKey('id')) {
    var id = blog.getParameterByKey('id');
    blog.loadArticleById(id);
    $('#update-article-btn').data('article-id', id);
    $('#delete-article-btn').data('article-id', id);
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

blog.buildArticle = function() {
  var prop = {};

  // Read values from form
  prop.title = $('#article-title').val();
  prop.author = $('#article-author').val();
  prop.authorUrl = $('#article-author-url').val();
  prop.category = $('#article-category').val();

  if($('#article-published').checked) {
    prop.publishedOn = new Date();
  } else {
    prop.publishedOn = null;
  }

  $articleBody = $('#article-body').val();
  prop.markdown = $articleBody;

  // Write JSON string
  $('#article-json').val(JSON.stringify(prop));

  return new Article(prop);
};

blog.buildPreview = function() {
  // Display preview on page
  var newArticle = blog.buildArticle();
  $('#preview article').children().remove();
  newArticle.toHTML('#preview');

  // Highlight code in markup
  $('pre code').each(function(i, block) {
    hljs.highlightBlock(block);
  });
};

blog.clearNewForm = function() {
  $('#article-title').val('');
  $('#article-author').val('');
  $('#article-author-url').val('');
  $('#article-category').val('');
  $('#article-body').val('');
};

$(function() {
  $.get('scripts/articleTemplate', blog.compileTemplate)
  .done(webDB.init())
  .done(blog.checkForEditArticle);

  $('#add-article-btn').on('click', function () {
    var article = blog.buildArticle();
    webDB.execute([
      {
        'sql': 'INSERT INTO articles (title, author, authorUrl, category, publishedOn, markdown) VALUES (?, ?, ?, ?, ?, ?);',
        'data': [article.title, article.author, article.authorUrl, article.category, article.publishedOn, article.markdown]
      }
    ]);
  });

  $('#update-article-btn').on('click', function () {
    var id = $(this).data('article-id');
    var a = blog.buildArticle();
    a.id = id;

    webDB.execute([
      {
        'sql': 'UPDATE articles SET title=?, author=?, authorUrl=?, category=?, publishedOn=?, markdown=? WHERE id = ' + a.id + ';',
        'data': [a.title, a.author, a.authorUrl, a.category, a.publishedOn, a.markdown]
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

  $('#write').on('keyup', function(event) {
    event.preventDefault();
    blog.buildPreview();
  });
});
