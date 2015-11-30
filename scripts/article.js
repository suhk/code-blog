var Article = function(props) {
    this.author = props.author;
    this.authorUrl = props.authorUrl;
    this.category = props.category;
    this.title = props.title;
    this.body = props.body;
    this.publishedOn = props.publishedOn;
}

Article.prototype.toHTML = function () {
    return '<article>' +
        '<h1>' + this.title + '</h1>' +
        '<h2>' + this.authorUrl + '</h2>' +
        '<h3>' + this.category + '</h3>' +
        '<p>' + this.body + '</p>' +
        '</article>';
}
