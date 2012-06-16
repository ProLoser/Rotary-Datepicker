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
                // use the helper function
                var something = $.fn.rotoDate.helper();
                
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
        
        $picker = $this.after('<div class="rotoDate"></div>').next('.rotoDate');
        
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
            $('.'+radial+' li', $picker).each(function(i, e){
                var count = $('.'+radial+' li', $picker).length;
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
            var section = $this.closest('div').attr('class');
            rotate[section] = rotation;
            $this.closest('div').css('transform', 'rotate(-' + rotation + 'deg)');
            active[section] = $this.text();
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
            $('.'+opts.dials.join(', .')).bind('mousewheel.rotoDate', function(e, delta){
                var thisClass = $(this).attr('class');
                var $this = $(this);
                e.preventDefault();
                if (delta > 0) {
                    rotate[thisClass] += rotationSize[thisClass];
                } else if (delta < 0) {
                    rotate[thisClass] -= rotationSize[thisClass];
                    if (rotate[thisClass] < 0) {
                        rotate[thisClass] = 0;
                    }
                }
                var item = Math.round((rotate[thisClass] % 360) / rotationSize[thisClass]);
                if (item > $('.'+thisClass+' li', $picker).length) {
                    item = 0;
                }
                active[thisClass] = $('.'+thisClass+' li', $picker).eq(item).text();
                refresh();
                $this.css('transform', 'rotate(-' + rotate[thisClass] + 'deg)');
            });
        }
    }
    
    function refresh($this) {
        $('input', $this).val(active.days + ' ' + active.months + ' ' + active.years);
    }

})(jQuery);