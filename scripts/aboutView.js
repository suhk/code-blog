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
  data.forEach(function(repo) {
    $('.content').append(repo.name);
    console.log(repo.name);
  });

};
