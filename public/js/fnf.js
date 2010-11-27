
$(function(){
  
  // Load the flicks
  var flicks    = null
    , theaters  = null
    , selection = {}
    
    , flk       = {};
  // Load the theaters
  
  
  flk = { get       : function( ){
                        console.log('get')
                        $.getJSON( '/flicks'
                                 , function( data ){
                                      console.debug(data)
                                      flicks = data;
                                      flk.show();    
                                    } );
                      }
        , show      : function(){
          
                  }
        , select: function( e ){
                    var el    = $(this)
                      , flick = el.data('f')
                    if( selection[flick.id] ){
                      delete selection[flick.id]
                      el.removeClass('highlight');
                    }
                    else{
                       selection[flick.id] = flick;
                       el.addClass('highlight');
                    }
                  }
         , show : function(){
                    console.debug(flicks)
                    flicks.forEach( function( flick ){
                                      console.debug(flick.title)
                                      $('<li>').addClass('flick')
                                               .appendTo('#flicks')
                                               .click(flk.select)
                                               .data('f', flick )
                                               .append('<img>')
                                               .find('img')
                                                .attr(  { src   : flick.thumbnail
                                                        , title : flick.title
                                                        } );
                                    } );
      
                  }
  };
  
  
  
  
  
  // Run app
  
  flk.get();
  
});
