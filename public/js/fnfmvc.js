(function($, global){
  
// Movies collection

  var Movies = Backbone.Collection.extend({

    selected  : null
  , url       : '/flicks'
  
  , select    : function(flick){
    
    }
    
  , choose    : function(flick){
    
    }
    
  , pick      : function(flick){
    
    
    }
  
  });


  var MovieGrid = Backbone.View.extend({
    
    
    
    
    
  });


  var movies = new Movies();
    
  movies.fetch({

    success: function(collection, response){
      console.dir(collection.toArray());
    }

  });  




// Namespace -- primarily so we can see it in Firebug

  var FNF = global.FNF = {};

  FNF.model = { Movies: Movies }
  FNF.view = {};
  FNF.controller = {};


}(jQuery, window));