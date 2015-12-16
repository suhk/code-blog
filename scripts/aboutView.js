aboutView = {};

aboutView.render = function() {

  $.ajax({
    type: 'GET',
    url: '/github/users/suhk/repos?sort=updated',
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
