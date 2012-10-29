// Fixes local view of the source HTML files.
(function() {
	var body = document.getElementsByTagName('body')[0];
	var title = body.innerHTML.match(/title: '(.*)'/m)[1];

	document.write(
		'<link href="css/main.css" rel="stylesheet">' +
		'<body>' +
		'	<div class="wrapper">' +
		'		<div class="top">' +
		'			<div class="container">' +
		'				<div id="logo"></div>' +
		'				<nav id="nav">' +
		'					<ul>' +
		'					<li><a href="//rainmeter.net">Home</a>' +
		'					<li><a href="//rainmeter.net/cms/About">About</a>' +
		'					<li><a href="/" class="active">Docs</a>' +
		'					<li><a href="//rainmeter.net/cms/Discover">Discover</a>' +
		'					<li><a href="//rainmeter.net/cms/Develop">Develop</a>' +
		'					<li><a href="//rainmeter.net/forum">Forum</a>' +
		'					</ul>' +
		'				</nav>' +
		'			</div>' +
		'		</div>' +
		'		<div class="container">' +
		'			<div class="row">' + 
		'				<div id="side-content" style="height: 400px;"></div>' +
		'				<div id="content">' +
		'					<header><h1>' + title + '</h1></header>' +
		'					<article>');

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