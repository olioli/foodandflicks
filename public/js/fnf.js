
  
  // Load the flicks
var flicks    = null
  , theaters  = null
  , selection = null
  , selel     = null
  , flk       = {};
  // Load the theaters
  

function getFlicks( ){
    $.getJSON( '/flicks'
             , function( data ){
                  
                  showFlicks( data.filter(function(f){ return f.thumbnail; })
                                 .slice(0,16) );    
                } );
}

function showFlicks( flicks ){
                   
  flicks.forEach( function( flick ){
                    console.debug(flick.title)
                    $('<li>').addClass('flick')
                             .appendTo('.flicks ul')
                             .append('<img>')
                             .find('img')
                                .data('f', flick )
                                .click( selectFlick )
                                 .attr(  { src   : flick.thumbnail
                                          , title : flick.title
                                          } );
                  } );

}
function selectFlick( e ){
  showTheater( $(this).data('f')  );
}
  
function showTheater( flick ){
  $.getJSON('/flicks/' + flick.id
           , function( flick ){
                $('#theater').html( flickHtml(flick) )
                             .show(); 
             });
  
  
}

var liveFlick = null;
  
function flickHtml( flick){
  liveFlick = flick;
  var html = ['<div class="time">'
		         ,'<a class="close" href="">Close</a>'
		         ,'<img src="', flick.thumbnail, '">'
		         ,'<h3>',flick.title,'</h3>'
		         ,'<p>',flick.plot,'</p>'
		         ,'<br>Pick a time:<select id="bob" onselect="pickTime();">'
		         , flick.theaters.reduce(function(a,t){ 
		              
		              console.debug(theaters);
		              return '<option value="amc">'+a+t.name+'</option>' 
		           }
		           ,'') 
		         , '</br><select id="timePicker" ><option>19:15</option><option>21:00</option></select>'
		         , '<button type="button" id="flickOk" onclick="allo();">Ok</button>'
		         , '</div>'].join('');
  
  
  return html;
} 
  
function pickTime(){
  // This is scoped
 console.debug( $("#bob").val() )
  var theater = $("#bob").val().split(':')
    , id      = theater[0];      
  
  theater[1].split(',').forEach(function(time){
    $('#timePicker').append('<option>')
                    .attr('value', time)
                    .html(time);
  });
  
  liveFlick.theater = id;

}  


function allo(){
  // Update selection with time and theater
  var t = $(".time");
  $("#theater").hide();
  
  liveFlick.time = $('#timePicker').val();
  
  getFood();
  console.debug(liveFlick);  
}

function getFood( ){
  
  $.getJSON('/food/amc' 
            , showFood )
  
}

function showFood( data ){
 console.debug(data) 
 $("#food").html(['<a href="#">← Back to movies</a><h2>2. Pick a restaurant nearby</h2><ul>'
		              , data.listings.reduce(function(acc, r){
		                  return [
		                  '<li>'
				,'<input type="radio" id="3" name="food">'
				,'<label for="3">', r.name,'<span class="quiet"> on ',r.address.street,' </span></label>'
			  ,'</li>'
		                  ].join('');
		                  },'')
		              , '</ul>'].join('')).show();
  
}
  // Run app
  
$(  getFlicks );
  
  // Pick
  // Theater
  // Food
  // Time
  // Poll using twitter
  // Post to soiree
  
  

