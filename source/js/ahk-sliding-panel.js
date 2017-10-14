
/*
Info must contain:
	id selector
Info can contain:
	side - left or right
	width - %, px or whatever
	slide_time - a double or int value eg 1, 0.5
	z_index - int value for the z-index of the menu
	touch_boundary - int value which turns into px - the amount of distance from the side that it will detect touching
*/
function ahk_slideout(info){

	//constants
	var panel = undefined;
	var initialPanelStyles = {
	};

	//default width
	var width = "50%";
	//transition time
	var slide_time = "0.5";
	//panel out
	var slideOut = false;
	//z-index
	var z_index = "999";
	//touch boundary
	var touch_boundary = 100

	//applies the initial styles to the panel
	function applyStyles(styles){
		for(style in styles){
			panel.style[style] = styles[style];
		}
	}
	function close(){
		if (left){
			panel.style.left = "-"+width;
		}
		else{
			panel.style.right = initialPanelStyles.right;
		}
		slideOut = false;
	}
	function open(){
		if (left){
			panel.style.left = 0;
		}
		else{
			panel.style.right = 0;
		}
		slideOut = true;
	}

	//critical checking
	if (!info || !info.id){
		console.error("ID of panel not set");
	}
	else{
		panel = document.getElementById(info.id);
	}

	if (!panel){
		console.error("Could not get panel using id supplied");
	}
	else{
		//set defaults and get items from info

		//set left boolean rather than function
		var left = true;

		//check if setting right - already left
		if (info.side && info.side == "right"){
			left = false;
		}

		//check width
		if (info.width){
			width = info.width;
		}
		//add to styles
		initialPanelStyles.width = width;

		//check time
		if (info.slide_time){
			slide_time = info.slide_time;
		}
		//add
		if (left){
			initialPanelStyles.transition = "left " + slide_time + "s ease";
		}
		else{
			initialPanelStyles.transition = "right " + slide_time + "s ease";
		}

		//z-index
		if (info.z_index){
			z_index = info.z_index;
		}
		initialPanelStyles.zIndex = z_index;

		//set position
		if (left && window.innerWidth < 991) {
			initialPanelStyles.left = "-"+width;
		}
		if (left && window.innerWidth > 991 ) {
			initialPanelStyles.left = "0";
		}
		else{
			initialPanelStyles.right = "-"+width;
		}

		//touch boundary
		if (info.touch_boundary){
			touch_boundary = (window.innerWidth/100) * info.touch_boundary;
		}

		//add the styles to the panel
		applyStyles(initialPanelStyles);

		//add the touch listeners on load
		window.addEventListener("load", function(){
			window.addEventListener("touchstart", touchStart, false);
			window.addEventListener("touchmove", touchDrag, false);
			window.addEventListener("touchend", touchEnd, false);
		});

		// when the windows is resized, reapply position
		window.addEventListener("resize", function(){
			if (left && window.innerWidth < 991) {
				panel.style.left = "-"+width;
			}
			// keep panel open when resized
			if (left && (slideOut == true) && window.innerWidth < 991) {
				panel.style.left = "0";
			}
			if (left && window.innerWidth > 991 ) {
				panel.style.left = "0";
			}
		}, true);

		//public functions
		this.toggleMenu = function(){
			if (slideOut){
				this.closeMenu();
			}
			else{
				this.openMenu();
			}
		};

		this.closeMenu = close;
		this.openMenu = open;

	}

	//variables needed for the drag ability
	var dragging = false,
		dragOffset = undefined,
		offSetTouch, //the touch factored in with the drag offset
		firstXTouch, //the x axis
		firstYTouch, //y axis
		startTime,
		threshold = 50, //the distance needed for a swipe
		allowedTime = 200, //the amount of time to do a swipe in
		restraint = 100 //the vertical amount you cannot exceed for a horizontal swipe

	function touchStart(event){
		//grab items
		var x = event.touches[0].pageX;

		firstXTouch = x;
		firstYTouch = event.touches[0].pageY;
		startTime = new Date().getTime();

		//check within the boundary for touches
		var within = false;

		//if closed
		if (!slideOut){
			if (left && x <= touch_boundary){
				within = true;
			}
			else if (!left && x >= window.innerWidth-touch_boundary){
				within = true;
			}
		}

		//if within boundary or open
		if (within || slideOut){
			/*if (left && x > panel.offsetWidth){
				panel.style.left = initialPanelStyles.left;
				slideOut = false;
			}
			else if (!left && window.innerWidth-x > panel.offsetWidth){
				panel.style.right = initialPanelStyles.right;
				slideOut = false;
			}*/

			dragging = true;
			panel.style.transition = "none";
			dragOffset = x;
			setPosition(x);

		}
	}

	//when moving the touch
	function touchDrag(event){
		//if in dragging mode, set the position of the menu
		if (dragging){
			setPosition(event.touches[0].pageX);
		}
	}

	//finger lifted up
	function touchEnd(event){
		if (dragging){
			//turn transition back on
			panel.style.transition = initialPanelStyles.transition;

			//detect if swiped left or right
			//get the amount of time from start to finish
			var elapsedTime = new Date().getTime() - startTime;
			var swipeLeft = false;
			var swipeRight = false;

			if (elapsedTime <= allowedTime){
				//get the distance between the first and last touches
				var lastXTouch = event.changedTouches[0].pageX;
				var lastYTouch = event.changedTouches[0].pageY;
				var distX = lastXTouch - firstXTouch;
				var distY = lastYTouch - firstYTouch;

				//within the time, check distance and if diagonal
				if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){
					//right of left swipe
					(distX < 0) ? swipeLeft = true : swipeRight = true;
				}
			}

			//if closed and swipe open - open
			//if open and swipe close - close
			//if open and touched on the outside of menu- close
			//if over half way - open
			//if not over half way - close

			if (left){

				if (slideOut && swipeLeft){
					close()
				}
				else if (!slideOut && swipeRight){
					open()
				}
				else if (slideOut && event.changedTouches[0].pageX > offSetTouch){
					close();
				}
				else if (offSetTouch >= panel.offsetWidth/2){
					open();
				}
				else if (offSetTouch < panel.offsetWidth/2){
					close();
				}

			}
			else{

				if (slideOut && swipeRight){
					close()
				}
				else if (!slideOut && swipeLeft){
					open()
				}
				else if (slideOut && event.changedTouches[0].pageX < offSetTouch){
					close();
				}
				else if (window.innerWidth-offSetTouch >= panel.offsetWidth/2){
					open();
				}
				else if (window.innerWidth-offSetTouch < panel.offsetWidth/2){
					close();
				}

			}

			//no longer dragging
			dragging = false;
			dragOffset = undefined;
		}
	}

	function setPosition(x){
		var wWidth = window.innerWidth;
		//calculate the simulated touch position given the original touch position
		if (dragOffset){
			if (left){
				if (slideOut){
					x = panel.offsetWidth - (dragOffset - x);
				}
				else{
					x = x - dragOffset;
				}
			}
			else{
				if (slideOut){
					x = (wWidth-panel.offsetWidth) + (x-dragOffset);
				}
				else{
					x = wWidth-(dragOffset-x);
				}
			}
		}

		//check if not fully extended
		if (left && x <= panel.offsetWidth){
			panel.style.left = "-" + (panel.offsetWidth - x) +"px";
			offSetTouch = x;
		}
		else if (!left && window.innerWidth-x <= panel.offsetWidth){
			panel.style.right = "-" + (panel.offsetWidth - (wWidth-x)) + "px";
			offSetTouch = x;
		}

	}
}
