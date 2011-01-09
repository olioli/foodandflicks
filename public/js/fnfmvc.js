/*
=== Food & Flicks

*/

(function($, global){

  var DAYS     = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
    , TODAY_IS = new Date()

    , Movie    = Backbone.Model.extend({

// After Backbone creates an instance of a model, the 'initialize' method
// will be invoked if it exists.

        initialize: function(){
          this.detailed = false;  
          this.attributes.selectedDay = TODAY_IS.getDay();
        }

      , hasThumbnail: function(){

          return (this.get('thumbnail') || '') !== '';                
  
        }

      , url: function(){
  
          return '/flicks/' + this.id + "?day=" + DAYS[this.attributes.selectedDay];
    
        }

      , selectDay: function( day ){
          this.set( { selectedDay: day } );
          this.expand();        
        }

      , expand: function( cb ){
          var self = this;
    
          function ex( model, response ){
            console.debug(model);
            self.detailed = true;
            if (cb) cb();
          };
      
          this.fetch({ success: ex
                     , failure: function(){ 
                         console.error("OH NOES!"); 
                         self.detailed = null;  
                       } 
                     });    
        }

    })

  , Movies = Backbone.Collection.extend({
        url   : '/flicks'
      , model : Movie
      , withThumbnails: function(){
          return this.select( 
            function(m){ 
              return m.hasThumbnail(); 
            });
        }
      
      , selectMovie: function(movie){
          this.selectedMovie = movie;
        }
    })
  

  , MovieThumb = Backbone.View.extend({
    
        tagName   : 'li'
      , className : 'flick'
      , tpl       : _.template(

          '<a href="/flicks/<%= id %>.json">'
        + '<img src="<%= thumbnail %>" title="<%= title %>"/></a>' )
    
      , events    : {

          'click' : 'select'
        
        }

      , select: function(){
          
          $(this.el).addClass('selected');
          
          this.trigger( 'moviethumb:selected', this, this.model );
        }
      
      , deselect: function(){
        
          $(this.el).removeClass('selected');
        
        }
        
      , href: function(){
      
            return this.$('a').attr('href');

        }

      , render: function(){
      
            $(this.el).html( this.tpl(this.model.attributes) );
            return this;
        }
    
    })

      
  , MovieGrid = Backbone.View.extend({
  
        tagName: 'ul'
      
      , initialize: function(){

          this.movies = this.model;
      
// When the collection refreshes, draw the view. 
// Notice '_.bind(refresh, this)' -- this is because when the 
// event fires, "this" would be set to the collection object
// instead of the view object, which is what we want

          this.movies.bind( 'refresh', _.bind(this.refresh, this) );
        
// Highlight the movie that's been selected in the collection.
           
          this.movies.bind( 'moviethumb:selected', _.bind(this.highlight, this));
        
// Add some search methods to our movie thumbnails array,

          this.thumbs = [];
          this.thumbs.locate = function(movie){
            // "this" is the array
            return _(this).detect( function(t){ return t.model === movie; })
          };

          this.detail = new MovieDetail()

        }
      
      , refresh: function( movies ){
          
          var mt;
          
          movies.withThumbnails().forEach(

            function(m){
              
              mt = this.thumb( m );

// When a movie thumbnail is selected, call the highlight method (and bind it first)

              mt.bind( 'moviethumb:selected', _.bind( this.highlight, this ));
              
              $( mt.render().el ).appendTo(this.el);            
            
            }, this);
        }
      
      , highlight: function( thumb, movie ){

// And now a word about extending native prototypes.

          _(this.thumbs).chain()
            .without( thumb )
            .invoke( 'deselect' );          
          
          this.detail.show( movie );
        }
    
      , render: function(){
        
          function prevent(e){ e.preventDefault(); }  
      
          this.$('li.flick a').click(prevent);
          return this;
        }

  // MovieThumb constructor method for convenience

      , thumb: function( movie ){
        
          var thumb = new MovieThumb({ model: movie });
          this.thumbs.push( thumb );
          return thumb;
        }

    })


  , MovieDetail = Backbone.View.extend({
      tagName: 'div'
    , className: 'flick-detail'
    , events: {
        'click a.close' : 'close'  
      }
    , tpl: _.template(
          '<a class="close" href="#"></a>'
        + '<img src="<%= posters[0].href %>">'
        + '<h3><%= title %></h3>'
        + '<p><%= plot %></p>'
        + '<select class="day"></select>'
        + '<select class="time"></select>'
      )
      
    , render: function(){

        var daylist, idx, dayabbr, moviedate
          , movie = this.model
          , self = this
          , tag = this.make
          , today = TODAY_IS.getDay()
          , j
          ;

        $( this.el ).html( this.tpl(movie.attributes) );

        for (var i = 0; i < 7; i++){
          j = (today + i) % DAYS.length;
          
          $( tag('option', { value: j }, DAYS[j]) )
            .appendTo( this.$('select.day') );
        }

        _.each( movie.attributes.theaters[0].times, 
          
          function(t){
            
            $( tag('option', { value: t }, t) )
              .appendTo( this.$('select.time') );
            
          }, this);

        $( this.el ).appendTo('body');      
        this.rendered = true;

        return this;
      }

  
    , show: function( movie ){
      
        var movie = this.model = movie;
    
        if ( movie.detailed === false ) {
          movie.expand ( _.bind(this.show, this, movie) );
          return;
        }

        if (!this.rendered) this.render();      
    
        this.$('img').attr('src', movie.attributes.thumbnail );
        this.$('h3').text( movie.attributes.title );
        this.$('p').text( movie.attributes.plot );

        $(this.el).position({      
            my: 'center'
          , at: 'center'
          , of: $(window)
        }).show();

      }
    
    , close: function(e){
        e.preventDefault();
        $(this.el).hide();
      
      }
    })


// The application view


  , FNF = Backbone.View.extend({

      title : 'Food & Flicks'  
    , el    : 'div.flicks'    

    , initialize : function(){
        this.movies = new Movies;
        this.grid = new MovieGrid({ model: this.movies });
      }
    , render: function(){    
        $( this.grid.render().el ).appendTo( this.el ); 
      }

    });


  global.FNF = new FNF;


}(jQuery, window));