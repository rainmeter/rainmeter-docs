// Helpers based on https://github.com/cferdinandi/buoy.
function hasClass(elem, className) {
	return new RegExp('(^|\\s)' + className + '(\\s|$)').test(elem.className);
}
function addClass(elem, className) {
	if (!hasClass(elem, className)) {
		elem.className += (elem.className ? ' ' : '') + className;
	}
}
function removeClass(elem, className) {
	if (hasClass(elem, className)) {
		elem.className = elem.className.replace(new RegExp('(^|\\s)*' + className + '(\\s|$)*', 'g'), '');
	}
}
function toggleClass(elem, className) {
	if (hasClass(elem, className)) {
		removeClass(elem, className);
	} else {
		addClass(elem, className);
	}
}
// Spice up the side nav.
(function() {
	var nav = document.getElementById('sidenav');
	if (nav) {
		var path = location.pathname.replace(/\/$/, '').replace(/^\//, '');
		var lis = nav.getElementsByTagName('li');
		for (var i = 0, li; li = lis[i]; ++i) {
			var a = li.firstChild;
			if (!a) continue;
			var ul = li.children[1];
			var aPath = a.pathname.replace(/\/$/, '').replace(/^\//, '');
			if (path == aPath && !a.hash) {
				addClass(a, 'active');
			} else if (path.indexOf(aPath) != 0) {
				if (ul) {
					addClass(ul, 'hide');
				}
			}
			if (ul) {
				var span = document.createElement('span');
				addClass(span, 'expander');
				if (hasClass(ul, 'hide')) {
					addClass(span, 'open');
				}
				span.onclick = (function(ul) {
					return function() {
						toggleClass(ul, 'hide');
						toggleClass(this, 'open');
					};
				})(ul);
				ul.parentNode.appendChild(span);
			}
		}
	}
})();

// Make ctrl+click on <dt> and <hN> tags anchor the page with id.
(function() {
	var tags = ['dt', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span'];
	for (i = 0; tag = tags[i]; ++i) {
		var elems = document.getElementsByTagName(tag);
		for (var j = 0, elem; elem = elems[j]; ++j) {
			if (elem.id) {
				elem.onclick = function(e) {
					if (e.ctrlKey) {
						window.location.hash = this.id;
					}
				};
			}
		}
	}
})();

// Add 'Select all' and 'Download' buttons to <pre> blocks.
(function() {
	var divs = document.getElementsByClassName('highlight');
	for (var i = 0; div = divs[i]; ++i) {
		var selectA = document.createElement('a');
		selectA.innerHTML = 'Select all';

		// Force the 'Select All' button to use the same color as 'Download' button via bootstrap
		selectA.href= 'javascript:void(0);';

		var pre = div.getElementsByTagName('pre')[0];
		var scrollWidth = pre.offsetWidth - pre.clientWidth;

		selectA.style.right = scrollWidth + 'px';
		if (scrollWidth > 2) {
			selectA.style.borderRight = 0;
		}
		else {
			selectA.style.borderRight = '.05rem';
			selectA.style.borderTopRightRadius = '.25rem';
		}

		selectA.style.top += 1 + 'px';

		selectA.onclick = function() {
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

		div.appendChild(selectA);

		var downloadA = div.previousElementSibling;
		if (downloadA && downloadA.className == 'download') {
			downloadA.innerHTML = 'Download';
			downloadA.style.right = scrollWidth + selectA.offsetWidth + 'px';
			downloadA.style.borderRight = 0;
			downloadA.style.top = 1 + 'px';
			div.appendChild(downloadA);
		}
	}
})();
