
  
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
		         ,'<br>Pick a time:<select onclick="pickTime();">'
		         , flick.theaters.reduce(function(a,t){ 
		              return '<option value="'+t.href.slice(t.href.lastIndexOf('/'))+':'+t.times.join(',')+'">'+a+t.name+'</option>' 
		           }
		           ,'') 
		         , '<select id="timePicker" onclick="flickTimePicked()"><option>19:15</option><option>21:00</option></select>'
		         , '<button id="flickOk" onclick="flickOk()">Ok</button>'
		         , '</div>'].join('');
  
  
  return html;
} 
  
function pickTime(){
  // This is scoped
  var theater = $(this).value.split(':')
    , id      = theater[0];      
  
  theater[1].split(',').forEach(function(time){
    $('#timePicker').append('<option>')
                    .attr('value', time)
                    .html(time);
  });
  
  liveFlick.theater = id;

}  


function flickOk(){
  // Update selection with time and theater
  var t = $(".time");
  ("#theater").hide();
  
  liveFlick.time = $('#timePicker').val();
  
  console.debug(liveFlick);  
}

function getFood( ){
  
  $.getJSON('/food/' + selection.flick.theater )
  
}

function showFood(){
  
  
  
}
  // Run app
  
$(  getFlicks );
  
  // Pick
  // Theater
  // Food
  // Time
  // Poll using twitter
  // Post to soiree
  
  

