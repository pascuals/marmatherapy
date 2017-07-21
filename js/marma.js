(function(global, factory) {

	"use strict";

	if ( typeof module === "object" && typeof module.exports === "object" ) {
		module.exports = factory(global, true);
		
	} else
		factory(global);
	
})(typeof window !== "undefined" ? window : this, function(global, noGlobal) {

	"use strict";
	
	var $ = global.$;
	
	var marma = {},
		symptomsContainer, searchBox,
		symptoms, points;

	// Public
	
	marma = {
		symptomsContainer: function(symptomsContainerExpr) {
			this.symptomsContainer = $(symptomsContainerExpr);
		},
		
		searchBox: function(searchBoxExpr) {
			this.searchBox = $(searchBoxExpr);
			
			// search function
			this.searchBox.keyup(function() {
				let searchBox = $(this);
				let searchTerm = searchBox.val().toLowerCase();

				let symptoms = marma.symptomsContainer.find(".marma-symptom");
				
				symptoms.each(function() {
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
		
		setSymptoms: function(symptoms) {
			this.symptoms = symptoms;
			
			this.symptomsContainer.html("");
			
			Object.entries(this.symptoms).forEach(
			    ([key, value]) => {
			    	let symptom = $("<div>");
			    	symptom.attr("class", "marma-symptom");
			    	symptom.attr("id", key);
			    	symptom.data("points", value.points);
			    	symptom.text(value.title);
			    	
			    	this.symptomsContainer.append(symptom);
			    }
			);
		},

		marmaPoints: function(points) {
			this.points = points;
		},
		
		paintLine: function(x1, y1, x2, y2) {
			var a = x1 - x2, b = y1 - y2, c = Math.sqrt(a * a + b * b);
	
			var sx = (x1 + x2) / 2, sy = (y1 + y2) / 2;
	
			var x = sx - c / 2, y = sy;
	
			var alpha = Math.PI - Math.atan2(-b, a);
	
			return paintLineElement(x, y, c, alpha);
		}
	};

	// Private
	
	function  paintLineElement(x, y, length, angle) {
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
