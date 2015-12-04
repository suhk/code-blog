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
Article.prototype.toHTML2 = function () {
    var $art = $('article:first').clone();

    $art.find('h1').append(this.title);

    $art.find('h3').attr('class', this.author.replace(/\s/g, ''));
    $art.find('h3').prepend("Written by");

    $art.find('.auth').append(this.author);
    $art.find('.auth').attr('href', this.authorUrl)

    $art.find('h3').append(" about " + this.daysElapsed + " days ago");

    $art.find('h5').append("Category: " + this.category);
    $art.find('h5').attr('class', this.category);

    $art.find('.body').append(this.body);

    $art.find('.expand').append("Read More >");

    $('main').append($art);
}

// Takes the handlebars template, fill it, and add it to the web page
Article.prototype.toHTML = function () {
    var data = {
        author: this.author,
        authorUrl: this.authorUrl,
        category: this.category,
        daysElapsed: this.daysElapsed,
        body: this.body,
        authorSpace: this.author.replace(/\s/g, '')
    };
    var appTemplate = $('#template').html()
    var compiledTemplate = Handlebars.compile(appTemplate);
    var html = compiledTemplate(data);
    $('main').append(html);
}
