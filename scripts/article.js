var Article = function(props) {
  this.author = props.author;
  this.authorUrl = props.authorUrl;
  this.category = props.category;
  this.title = props.title;
  this.body = marked(props.markdown);
  this.publishedOn = props.publishedOn;

  var date = new Date(this.publishedOn);
  var today = new Date();
  this.daysElapsed = Math.round((today - date) / 1000 / 60 / 60 / 24);
};

// Takes the handlebars template, fill it, and add it to the web page
Article.prototype.toHTML = function (selector) {
  var data = {
    title: this.title,
    author: this.author,
    authorUrl: this.authorUrl,
    category: this.category,
    daysElapsed: this.daysElapsed,
    body: this.body,
    authorSpace: this.author.replace(/\s/g, ''),
    categorySpace: this.category.replace(/\s/g, '')
  };

  var html = this.compiledTemplate(data);
  $(selector).append(html);
};
