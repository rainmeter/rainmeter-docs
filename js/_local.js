// Fixes local view of the source HTML files.
(function() {
	var body = document.getElementsByTagName('body')[0];
	var title = body.innerHTML.match(/title: '(.*)'/m)[1];

	document.write(
		'<link href="css/main.css" rel="stylesheet">' +
		'<div class="container"><div class="content">' +
		'<header><h1>' + title + '</h1></header>' +
		'<article>');

	// Fix highlight blocks.
	window.addEventListener('load', function() {
		body.innerHTML = body.innerHTML.
			replace(/{% highlight .*? %}/gm, '<div class="highlight"><pre>').
			replace(/{% endhighlight %}/gm, '</pre></div>');
	});

	// Fix <img> tags.
	window.addEventListener('load', function() {
		var imgs = document.getElementsByTagName('img');
		for (var i = 0; img = imgs[i]; ++i) {
			img.src = img.src.replace(/^.*?\/(manual|tips|snippets)\//, '$1/');
		}
	});
})();