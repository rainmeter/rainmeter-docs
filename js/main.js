// Spice up the side nav.
(function() {
	var $nav = $('#sidenav');
	if ($nav) {
		var href = location.protocol + '//' + location.hostname + location.pathname;
		$('li', $nav).each(function() {
			var $li = $(this);
			$li.children('ul').after(function() {
				var $ul = $(this);
				return $(document.createElement('span')).click(function() {
					$ul.toggleClass('hide');
					$(this).toggleClass('open');
				});
			});

			$li.children('a').each(function() {
				var $a = $(this);
				if (href == this.href) {
					$a.addClass('selected');
					return false;
				} else if (href.indexOf(this.href) == -1) {
					$a.next().addClass('hide');
				}
			});
		});
	}
})();

// Make ctrl+click on <dt> and <hN> tags anchor the page with id.
(function() {
	$(['dt', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']).each(function () {
		$(this).each(function() {
			if (this.id) {
				$(this).click(function(e) {
					if (e.ctrlKey) {
						window.location.hash = this.id;
					}
				});
			}
		});
	});
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

// Based on Slimbox v2.04, (c) 2007-2010 Christophe Beyls <http://www.digitalia.be>, MIT-style license
(function() {
	// Global variables, accessible to Slimbox only
	var win = $(window), options, images, activeImage = -1, activeURL, compatibleOverlay, middle, centerWidth, centerHeight,
		ie6 = !window.XMLHttpRequest, hiddenElements = [], documentElement = document.documentElement,

	// Preload image
	preload = {},

	// DOM elements
	overlay, center, image, sizer;

	$(function() {
		// Append the Slimbox HTML code at the bottom of the document
		$("body").append(
			$([
				overlay = $('<div id="lbOverlay" />')[0],
				center = $('<div id="lbCenter" />')[0]
			]).click(close).css("display", "none")
		);

		image = $('<div id="lbImage" />').appendTo(center).append(
			sizer = $('<div style="position: relative;" />')[0]
		)[0];
	});

	// Open Slimbox with the specified parameters
	$.slimbox = function(_images, startImage, _options) {
		options = $.extend({
			overlayOpacity: 0.6,
			overlayFadeDuration: 200,
			resizeDuration: 200,
			resizeEasing: "swing",
			initialWidth: 250,
			initialHeight: 250,
			imageFadeDuration: 200,	
			closeKeys: [27 /* ESC */, 88 /* x */, 67 /* c */],
		}, _options);

		// The function is called for a single image, with URL and Title as first two arguments
		if (typeof _images == "string") {
			_images = [[_images, startImage]];
			startImage = 0;
		}

		middle = win.scrollTop() + (win.height() / 2);
		centerWidth = options.initialWidth;
		centerHeight = options.initialHeight;
		$(center).css({top: Math.max(0, middle - (centerHeight / 2)), width: centerWidth, height: centerHeight, marginLeft: -centerWidth/2}).show();
		compatibleOverlay = ie6 || (overlay.currentStyle && (overlay.currentStyle.position != "fixed"));
		if (compatibleOverlay) overlay.style.position = "absolute";
		$(overlay).css("opacity", options.overlayOpacity).fadeIn(options.overlayFadeDuration);
		position();
		setup(1);

		images = _images;
		return changeImage(startImage);
	};

	$.fn.slimbox = function(_options, linkMapper, linksFilter) {
		linkMapper = linkMapper || function(el) {
			return [el.href, el.title];
		};

		linksFilter = linksFilter || function() {
			return true;
		};

		var links = this;

		return links.unbind("click").click(function() {
			// Build the list of images that will be displayed
			var link = this, startIndex = 0, filteredLinks, i = 0, length;
			filteredLinks = $.grep(links, function(el, i) {
				return linksFilter.call(link, el, i);
			});

			// We cannot use jQuery.map() because it flattens the returned array
			for (length = filteredLinks.length; i < length; ++i) {
				if (filteredLinks[i] == link) startIndex = i;
				filteredLinks[i] = linkMapper(filteredLinks[i], i);
			}

			return $.slimbox(filteredLinks, startIndex, _options);
		});
	};

	function position() {
		var l = win.scrollLeft(), w = win.width();
		$(center).css("left", l + (w / 2));
		if (compatibleOverlay) $(overlay).css({left: l, top: win.scrollTop(), width: w, height: win.height()});
	}

	function setup(open) {
		if (open) {
			$("object").add(ie6 ? "select" : "embed").each(function(index, el) {
				hiddenElements[index] = [el, el.style.visibility];
				el.style.visibility = "hidden";
			});
		} else {
			$.each(hiddenElements, function(index, el) {
				el[0].style.visibility = el[1];
			});
			hiddenElements = [];
		}
		var fn = open ? "bind" : "unbind";
		win[fn]("scroll resize", position);
		$(document)[fn]("keydown", keyDown);
	}

	function keyDown(event) {
		var code = event.keyCode, fn = $.inArray;
		// Prevent default keyboard action (like navigating inside the page)
		return (fn(code, options.closeKeys) >= 0) ? close() : false;
	}

	function changeImage(imageIndex) {
		if (imageIndex >= 0) {
			activeImage = imageIndex;
			activeURL = images[activeImage][0];

			stop();

			preload = new Image();
			preload.onload = animateBox;
			preload.src = activeURL;
		}

		return false;
	}

	function animateBox() {
		$(image).css({backgroundImage: "url(" + activeURL + ")", visibility: "hidden", display: ""});
		$(sizer).width(preload.width);
		$(sizer).height(preload.height);

		centerWidth = image.offsetWidth;
		centerHeight = image.offsetHeight;
		var top = Math.max(0, middle - (centerHeight / 2));
		if (center.offsetHeight != centerHeight) {
			$(center).animate({height: centerHeight, top: top}, options.resizeDuration, options.resizeEasing);
		}
		if (center.offsetWidth != centerWidth) {
			$(center).animate({width: centerWidth, marginLeft: -centerWidth/2}, options.resizeDuration, options.resizeEasing);
		}
		$(center).queue(function() {
			$(image).css({display: "none", visibility: "", opacity: ""}).fadeIn(options.imageFadeDuration);
		});
	}

	function stop() {
		preload.onload = null;
		preload.src = activeURL;
		$([center, image]).stop(true);
		$(image).hide();
	}

	function close() {
		if (activeImage >= 0) {
			stop();
			activeImage = -1;
			$(center).hide();
			$(overlay).stop().fadeOut(options.overlayFadeDuration, setup);
		}

		return false;
	}
})();

(function() {
	if (!/android|iphone|ipod|series60|symbian|windows ce|blackberry/i.test(navigator.userAgent)) {
		jQuery(function($) {
			$("a[rel^='lightbox']").slimbox({}, null, function(el) {
				return (this == el) || ((this.rel.length > 8) && (this.rel == el.rel));
			});
		});
	}
})();