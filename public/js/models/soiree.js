
Object.ns('FNF.models').Soiree = Backbone.Model.extend({ 
     
    initialize: function( date ){
      this.set( { date    : date || new Date()
                , flick   : null
                , food    : null
                , friends : [] })
    }

  });
  
  
