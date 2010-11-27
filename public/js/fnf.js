
  
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
                                 .slice(0,18) );    
                } );
}

function showFlicks( flicks ){
                   
  flicks.forEach( function( flick ){
                    console.debug(flick.title)
                    $('<li>').addClass('flick')
                             .appendTo('#flicks')
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
  
function flickHtml( flick){
  var html = ''
  
  
  return html;
} 
  
function flickOk(){
  // Update selection with time and theater
  
  
  
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
  
  

