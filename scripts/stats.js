stats = {};

stats.uniqueAuthor = function(counter, a) {
    if(stats.auths.indexOf(a.author) < 0) {
        stats.auths.push(a.author);
        return counter + 1;
    } else {
        return counter;
    }
};

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

stats.wordCounter = function(art) {
    var body = stats.removeMd(art.markdown);
    return body.split(new RegExp(' ', 'g')).length;
};

stats.summer = function(counter, a) {
    return counter + a;
};

stats.strLength = function(str) {
    return str.length;
};

stats.wlCounter = function(art) {
    var body = stats.removeMd(art.markdown);
    return body.split(new RegExp(' ', 'g')).map(stats.strLength).reduce(stats.summer, 0);
};

stats.wlCounterWithAuthor = function(art) {
    var body = stats.removeMd(art.markdown);
    return {wl: body.split(new RegExp(' ', 'g')).map(stats.strLength).reduce(stats.summer, 0), author: art.author, words: body.split(new RegExp(' ', 'g')).length};
};

stats.countArticles = function(articles) {
    return articles.length;
};

stats.countAuthors = function(articles) {
    stats.auths = [];
    return articles.reduce(stats.uniqueAuthor , 0);
};

stats.countWords = function(articles) {
    return articles.map(stats.wordCounter).reduce(stats.summer, 0);
};

stats.avgWL = function(articles) {
    return articles.map(stats.wlCounter).reduce(stats.summer, 0) / stats.wordCount;
};

stats.getAuthors = function(art) {
    return art.author;
};

stats.someFunction = function(counter, a) {
    if(counter[0].indexOf(a.author) < 0) {
        counter[0].push(a.author);
        counter[1].push([a.wl, a.words]);
    } else {
        counter[1][counter[0].indexOf(a.author)][0] += a.wl;
        counter[1][counter[0].indexOf(a.author)][1] += a.words;
    }
    return counter;
};

stats.someOtherFunction = function(counter, a) {
    counter.push(a[0] / a[1]);
    return counter;
};

stats.avgWLAuthor = function(articles) {
    var wls = articles.map(stats.wlCounterWithAuthor);
    var arr = wls.reduce(stats.someFunction, [[], []]);
    return [arr[0], arr[1].reduce(stats.someOtherFunction, [])];
};

$(function() {
    $.getJSON('scripts/blogArticles.json', function(data) {
        stats.wordCount = stats.countWords(data);
        $('#numArticles').append('Number of Articles: ' + stats.countArticles(data));
        $('#numAuthors').append('Number of Authors: ' + stats.countAuthors(data));
        $('#numWords').append('Number of Words: ' + stats.wordCount);
        $('#avgWL').append('Average Word Length: ' + stats.avgWL(data));
        $('#avgWLAuthor').prepend('Average Word Length Per Author:');
        var wlAuthorStats = stats.avgWLAuthor(data);
        for(var i = 0; i < wlAuthorStats[0].length; i++) {
            $('#authList').append('<li>' + wlAuthorStats[0][i] + ': ' + wlAuthorStats[1][i] + '</li>');
        }
    });
});
