/* 
 * SVG curve example
 *
 * By Craig Buckler,		http://twitter.com/craigbuckler
 * of OptimalWorks.net		http://optimalworks.net/
 * for SitePoint.com		http://sitepoint.com/
 * 
 * Refer to:
 * http://www.sitepoint.com/html5-svg-quadratic-curves/
 * http://www.sitepoint.com/html5-svg-cubic-curves/
 *
 * This code can be used without restrictions.
 */
 
/*
 * Modified for SVG Arc's by Brian Ferguson for Rainmeter.net
 */

(function() {

	var container, svg, cType, code, point = {}, line = {}, fill = false, drag = null, dPoint, maxX, maxY;
	var rxEl = document.getElementById('rx');
	var ryEl = document.getElementById('ry');
	var angleEl = document.getElementById('angle');
	var largeEl = document.getElementById('large');
	var sweepEl = document.getElementById('sweep');

	// define initial points
	function Init() {
		var c = svg.getElementsByTagName("circle");
		for (var i = 0; i < c.length; i++) {
			point[c[i].getAttributeNS(null,"id")] = {
				x: parseInt(c[i].getAttributeNS(null,"cx"),10),
				y: parseInt(c[i].getAttributeNS(null,"cy"),10)
			};
		}

		// lines
		line.l1 = svg.getElementById("l1");
		line.l2 = svg.getElementById("l2");
		line.arc = svg.getElementById("arc");

		// code
		code = document.getElementById("svg_code");

		// event handlers
		svg.onmousedown = svg.onmousemove = svg.onmouseup = Drag;
		svg.ontouchstart = svg.ontouchmove = svg.ontouchend = Drag;

		DrawSVG();
	}

	// draw curve
	function DrawSVG() {
		var rx = rxEl.value;
		var ry = ryEl.value;
		var angle = angleEl.value;
		var large = largeEl.checked === true ? "1" : "0";
		var sweep = sweepEl.checked === true ? "1" : "0";
		var sweep1 = true === sweepEl.checked ? "0" : "1";  // SVG seems to be opposite of D2D

		// Build SVG Arc
		var d = 
			"M"+point.p1.x+","+point.p1.y+" "+cType+
			rx+","+ry+" "+" "+angle+" "+large+" "+sweep1+" " +
			point.p2.x+","+point.p2.y+
			(fill ? " Z" : "");
		line.arc.setAttributeNS(null, "d", d);

		// show code
		if (code) {
			var d1 = point.p1.x + "," + point.p1.y + "," + point.p2.x +
			"," + point.p2.y + "," + rx + "," + ry + "," + angle + "," +
			large + "," + sweep + "," +
			(fill ? "1" : "0");
			code.textContent = 'Shape=Arc '+ d1;
		}
	}

	// slider event listners
	['rx', 'ry', 'angle'].forEach(function (id) {
		document.getElementById(id).addEventListener('input', function (e) {
			DrawSVG();
		});
	});

	// checkbox event listeners
	['large', 'sweep'].forEach(function (id) {
		document.getElementById(id).addEventListener('change', function (e) {
			DrawSVG();
		});
	});

	// drag event handler
	function Drag(e) {
		e.stopPropagation();
		var t = e.target, id = t.id, et = e.type, m = MousePos(e);

		// toggle fill class
		if (!drag && et == "mousedown" && id == "arc") {
			fill = !fill;
			t.setAttributeNS(null, "class", (fill ? "fill" : ""));
			DrawSVG();
		}

		// start drag
		if (!drag && typeof(point[id]) != "undefined" && (et == "mousedown" || et == "touchstart")) {
			drag = t;
			dPoint = m;
		}

		// drag
		if (drag && (et == "mousemove" || et == "touchmove")) {
			id = drag.id;
			point[id].x += m.x - dPoint.x;
			point[id].y += m.y - dPoint.y;
			dPoint = m;
			drag.setAttributeNS(null, "cx", point[id].x);
			drag.setAttributeNS(null, "cy", point[id].y);
			DrawSVG();
		}

		// stop drag
		if (drag && (et == "mouseup" || et == "touchend")) {
			drag = null;
		}
	}

	// mouse position
	function MousePos(event) {
		return {
			x: Math.max(0, Math.min(maxX, event.pageX)),
			y: Math.max(0, Math.min(maxY, event.pageY))
		}
	}

	// start
	window.onload = function() {
		// Offset sliders for firefox only
		var isFirefox = typeof InstallTrigger !== 'undefined';
		if (isFirefox) {
			var sTop = document.getElementById("rx");
			var sRight = document.getElementById("ry");
			var curr = sTop.offsetLeft;
			sTop.style.left = curr - 20 + "px";
			curr = sRight.offsetTop;
			sRight.style.top = curr - 18 + "px";
		}

		container = document.getElementById("svg");
		if (container) {
			cType = container.className;
			maxX = container.offsetWidth;
			maxY = container.offsetHeight;
			svg = container.contentDocument;
			Init();
		}
	}
})();
