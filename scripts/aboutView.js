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
  $('#content').append(data);
};
