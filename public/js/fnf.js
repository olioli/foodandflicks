(function($){
  
  var flicks    = null
    , theaters  = null
    , selection = null
    , selel     = null
    , flk       = {}
    , at_a_time = 11
    ;
  
// Load the theaters
  var myDays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];  


// Load flicks
  function getFlicks(){  
    $.getJSON( '/flicks', function(data){

// Eliminate flicks without thumbnails
      
      flicks = data.filter(function(f){return f.thumbnail;});       

// Show the first batch
      showFlicks( flicks, 0 );
    });
  }


// Shows a batch of flicks
  function showFlicks(flicks, from){
    
    if (from >= flicks.length) from = 0;
    
    $('.flicks ul').empty();
    
    flicks.slice(from, from + at_a_time)
      .forEach(function(flick){
         $('<li>').addClass('flick')
           .appendTo('.flicks ul')
           .append('<img>')
           .find('img')
              .data('f', flick )
              .click( selectFlick )
               .attr({ src: flick.thumbnail
                     , title : flick.title
                     });
    });
  
    $('<li class="moreflicks"><a href="#">More...</a></li>')
      .appendTo('.flicks ul')
      .one('click', 
        function(e){ 
          e.preventDefault();
          showFlicks(flicks, from + at_a_time); 
        });

  }
  function selectFlick( e ){
    liveFlick = $(this).data('f');
    liveFlick.el = $(this).closest('li');
    
    showTheater(liveFlick);
  }
  
  function showTheater( flick ){
    var day = myDays[new Date().getDay()];
    var url = '/flicks/' + flick.id + '?day=' + day;
    $.getJSON(url, function( flick ){
            $('#theater').html(flickHtml(flick)).show(); 
            $("#thselect").change(pickTime);
            pickTime();
         });
  
  }

  var liveFlick = null;
  
  function flickHtml(flick){
    var html = '<div class="time">' +
  		         '<a class="close" href="#">Close</a>' +
  		         '<img src="' + flick.posters[1].href + '" />' +
  		         '<h3>' + flick.title + '</h3>' +
  		         '<p>' + flick.plot + '</p>';
  	if (flick.theaters.length == 0) {
  	  html += "<br><p style='color:red'>Sorry, this movie is not offered at this time</p>";
  	} else {
  	  html += '<br>Pick cinema and time:<select id="thselect">';
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
    if ($("#thselect").size() === 0) return;
    
    var theater = $("#thselect").val().split('/');
    // Check for invalid
    var id = theater[0];
    $('#timePicker').html('');
    if (theater[1].length > 0) {
      $('#timePicker').append('<select id="timePickerSelect"></select><button type="button" id="flickOk">Ok</button>');
      theater[1].split(',').forEach(function(time){
        if (time == '') return;
        $('#timePickerSelect').append('<option value="'+ time +'">'+time+'</option>');
      });
    }
    liveFlick.theater = id;
  }
  $("#flickOk").live('click', function(e){ letsdothis(); });
  $("a.close").live('click', function(e){ e.preventDefault(); $("#theater").hide(); })

  function letsdothis(){
    // Update selection with time and theater    
    var i = 0;
    $('li.flick').add('li.moreflicks').not(liveFlick.el).fadeTo('slow', 0.3 );
    
    // Say you change your mind, the first time you click a movie we'll put things
    // back to normal
    $('li.flick img').unbind();
    $('li.flick img').one('click', function(e){
      $('#createbutton').hide();
      $('li.flick img').click(selectFlick);
      $('li.flick').add('li.moreflicks').fadeTo('fast', 1);
      $("#food").hide();
    });
    //.each( function(){ $('img', this).fadeTo(0.2); });

    liveFlick.time = $('#timePickerSelect').val();
    if (liveFlick.time == 'Select a Time') {
      alert("Please select both a theater and a time!");
      liveFlick = null;
      return;
    }
    // Check for invalid
    $("#theater").hide();
    getFood();
  }

  function getFood(){
    $.getJSON('/food/' + liveFlick.theater, showFood);
  }

  function showFood(data){
   var html = '<h2>2. Pick a restaurant nearby</h2><ul>';
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
     $("#createbutton").show().one('click', function(){
          // $.post("/soiree", {'json': JSON.stringify(liveFlick)}, function(data){}
      
         $("input[name=json]").val(JSON.stringify(liveFlick));
         $("form").submit();
     });
   });
  }

  // Run app
  
  $(getFlicks);

  // Poll using twitter
  // Post to soiree
  
}(jQuery));