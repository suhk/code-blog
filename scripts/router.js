page('/', articleController.index);
page('/category/:category', articleController.category);
page('/author/:author', articleController.author);
page('/about', aboutController.index);
page.start();
