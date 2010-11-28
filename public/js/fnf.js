
  
  // Load the flicks
var flicks    = null
  , theaters  = null
  , selection = null
  , selel     = null
  , flk       = {};
  // Load the theaters
  

function getFlicks( ){
    $.getJSON( '/flicks', function(data){
            showFlicks(data.filter(function(f){return f.thumbnail;}).slice(0,18) );
        });
}

function showFlicks(flicks){
  flicks.forEach(function(flick){
       $('<li>').addClass('flick')
         .appendTo('.flicks ul')
         .append('<img>')
         .find('img')
            .data('f', flick )
            .click( selectFlick )
             .attr({src: flick.thumbnail,
                    title : flick.title
                    });
  });

}
function selectFlick( e ){
  showTheater( $(this).data('f')  );
}
  
function showTheater( flick ){
  $.getJSON('/flicks/' + flick.id, function( flick ){
          $('#theater').html(flickHtml(flick)).show(); 
          $("#thselect").change(pickTime);
       });
  
}

var liveFlick = null;
  
function flickHtml(flick){
  liveFlick = flick;
  var html = '<div class="time">' +
		         '<a class="close" href="">Close</a>' +
		         '<img src="' + flick.posters[1].href + '" />' +
		         '<h3>' + flick.title + '</h3>' +
		         '<p>' + flick.plot + '</p>';
	if (flick.theaters.length == 0) {
	  html += "<br><p style='color:red'>Sorry, this movie is not offered at this time</p>";
	} else {
	  html += '<br>Pick cinema and time:<select id="thselect"><option>Select a Theater</option>';
	  for (var i = 0; i < flick.theaters.length; i++) {
  		    var theater = flick.theaters[i]; 
  		    // TODO: add real time values
  		    html += '<option value="'+theater.href.split('/')[4] + '/';
  		    for (var j = 0; j < theater.times.length; j++) {
  		      html += theater.times[j] + ',';
  		    }
  		    html += '">'+ theater.name + '</option>'; 
  	} 
  	html += '</select></br><span id="timePicker"></span>';
  }
	html +=	'</div>';
  return html;
} 
  
function pickTime(){
  var theater = $("#thselect").val().split('/');
  // Check for invalid
  var id = theater[0];
  $('#timePicker').html('');
  if (theater[1].length > 0) {
    $('#timePicker').append('<select id="timePickerSelect"><option>Select a Time</option></select><button type="button" id="flickOk" onclick="letsdothis();">Ok</button>');
    theater[1].split(',').forEach(function(time){
      if (time == '') return;
      $('#timePickerSelect').append('<option value="'+ time +'">'+time+'</option>');
    });
  }
  liveFlick.theater = id;
}

function letsdothis(){
  // Update selection with time and theater
  $("#theater").hide();
  liveFlick.time = $('#timePickerSelect').val();
  if (liveFlick.time == 'Select a Time') {
    alert("Please select both a theater and a time!");
    liveFlick = null;
    return;
  }
  // Check for invalid
  getFood();   
}

function getFood(){
  $.getJSON('/food/' + liveFlick.theater, showFood);
}

function showFood(data){
 var html = '<a href="#">← Back to movies</a><h2>2. Pick a restaurant nearby</h2><ul>';
 if (data.listings.length > 0) {
   for (var j = 0; j < data.listings.length && j < 10; j++) {
     var r = data.listings[j];
     html += '<li><span id="rest'+j+'">' + r.name + '<span class="quiet"> on ' + r.address.street + ' </span></span></li>';
   }
   html += '</ul>';
 } else {
   html += '<p style="color:red">Sorry, no restaurant was found nearby</p>'; 
 }
 $("#food").html(html).show();
 $("span[id^='rest']").click(function(){
   liveFlick.restaurant = $(this).html();
   $("#selectedrest").attr({id : ""});
   $(this).attr({id : "selectedrest"});
   $("#createbutton").one('click', function(){
     $.post("/soiree", {'json': liveFlick}, function(data){
     })
   }); 
 });
}

// Run app
  
$(getFlicks);

// Poll using twitter
// Post to soiree
  
  

