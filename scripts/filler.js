// CompareByDate function for sorting the articles
// Taken from Microsoft website
function compareByDate(a, b) {
    if (a.daysElapsed < b.daysElapsed)
        return -1;
    if (a.daysElapsed > b.daysElapsed)
        return 1;
    return 0;
}

// Pull article data from rawData and create Article objs
for(i = 0; i < blog.rawData.length; i++)
    blog.articles.push(new Article(blog.rawData[i]));

// Sort the articles by date (recent first)
blog.articles.sort(compareByDate);

// HTMLizes the articles
for(i = 0; i < blog.articles.length; i++)
    $('main').append(blog.articles[i].toHTML());
