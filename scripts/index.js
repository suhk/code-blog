/*
The main file with the non-object stuff
*/
var blog = new Blog(); // Blog object

blog.callDB = function(data, msg, xhr) {
  webDB.init();
  webDB.setupTables();

  var eTag = xhr.getResponseHeader('eTag');
  if (typeof localStorage.articlesEtag == 'undefined' || localStorage.articlesEtag != eTag) {
    console.log('cache miss!');
    localStorage.articlesEtag = eTag;

    // Remove all prior articles from the DB, and from blog:
    blog.articles = [];
    webDB.execute('delete from articles;', blog.getJSON);

  } else {
    console.log('cache hit!');
    webDB.execute('select * from articles;', blog.dbFetch);

  }

};

blog.dbFetch = function(result) {
  result.forEach(function(e) {
    blog.articles.push(new Article(e));
  });
  blog.init();
  blog.addEvents();

};

blog.updateDB = function(data) {
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

blog.getJSON = function() {
  $.getJSON('scripts/blogArticles.json', blog.updateDB);
};

$(function() {
  $.get('scripts/articleTemplate', blog.compileTemplate)
  .done($.ajax({
    type: 'HEAD',
    url: 'scripts/blogArticles.json',
    success: blog.callDB
  }));

});
