// (Yes, the code is ugly and I should use jQuery.)

// Based on Sitemap Styler by Alen Grakalic (cssglobe.com)
(function() {
	var navlist = document.getElementById('sidenav');
	if (navlist) {
		var page = location.pathname;
		var parts = page.split('/');
		var partsIndex = 1;

		handleItem = function(item) {
			var itemLink = item.firstChild;
			var itemPage = itemLink ? itemLink.href.slice(itemLink.href.indexOf(location.hostname) + location.hostname.length) : "";

			var groups = item.getElementsByTagName('ul');
			if (groups.length > 0) {
				var group = groups[0];
				group.style.display = 'none';
				var span = document.createElement('span');
				span.className = 'collapsed';

				if (parts.length > partsIndex) {
					itemIds = itemPage.split('/');
					var match = false;
					for (var j = 1; itemId = itemIds[j]; ++j) {
						match = (parts[j] == itemId);
						if (!match) {
							break;
						}
					}
					
					if (match) {
						group.style.display = 'block';
						span.className = 'expanded';
						++partsIndex;
					}
				}

				span.onclick = function() {
					group.style.display = (group.style.display == 'none') ? 'block' : 'none';
					span.className = (group.style.display == 'none') ? 'collapsed' : 'expanded';
				};
				item.appendChild(span);
			}

			if (itemPage == page) {
				itemLink.className += ' selected';
			}
		};

		var items = navlist.getElementsByTagName('li');
		for (var i = 0; i < items.length; ++i) {
			handleItem(items[i]);
		}
	}
})();

// Make ctrl+click on <dt> tags anchor the page its id.
(function() {
	var elems = document.getElementsByTagName('dt');
	for (var i = 0; elem = elems[i]; ++i) {
		if (elem.id) {
			elem.onclick = function(e) {
				if (e.ctrlKey) {
					window.location.hash = this.id;
				}
			};
		}
	}
})();

// Add Select all to <pre> blocks.
(function() {
	var divs = document.getElementsByClassName('highlight');
	for (var i = 0; div = divs[i]; ++i) {

		// SELECT ALL
		var a = document.createElement('a');
		a.innerHTML = 'Select all';

		var pre = div.firstChild;
		var scrollWidth = pre.offsetWidth - pre.clientWidth - 2;
		a.style.right = scrollWidth + 'px';

		if (scrollWidth > 0) {
			a.style.borderRight = 0;
		}

		a.onclick = function() {
			var pre = this.parentNode.firstChild;
			if (document.body.createTextRange) {
				var range = document.body.createTextRange();
				range.moveToElementText(pre);
				range.select();
			} else if (window.getSelection) {
				var selection = window.getSelection();
				var range = document.createRange();
				range.selectNodeContents(pre);
				selection.removeAllRanges();
				selection.addRange(range);
			}
		};

		div.appendChild(a);

		// DOWNLOAD
		var prev = div.previousSibling;
		// Keep looking back until an element is found.
		do prev = prev.previousSibling;
		while (prev && prev.nodeType != 1);

		if (prev && prev.className == 'download') {
			prevHref = prev.href;
			prev.parentNode.removeChild(prev);

			var b = document.createElement('a');
			b.innerHTML = 'Download';
			b.style.right = scrollWidth + a.offsetWidth + 'px';
			b.style.borderRight = 0;
			b.href = prevHref;
			div.appendChild(b);
		}

	}
})();