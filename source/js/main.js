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

(function() {
	if (location.hostname === 'rainmeter.github.io') {
		location.replace('http://docs.rainmeter.net');
	}
})();

// Spice up the side nav.
(function() {
	var nav = document.getElementById('tree');
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

		var pre = div.getElementsByTagName('pre')[0];
		var scrollWidth = pre.offsetWidth - pre.clientWidth;

		selectA.style.right = scrollWidth + 'px';
		if (scrollWidth > 0) {
			selectA.style.borderRight = 0;
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

(function() {
	var elems = document.getElementsByClassName('lightbox');
	if (elems.length > 0) {
		var wrap = document.createElement('div');
		wrap.id = 'lightbox-wrap';
		wrap.onclick = function() {
			wrap.style.animation = '';
			wrap.style.display = 'none';
		};

		document.body.appendChild(wrap);

		for (var i = 0, elem; elem = elems[i]; ++i) {
			elem.onclick = function() {
				var img = new Image();
				if (wrap.firstChild) wrap.removeChild(wrap.firstChild);
				wrap.appendChild(img);

				img.onload = function() {
					// Switch to the image if it's too large.
					if (this.width > window.innerWidth || this.height > window.innerHeight) {
						location = this.src;
						return;
					}

					// Center image.
					img.width = this.width;
					img.height = this.height;
					img.style.marginTop = ((window.innerHeight / 2) - (this.height / 2)) + 'px';

					wrap.style.display = 'block';
					wrap.style.outline = 'none';
					wrap.style.webkitAnimation = wrap.style.animation = 'kf-fade-in 0.4s';
				};
				img.src = this.src;
			};
		}
	}
})();
