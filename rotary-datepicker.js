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
        dials: ['years', 'months', 'days'] // 'hours', 'minutes', 'pm' coming soon...
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
                
                var $picker = build($this);
                
                var rotationSize = calculate($this);
                
                bind($this);
            });
        },
        show : function( ) {
          // IS
        },
        hide : function( ) { 
          // GOOD
        },
        update : function( content ) { 
          // !!! 
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
    function build($this) {
        var $picker;
        
        $picker = $this.addClass('rotoDate-target').after('<div class="rotoDate"></div>').next('.rotoDate');
        
        return $picker;
    };
    
    function calculate($this) {
        // The amount each dial must rotate for 1 step
        var rotationSize = {
            years: 0,
            months: 0,
            days: 0,
        };
        $.each(opts.dials, function(i, radial){
            $('.rotoDate-'+radial+' li', $picker).each(function(i, e){
                var count = $('.rotoDate-'+radial+' li', $picker).length;
                rotationSize[radial] = 360/count;
                $(e).css('transform', 'rotate(' + ( i * rotationSize[radial] ) + 'deg)');
            });
        });
        return rotationSize;
    }
    
    function bind($this, $picker) {
        // Bind Toggle Button
        $('.toggle', $picker).bind('click.rotoDate', function(e){
            e.preventDefault();
            $('.rotoDate').toggleClass('rotoDate-active');
        });
        
        // Bind item Clicks
        $('li', $picker).bind('click.rotoDate', function(e){
            var $this = $(this);
            var rotation = $this.index() * 360 / ($this.siblings().length+1);
            var radial = $this.closest('div').attr('class').substr(9);
            rotate[radial] = rotation;
            $this.closest('div').css('transform', 'rotate(-' + rotation + 'deg)');
            active[radial] = $this.text();
            refresh();
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
                var $e = $(e);
                var radialClass = $e.attr('class');
                var radial = radialClass.substr(9);
                e.preventDefault();
                if (delta > 0) {
                    rotate[radial] += rotationSize[radial];
                } else if (delta < 0) {
                    rotate[thisClass] -= rotationSize[radial];
                    if (rotate[radial] < 0) {
                        rotate[radial] = 0;
                    }
                }
                var item = Math.round((rotate[radial] % 360) / rotationSize[radial]);
                if (item > $('.'+radialClass+' li', $picker).length) {
                    item = 0;
                }
                active[radial] = $('.'+radialClass+' li', $picker).eq(item).text();
                refresh();
                $this.css('transform', 'rotate(-' + rotate[radial] + 'deg)');
            });
        }
    }
    
    function refresh($this) {
        var items = [];
        $.each(active, function(i, item) {
          items.push(item);
        });
        $this.val(items.join(' - '));
    }

})(jQuery);