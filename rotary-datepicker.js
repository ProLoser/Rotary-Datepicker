/*********************************
* jQuery Rotary DatePicker Plugin
* version: 0.0.1
* URL: https://github.com/ProLoser/Rotary-Datepicker
* Description: A new take on datepickers - Scroll or drag through rotary dials instead of 20 clicks on a calendar.
* Requires: jQuery v1.4+, mousewheel [optional], decent browser, patience.
* Author: Dean Sofer | ProLoser, [the other guys who are awesome and forked]
* Copyright: Copyright 2012 ProLoser
*********************************/

(function($) {

	$.widget('proloser.rotoDate', {
		options : {
			scroll: true,
			dials: ['days', 'months', 'years'], // 'hours', 'minutes', 'pm' coming soon...
			years: {
				start: 2008,
				stop: 2012
			}
		},
		_setOption: function(key, value) {
			// Use the _setOption method to respond to changes to options
			$.Widget.prototype._setOption.apply(this,arguments);
		},
		_create : function() {
			this.rotate = {
				years: 0,
				months: 0,
				days: 0
			};
			
			this.active = {
				years: '',
				months: '',
				days: ''
			};
			
			this.$picker = this._build();

			this.rotationSize = this._calculate();

			this._bind();
		},
		_destroy : function() {
			this.element.removeClass('.rotoDate .rotoDate-active');
			this.$picker.remove();
			$.Widget.prototype.destroy.call(this);
		},
		_build : function() {
			var $picker, $group, n, 
			months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

			$picker = $('<div class="rotoDate"></div>');

			$picker.append('<div class="rotoDate-container"></div>');

			// Adding Days
			$group = $('<ul></ul>');
			n = 32;
			while (--n) {
				$group.prepend('<li>'+n+'</li>');
			}
			$picker.append($group);
			$group = $group.wrap('<div class="rotoDate-days" />');

			// Adding Months
			$group = $('<ul></ul>');
			n = months.length;
			while (n--) {
				$group.prepend('<li>'+months[n]+'</li>');
			}
			$picker.append($group);
			$group = $group.wrap('<div class="rotoDate-months" />');

			// Adding Years
			$group = $('<ul></ul>');
			n = this.options.years.stop + 1;
			while (n--, n > this.options.years.start - 1) {
				$group.prepend('<li>'+n+'</li>');
			}
			$picker.append($group);
			$group = $group.wrap('<div class="rotoDate-years" />');

			$picker.append('<a class="rotoDate-toggle"></a>');

			this.element.addClass('rotoDate-target').after($picker);

			return $picker;
		},
		_calculate : function() {
			// The amount each dial must rotate for 1 step
			var rotationSize = {
				years: 0,
				months: 0,
				days: 0
			}, that = this;
			$.each(this.options.dials, function(i, radial){
				$('.rotoDate-'+radial+' li', that.$picker).each(function(i, elm){
					var count = $('.rotoDate-'+radial+' li', that.$picker).length;
					rotationSize[radial] = 360/count;
					that._rotator($(elm), i * rotationSize[radial]);
				});
			});
			return rotationSize;
		},
		_bind : function() {
			// Bind Toggle Button
			this._on({
				'focus' : 'open'
			});
			// Bind item Clicks
			this._on(this.$picker, {
				'click .rotoDate-toggle' : function(event){
					this.toggle();
					event.preventDefault();
				},
				'click li' : function(event, elm) {
					var $li = $(event.currentTarget);
					var rotation = $li.index() * 360 / ($li.siblings().length+1);
					var radial = $li.closest('div').attr('class').substr(9);
					this.rotate[radial] = rotation;
					this._rotator($li.closest('div'), rotation);
					this.active[radial] = $li.text();
					this._refresh();
				}
			});

			// Bind 'cancel' keypress
			this._on(this.document, { 'keyup' : function(event) {
				if ( this.options.closeOnEscape && !event.isDefaultPrevented() && event.keyCode &&
					event.keyCode === 27 ) {
					this.close();
					event.preventDefault();
				}
			} });
			
			// Bind scrolling
			if ($.fn.mousewheel && this.options.scroll) {
				var dials = this.options.dials.join(', .rotoDate-');
				var events = {};
				events['mousewheel .rotoDate-'+dials] = function(event, delta) {
					event.preventDefault();
					var $elm = $(event.currentTarget);
					var radialClass = $elm.attr('class');
					var radial = radialClass.substr(9);
					if (delta > 0) {
						this.rotate[radial] += this.rotationSize[radial];
					} else if (delta < 0) {
						this.rotate[radial] -= this.rotationSize[radial];
						if (this.rotate[radial] < 0) {
							this.rotate[radial] = 0;
						}
					}
					var item = Math.round((this.rotate[radial] % 360) / this.rotationSize[radial]);
					if (item > $('.'+radialClass+' li', this.$picker).length) {
						item = 0;
					}
					this.active[radial] = $('.'+radialClass+' li', this.$picker).eq(item).text();
					this._refresh();
					this._rotator($elm, this.rotate[radial]);
				};
				this._on(this.$picker, events);
			}
		},
		_rotator : function($elm, rotation) {
			$elm.css('transform', 'rotate(' + rotation + 'deg)');
			$elm.css('oTransform', 'rotate(' + rotation + 'deg)');
			$elm.css('mozTransform', 'rotate(' + rotation + 'deg)');
			$elm.css('webkitTransform', 'rotate(' + rotation + 'deg)');
		},
		_refresh : function() {
			var items = [];
			$.each(this.active, function(i, item) {
				items.push(item);
			});
			this.element.val(items.join(' - '));
		},
		open : function() {
			this.element.addClass('rotoDate-active');
			this.$picker.addClass('rotoDate-active');
		},
		close : function() {
			this.element.removeClass('rotoDate-active');
			this.$picker.removeClass('rotoDate-active');
		},
		toggle : function() {
			if (this.element.hasClass('rotoDate-active')) {
				this.close();
			} else {
				this.open();
			}
		}
	});
	
	
	/*///// OLD NON-FACTORY CODE /////
	
	$.fn.rotoDate = function( method ) {

		// Method calling logic
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.rotoDate' );
		}    

	};

	// plugin defaults
	$.fn.rotoDate.defaults = {
		scroll: true,
		dials: ['days', 'months', 'years'], // 'hours', 'minutes', 'pm' coming soon...
		years: {
			start: 2008,
			stop: 2012
		}
	};

	var methods = {
		init : function( options ) { 

			// extend the default options with those provided
			// extending an empty object prevents overriding of our defaults object
			var opts = $.extend({}, $.fn.rotoDate.defaults, options);

			// iterate through the matched elements
			// returning this at the end
			return this.each(function() {

				var $this = $(this);

				var $picker = build($this, opts);

				var rotationSize = calculate($this, $picker, opts);

				bind($this, $picker, opts, rotationSize);
			});
		},
		val : function( newValues ) {
			if (!newValues) {
				return values;
			}
		}
	};

	var rotate = {
		years: 0,
		months: 0,
		days: 0
	};
	var active = {
		years: '',
		months: '',
		days: ''
	}

	// private function that can only be used within the plugin
	function build($this, opts) {
		var $picker, $group, n, 
		months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

		$picker = $('<div class="rotoDate"></div>');

		$picker.append('<div class="rotoDate-container"></div>');

		// Adding Days
		$group = $('<ul></ul>');
		n = 32;
		while (--n) {
			$group.prepend('<li>'+n+'</li>');
		}
		$picker.append($group);
		$group = $group.wrap('<div class="rotoDate-days" />');

		// Adding Months
		$group = $('<ul></ul>');
		n = months.length;
		while (n--) {
			$group.prepend('<li>'+months[n]+'</li>');
		}
		$picker.append($group);
		$group = $group.wrap('<div class="rotoDate-months" />');

		// Adding Years
		$group = $('<ul></ul>');
		n = opts.years.stop + 1;
		while (n--, n > opts.years.start - 1) {
			$group.prepend('<li>'+n+'</li>');
		}
		$picker.append($group);
		$group = $group.wrap('<div class="rotoDate-years" />');
		
		$picker.append('<a class="rotoDate-toggle"></a>');

		$this.addClass('rotoDate-target').after($picker);

		return $picker;
	};

	function rotator($elm, rotation) {
		$elm.css('transform', 'rotate(' + rotation + 'deg)');
		$elm.css('oTransform', 'rotate(' + rotation + 'deg)');
		$elm.css('mozTransform', 'rotate(' + rotation + 'deg)');
		$elm.css('webkitTransform', 'rotate(' + rotation + 'deg)');
	}

	function calculate($this, $picker, opts) {
		// The amount each dial must rotate for 1 step
		var rotationSize = {
			years: 0,
			months: 0,
			days: 0,
		};
		$.each(opts.dials, function(i, radial){
			$('.rotoDate-'+radial+' li', $picker).each(function(i, elm){
				var count = $('.rotoDate-'+radial+' li', $picker).length;
				rotationSize[radial] = 360/count;
				rotator($(elm), i * rotationSize[radial]);
			});
		});
		return rotationSize;
	}


	function bind($this, $picker, opts, rotationSize) {
		// Bind Toggle Button
		$('.rotoDate-toggle', $picker).bind('click.rotoDate', function(e){
			e.preventDefault();
			$('.rotoDate').toggleClass('rotoDate-active');
		});

		// Bind item Clicks
		$('li', $picker).bind('click.rotoDate', function(e){
			var $li = $(this);
			var rotation = $li.index() * 360 / ($li.siblings().length+1);
			var radial = $li.closest('div').attr('class').substr(9);
			rotate[radial] = rotation;
			rotator($li.closest('div'), rotation);
			active[radial] = $li.text();
			refresh($li);
		});

		// Bind Input Focus
		$this.bind('focus.rotoDate', function(){
			$('.rotoDate').addClass('rotoDate-active'); 
		});

		// Bind 'cancel' keypress
		$(window).keypress(function(e){
			if (e.which == 27){
				$('.rotoDate').removeClass('rotoDate-active');
			}
		});

		// Bind scrolling
		if ($.fn.mousewheel && opts.scroll) {
			$('.rotoDate-'+opts.dials.join(', .rotoDate-')).bind('mousewheel.rotoDate', function(e, delta){
				var $e = $(this);
				var radialClass = $e.attr('class');
				var radial = radialClass.substr(9);
				e.preventDefault();
				if (delta > 0) {
					rotate[radial] += rotationSize[radial];
				} else if (delta < 0) {
					rotate[radial] -= rotationSize[radial];
					if (rotate[radial] < 0) {
						rotate[radial] = 0;
					}
				}
				var item = Math.round((rotate[radial] % 360) / rotationSize[radial]);
				if (item > $('.'+radialClass+' li', $picker).length) {
					item = 0;
				}
				active[radial] = $('.'+radialClass+' li', $picker).eq(item).text();
				refresh($this);
				rotator($e, rotate[radial]);
			});
		}
	}

	function refresh($this) {
		var items = [];
		$.each(active, function(i, item) {
			items.push(item);
		});
		$this.val(items.join(' - '));
	}*/

})(jQuery);