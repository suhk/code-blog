
for(i = 0; i < blog.rawData.length; i++) {
    blog.articles.push(new Article(blog.rawData[i]));
}

for(i = 0; i < blog.articles.length; i++) {
    $('main').append(blog.articles[i].toHTML());
}
