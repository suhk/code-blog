var Article = function(props) {
    this.author = props.author;
    this.title = props.title;
    this.body = props.body;
    this.date = props.date;
}

Article.prototype.toHTML = function () {
    return '<article>' +
        '<h1>' + this.title + '</h1>' +
        '</article>';
}
