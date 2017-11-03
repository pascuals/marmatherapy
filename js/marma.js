(function(global, factory) {

	"use strict";

	if ( typeof module === "object" && typeof module.exports === "object" ) {
		module.exports = factory(global, true);
		
	} else
		factory(global);
	
})(typeof window !== "undefined" ? window : this, function(global, noGlobal) {

	"use strict";
	
	let $ = global.$;
	
	var baseMarmaClass = "marma-";
	
	let marma = {
			options: {
				baseClassName: baseMarmaClass,
				groupClassName: baseMarmaClass + "group",
				pointClassName: baseMarmaClass + "point",
				pointLineClassName: baseMarmaClass + "point-line",
				pointDotClassName: baseMarmaClass + "point-dot",
				bodyClassName: baseMarmaClass + "body",
			},
		},
		groupsContainer, searchBox,
		groups, points;

	// Public
	
	marma = $.extend(marma, {
		groupsContainer: function(groupsContainerExpr) {
			this.groupsContainer = $(groupsContainerExpr);
		},
		
		searchBox: function(searchBoxExpr) {
			this.searchBox = $(searchBoxExpr);
			
			// search function
			this.searchBox.on("input", function() {
				let searchBox = $(this);
				let searchTerm = searchBox.val().toLowerCase();

				let groups = marma.groupsContainer.find("." + marma.options.groupClassName);
				
				groups.each(function() {
					let symp = $(this);
					
				    var text = symp.text().toLowerCase();
				    
				    if (text.indexOf(searchTerm) !== -1) {
				    	symp.fadeIn(400);
				    } else
				    	symp.hide();

				    if (searchBox.val() == '') {
				    	symp.show();
				    }
				});
			});
		},
		
		setGroups: function(groups) {
			this.groups = groups;
			
			this.groupsContainer.html("");
			
			Object.entries(this.groups).forEach(
			    ([key, value]) => {
			    	let group = $("<div>");
			    	group.addClass(marma.options.groupClassName);
			    	group.attr("id", key);
			    	group.data("points", value.points);
			    	group.text(value.title);
			    	
			    	this.groupsContainer.append(group);
			    }
			);
			
			this.groupsContainer.find("." + marma.options.groupClassName).on("click", function(e) {
				let group = $(e.currentTarget),
					points = group.data("points"),
					id = group.attr("id"),
					isClick = false;
				
				if(e.type === "click") {
					isClick = true;
					$("." + marma.options.groupClassName).removeClass("active");
					group.addClass("active");
				}

				$("." + marma.options.pointClassName + ", ." + marma.options.pointLineClassName + ", ." + marma.options.pointDotClassName).remove();
				
				for(let value of points) {
					let point = marma.points[value];
					
					if(point == null)
						continue;
					
					let pointElem = $("<div>");
					pointElem.attr("id", "point" + value);
					pointElem.attr("title", point.description);
					pointElem.addClass(marma.options.pointClassName);
					pointElem.text("[" + value + "] " + point.title);
					pointElem.css("top", point.top + "%");
					
					let dotElem = $("<div>");
					dotElem.attr("id", "dot" + value);
					dotElem.attr("title",point.description);
					dotElem.addClass(marma.options.pointDotClassName);
					dotElem.css("top", point.top + "%");
					dotElem.css("left", point.left + "%");
					
				 	let bodyElem = $("." + marma.options.bodyClassName + "-" +
						(point.front ? "front" : "back"));
						
					bodyElem.find(".body-refs").append(pointElem);
					bodyElem.find(".body-image").append(dotElem);
					
					//let lineElem = marma.paintLine(
							//pointElem.offset().left + pointElem.outerWidth(), pointElem.offset().top + pointElem.outerHeight() / 2,
							//dotElem.offset().left - 2, dotElem.offset().top + dotElem.outerHeight() / 2);
					
					//$(lineElem).addClass(marma.options.pointLineClassName);

					//$("body").append(lineElem);
				}
			});
		},

		setPoints: function(points) {
			this.points = points;
		},
		
		paintLine: function(x1, y1, x2, y2) {
			var a = x1 - x2, b = y1 - y2, c = Math.sqrt(a * a + b * b);
	
			var sx = (x1 + x2) / 2, sy = (y1 + y2) / 2;
	
			var x = sx - c / 2, y = sy;
	
			var alpha = Math.PI - Math.atan2(-b, a);
	
			return paintLineElement(x, y, c, alpha);
		}
	});

	
	// Private
	
	function paintMarmaPoints(points) {
		if(!points)
			return;
		
	}
	
	function paintLineElement(x, y, length, angle) {
		var line = document.createElement("div");
		
		var styles = 'border: 1px solid black; ' + 'width: ' + length + 'px; '
				+ 'height: 0px; ' + '-moz-transform: rotate(' + angle + 'rad); '
				+ '-webkit-transform: rotate(' + angle + 'rad); '
				+ '-o-transform: rotate(' + angle + 'rad); '
				+ '-ms-transform: rotate(' + angle + 'rad); '
				+ 'position: absolute; ' + 'top: ' + y + 'px; ' + 'left: ' + x
				+ 'px; ';

		line.setAttribute('style', styles);
		
		return line;
	}
	
	// Expose Marma identifier, even in AMD
	// and CommonJS for browser emulators (#13566)
	if ( !noGlobal ) {
		window.marma = marma;
	}

	return marma;
});
