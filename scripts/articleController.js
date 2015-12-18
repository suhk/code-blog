var articleController = {};

var blog = new Blog(); // Blog object

articleController.callDB = function(data, msg, xhr) {
  webDB.init();
  webDB.setupTables();

  var eTag = xhr.getResponseHeader('eTag');
  if (typeof localStorage.articlesEtag == 'undefined' || localStorage.articlesEtag != eTag) {
    console.log('cache miss!');
    localStorage.articlesEtag = eTag;

    // Remove all prior articles from the DB, and from blog:
    blog.articles = [];
    webDB.execute('delete from articles;', articleController.getJSON);

  } else {
    console.log('cache hit!');
    webDB.execute('select * from articles;', articleController.dbFetch);

  }

};

articleController.dbFetch = function(result) {
  result.forEach(function(e) {
    blog.articles.push(new Article(e));
  });
  blog.init();
  blog.addEvents();

};

articleController.updateDB = function(data) {
  // Iterate over new article JSON:
  data.forEach(function(item) {
    // Instantiate an article based on item from JSON:
    var article = new Article(item);

    // Add the article to blog.articles
    blog.articles.push(article);

    // Cache the article in DB
    webDB.insertRecord(article);
  });

  blog.init();
  blog.addEvents();

};

articleController.getJSON = function() {
  $.getJSON('/scripts/blogArticles.json', articleController.updateDB);
};

//---------------------------------------------

articleController.category = function(context) {
  articleController.findByCategory(context.params.category, articleController.show);
};

articleController.author = function(context) {
  articleController.findByAuthor(context.params.author, articleController.show);
};

articleController.findByCategory = function(category, callback) {
  webDB.init();
  webDB.execute([
    {
      'sql': 'select * from articles where category=?',
      'data': [category]
    }
  ], callback);
};

articleController.findByAuthor = function(author, callback) {
  webDB.init();
  webDB.execute([
    {
      'sql': 'select * from articles where author=?',
      'data': [author]
    }
  ], callback);
};

articleController.show = function(data) {
  articleController.renderNotAll(data);
};

articleController.renderNotAll = function(articles) {
  $.get('/scripts/articleTemplate', blog.compileTemplate)
    .done(function() {
      $('main').empty();
      for(i = 0; i < articles.length; i++) {
        var art = new Article(articles[i]);
        art.toHTML('main');
      }
      $('#home').show();
      $('#about').hide();
      $('.filter').show();
    
      $('article p:not(:first-child)').hide();
      //
      // webDB.execute('select * from articles;', function(result) {
      //   result.forEach(function(e) {
      //     blog.articles.push(new Article(e));
      //   });
      //   blog.init2();
      //   blog.addEvents();
      // });
    });
};

articleController.index = function() {
  $.ajaxPrefilter(function(options) {
    options.async = true;
  });
  $.get('/scripts/articleTemplate', blog.compileTemplate)
  .done($.ajax({
    type: 'HEAD',
    url: '/scripts/blogArticles.json',
    success: articleController.callDB
  }));
};
