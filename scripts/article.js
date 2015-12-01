var Article = function(props) {
    this.author = props.author;
    this.authorUrl = props.authorUrl;
    this.category = props.category;
    this.title = props.title;
    this.body = props.body;
    this.publishedOn = props.publishedOn;
    var date = new Date(this.publishedOn);
    var today = new Date();
    this.daysElapsed = Math.round((today - date) / 1000 / 60 / 60 / 24);

}

// Turns an article object into HTML code
Article.prototype.toHTML = function () {
    return '<article>' +
        '<h1>' + this.title + '</h1>' +
        '<h3>Written by <em><a href=' + this.authorUrl + '>' + this.author + '</a></em> ' +
        this.daysElapsed + ' days ago</h3>' +
        '<h5>Category: ' + this.category + '</h5>' +
        '<p>' + this.body + '</p>' +
        '</article>';
}
