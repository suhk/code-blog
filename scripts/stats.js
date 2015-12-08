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

stats.wlAverager = function(art) {
    return 0;
}

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
    return articles.map(stats.wlAverager).reduce(stats.summer, 0) / articles.length;
}

$(function() {
    $.getJSON('scripts/blogArticles.json', function(data) {
        $('#numArticles').append('Number of Articles: ' + stats.countArticles(data));
        $('#numAuthors').append('Number of Authors: ' + stats.countAuthors(data));
        $('#numWords').append('Number of Words: ' + stats.countWords(data));
        $('#avgWL').append('Number of Words Per: ' + stats.avgWL(data));
    });
});
