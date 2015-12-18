var Blog = function() {
  this.articles = []; // Instantiate an array of articles
  this.cat = 'None'; // The current selected category
  this.auth = 'None'; // The current selected author
};

// Grab the article template and make a handlebars function
Blog.prototype.compileTemplate = function(data) {
  Article.prototype.compiledTemplate = Handlebars.compile(data);
};

Blog.prototype.init = function() {
  // Sort the articles by date (recent first)
  this.sortData();
  // HTMLizes the articles
  for(i = 0; i < this.articles.length; i++) {

    this.articles[i].toHTML('main');
  }

  this.init2();
};

Blog.prototype.init2 = function() {

  $('#home').show();
  $('#about').hide();
  $('.filter').show();

  // Hide everything but the first paragraph
  $('article p:not(:first-child)').hide();

  // Get the list of categories and authors for sorting and put them into dropdowns
  if($('#category').length <= 1) {
    var cats = [];
    var auths = [];

    for(i = 0; i < this.articles.length; i++) {
      // If it is a new category, add it to the list
      if(cats.indexOf(this.articles[i].category) < 0) {
        cats.push(this.articles[i].category);

        var $op = $('option:first').clone();
        $op.text(this.articles[i].category);
        $('#category').append($op);
      }

      // If it is a new author, add it to the list
      if(auths.indexOf(this.articles[i].author) < 0) {
        auths.push(this.articles[i].author);

        var $op2 = $('option:first').clone();
        $op2.text(this.articles[i].author);
        $('#author').append($op2);
      }
    }
  }
};

Blog.prototype.getParameterByKey = function(key) {
  var match = RegExp('[?&]' + key + '=([^&]*)').exec(window.location.search);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
};

Blog.prototype.isAdmin = function() {
  var admin = blog.getParameterByKey('admin');
  if (admin == 'true') {
    return true;
  }
  return false;
};

Blog.prototype.addEvents = function() {
  // Add click event for 'read more'
  $('main').on('click', '.expand', function(e) {
    e.preventDefault();

    $(this).parent().find('p').fadeIn(500);
    $(this).fadeOut();
  });

  // Add event handler for category search
  $('#category').on('change', function() {
    $('#author').val('null'); // Resets the author filter
    this.cat = $('#category option:selected').text(); // Set the category filter

    // If you select 'None', show all articles
    // Otherwise, show filtered articles
    if(this.cat == '--') {
      page('/');
    } else {
      page('/category/' + $('#category option:selected').text());
    }
  });

  // Add event handler for author search
  $('#author').on('change', function() {
    $('#category').val('null'); // Resets the author filter
    this.auth = $('#author option:selected').text(); // Set the author filter

    // If you select 'None', show all articles
    // Otherwise, show filtered articles
    if(this.auth == '--') {
      page('/');
    } else {
      page('/author/' + $('#author option:selected').text());
    }
  });
};

// CompareByDate function for sorting the articles
// Taken from Microsoft website
Blog.prototype.sortData = function() {
  this.articles.sort(
    function compareByDate(a, b) {
      if (a.daysElapsed < b.daysElapsed)
        return -1;
      if (a.daysElapsed > b.daysElapsed)
        return 1;
      return 0;
    }
  );
};
