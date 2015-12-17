aboutView = {};

aboutView.render = function() {

  $.ajax({
    type: 'GET',
    url: 'https://api.github.com/users/suhk/repos?sort=updated',
    header: {Authorization: 'token ' + githubToken},
    success: aboutView.getInfo
  });
};

aboutView.getInfo = function(data) {
  $('.content').show();
  $('.filter').hide();
  data.forEach(function(repo) {
    $('.content ul').append('<li>' + repo.name + '</li>');
  });

};
