$(function(){
var counts = {
    years: 0,
    months: 0,
    days: 0
};
$('.days li').each(function(i, e){
    var count = $('.days li').length;
    counts.days = 360/count;
    $(e).css('transform', 'rotate(' + (i*counts.days) + 'deg)');
});
$('.days').mousewheel(function(e, delta){
    e.preventDefault();
    var $this = $(this);
    if (delta > 0) {
        rotate.days += counts.days;
    } else {            
        rotate.days -= counts.days;
    }
    $this.css('transform', 'rotate(-' + rotate.days + 'deg)');
});
$('.months li').each(function(i, e){
    var count = $('.months li').length;
    counts.months = 360/count;
    $(e).css('transform', 'rotate(' + (i*counts.months) + 'deg)');
});
$('.months').mousewheel(function(e, delta){
    e.preventDefault();
    var $this = $(this);
    if (delta > 0) {
        rotate.months += counts.months;
    } else {            
        rotate.months -= counts.months;
    }
    $this.css('transform', 'rotate(-' + rotate.months + 'deg)');
});
$('.years li').each(function(i, e){
    var count = $('.years li').length;
    counts.years = 360/count;
    $(e).css('transform', 'rotate(' + (i*counts.years) + 'deg)');
});
$('.years, .months, .days').mousewheel(function(e, delta){
    var thisClass = $(this).attr('class');
    e.preventDefault();
    var $this = $(this);
    if (delta > 0) {
        rotate[thisClass] += counts[thisClass];
    } else if (delta < 0) {
        rotate[thisClass] -= counts[thisClass];
        if (rotate[thisClass] < 0) {
            rotate[thisClass] = 0;
        }
    }
    var item = Math.round((rotate[thisClass] % 360) / counts[thisClass]);
    if (item > $('.'+thisClass+' li').length) {
        item = 0;
    }
    active[thisClass] = $('.'+thisClass+' li').eq(item).text();
    refresh();
    $this.css('transform', 'rotate(-' + rotate[thisClass] + 'deg)');
});

$('.toggle').click(function(e){
    e.preventDefault();
    $('.rotaryPicker').toggleClass('active');
});
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
$('li').click(function(e){
    var $this = $(this);
    var rotation = $this.index() * 360 / ($this.siblings().length+1);
    var section = $this.closest('div').attr('class');
    rotate[section] = rotation;
    $this.closest('div').css('transform', 'rotate(-' + rotation + 'deg)');
    active[section] = $this.text();
    refresh();
});
$('input').focus(function(){
   $('.rotaryPicker').addClass('active'); 
});
 $('body').keypress(function(e){
    if (e.which == 27){
        $('.rotaryPicker').removeClass('active');
    }
});

function refresh() {
    $('input').val(active.days + ' ' + active.months + ' ' + active.years);
}
});