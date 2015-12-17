stats = {};
stats.auths = [];

// Reduce function to count unique authors
stats.uniqueAuthor = function(counter, a) {
  if(stats.auths.indexOf(a.author) < 0) {
    stats.auths.push(a.author);
    return counter + 1;
  } else {
    return counter;
  }
};

// Remove markdown text from parameter
// Code taken from: https://github.com/stiang/remove-markdown/blob/master/index.js
stats.removeMd = function(text) {
  return text
  // Remove HTML tags
  .replace(/<(.*?)>/g, '$1')
  // Remove text-style headers
  .replace(/^[=\-]{2,}\s*$/g, '')
  // Remove footnotes?
  .replace(/\[\^.+?\](\: .*?$)?/g, '')
  .replace(/\s{0,2}\[.*?\]: .*?$/g, '')
  // Remove images
  .replace(/\!\[.*?\][\[\(].*?[\]\)]/g, '')
  // Remove inline links
  .replace(/\[(.*?)\][\[\(].*?[\]\)]/g, '$1')
  // Remove reference-style links?
  .replace(/^\s{1,2}\[(.*?)\]: (\S+)( ".*?")?\s*$/g, '')
  // Remove atx-style headers
  .replace(/^\#{1,6}\s*([^#]*)\s*(\#{1,6})?/gm, '$1')
  .replace(/([\*_]{1,2})(\S.*?\S)\1/g, '$2')
  .replace(/(`{3,})(.*?)\1/gm, '$2')
  .replace(/^-{3,}\s*$/g, '')
  .replace(/`(.+?)`/g, '$1')
  .replace(/\n{2,}/g, '\n\n');
};

// Map function to count number of words in an article
stats.wordCounter = function(art) {
  var body = stats.removeMd(art.markdown);
  return body.split(new RegExp(' ', 'g')).length;
};

// Reduce function to sum up a list of numbers
stats.summer = function(counter, a) {
  return counter + a;
};

// Map function to return the length of strings
stats.strLength = function(str) {
  return str.length;
};

// Map function to count the number of characters per article
stats.wlCounter = function(art) {
  var body = stats.removeMd(art.markdown);
  return body.split(new RegExp(' ', 'g')).map(stats.strLength).reduce(stats.summer, 0);
};

// Map function to count number of characters and tag the author and word count with it
stats.wlCounterWithAuthor = function(art) {
  var body = stats.removeMd(art.markdown);
  return {
    wl: body.split(new RegExp(' ', 'g')).map(stats.strLength).reduce(stats.summer, 0),
    author: art.author,
    words: body.split(new RegExp(' ', 'g')).length
  };
};

// Map function to count number of articles
stats.countArticles = function(articles) {
  return articles.length;
};

// Map function to count number of authors
stats.countAuthors = function(articles) {
  return articles.reduce(stats.uniqueAuthor , 0);
};

// Map function to count number of words in each article
stats.countWords = function(articles) {
  return articles.map(stats.wordCounter).reduce(stats.summer, 0);
};

// Map function to return average word length per article
stats.avgWL = function(articles) {
  return articles.map(stats.wlCounter).reduce(stats.summer, 0) / stats.wordCount;
};

// Map function to return the author of the article
stats.getAuthors = function(art) {
  return art.author;
};

// Sums the word lengths by author, tagging along the word count
stats.authorCount = function(counter, a) {
  if(counter[0].indexOf(a.author) < 0) {
    counter[0].push(a.author);
    counter[1].push([a.wl, a.words]);
  } else {
    counter[1][counter[0].indexOf(a.author)][0] += a.wl;
    counter[1][counter[0].indexOf(a.author)][1] += a.words;
  }
  return counter;
};

// Averages the word length by author
stats.wlAverager = function(counter, a) {
  counter.push(a[0] / a[1]);
  return counter;
};

// Returns the average word lengths sorted by author
stats.avgWLAuthor = function(articles) {
  var wls = articles.map(stats.wlCounterWithAuthor);
  var arr = wls.reduce(stats.authorCount, [[], []]);
  return [arr[0], arr[1].reduce(stats.wlAverager, [])];
};

// Totals the words per author
stats.wordAuthorTotaler = function(counter, a) {
  counter.push(a[1]);
  return counter;
};

// Counts the number of words per author
stats.countWordsAuthor = function(articles) {
  var wls = articles.map(stats.wlCounterWithAuthor);
  var arr = wls.reduce(stats.authorCount, [[], []]);
  return [arr[0], arr[1].reduce(stats.wordAuthorTotaler, [])];
};

// Main function
$(function() {
  $.getJSON('scripts/blogArticles.json', function(data) {
    stats.wordCount = stats.countWords(data);
    $('#numArticles').append('Number of Articles: ' + stats.countArticles(data));
    $('#numAuthors').append('Number of Authors: ' + stats.countAuthors(data));
    $('#numWords').append('Number of Words: ' + stats.wordCount);
    $('#avgWL').append('Average Word Length: ' + stats.avgWL(data));
    $('#avgWLAuthor').prepend('Average Word Length Per Author:');
    $('#numWordsAuthor').prepend('Number of Words Per Author:');

    var wlAuthorStats = stats.avgWLAuthor(data);
    var wordAuthorStats = stats.countWordsAuthor(data);

    // These 'for' loop is only for putting the HTML lists!!
    for(var i = 0; i < wlAuthorStats[0].length; i++) {
      $('#authList').append('<li>' + wlAuthorStats[0][i] + ': ' + wlAuthorStats[1][i] + '</li>');
    }

    for(i = 0; i < wordAuthorStats[0].length; i++) {
      $('#authList2').append('<li>' + wordAuthorStats[0][i] + ': ' + wordAuthorStats[1][i] + '</li>');
    }
  });
});
