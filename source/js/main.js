// Spice up the side nav.
(function() {
	var $nav = $('#tree');
	if ($nav) {
		var path = location.pathname.replace(/\/$/, '');
		$('li', $nav).each(function() {
			var $li = $(this);
			$li.children('a').each(function() {
				var $a = $(this);
				if (path == this.pathname) {
					$a.addClass('active');
					return false;
				} else if (path.indexOf(this.pathname) == -1) {
					$a.next().addClass('hide');
				}
			});

			$li.children('ul').after(function() {
				var $ul = $(this);
				var $span = $(document.createElement('span')).addClass('expander');

				if ($ul.hasClass('hide')) {
					$span.addClass('open');
				}

				return $span.click(function() {
					$ul.toggleClass('hide');
					$(this).toggleClass('open');
				});
			});
		});
	}
})();

// Make ctrl+click on <dt> and <hN> tags anchor the page with id.
(function() {
	var tags = ['dt', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
	for (i = 0; tag = tags[i]; ++i) {
		$(tag).each(function() {
			if (this.id) {
				$(this).click(function(e) {
					if (e.ctrlKey) {
						window.location.hash = this.id;
					}
				});
			}
		});
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

(function() {
	var elems = document.getElementsByClassName('lightbox');
	if (elems.length > 0) {
		document.body.innerHTML += '<div id="lightbox-wrap"></div>'
		var wrap = document.body.lastChild;
		wrap.onclick = function() {
			wrap.style.animation = '';
			wrap.style.display = 'none';
		};

		for (var i = 0, elem; elem = elems[i]; ++i) {
			elem.onclick = function() {
				// Switch to the image in unsupported browsers.
				if (wrap.style.animation === undefined &&
					wrap.style.webkitAnimation === undefined) {
					location = this.src;
					return;
				}

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
