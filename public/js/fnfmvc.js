// #  Building a client-side MVC app 
// ## with Backbone, Underscore and jQuery

// ### Introduction
// - What is Backbone?
// > Backbone supplies structure to JavaScript-heavy applications by providing models with key-value binding and custom events, collections with a rich API of enumerable functions, views with declarative event handling, and connects it all to your existing application over a RESTful JSON interface. 

// - What is Underscore.js?
// > Underscore is a utility-belt library for JavaScript that provides a 
// > lot of the functional programming support that you would expect in 
// > Prototype.js (or Ruby), but without extending any of the built-in 
// > JavaScript objects. It's the tie to go along with jQuery's tux.

// - What is MVC?
// > It is a way to organize your GUI code into a delicious (?), 
// neatly separated sandwich. 


// ### Classic MVC refresher 
// 1. Controller is the boss. He's in charge. He must be aware of everything you do.
// 2. Views react when the model changes.  **That's it.**  
// 3. Models contain data, but also *state*. I often forget this because of my stupid.

//
// ### It is called a compound pattern because it is composed of other patterns, namely:
// 1. *Observer* ( ie. events )  
// 2. *Strategy*  
// The view's controller is a strategy. It handles its behaviour
// and can be swapped for another one if that needs to change.  
// 3. *Composite*  
// Views are a composite pattern - or at least can be - because
// you group a bunch of little views inside a big one and can
// address the big one have it deal with its children.
// ## LET US NEVER SPEAK OF THIS AGAIN

// In *Head Start: Design Patterns*, mp3 player example:  
// 1. Press play                                       
// 2. ( Controller is notified that you pressed play )  
// 3. Controller tells model "Start playing NOW. Or else."  
// 4. Model starts playing; view is notified "I am playing this song"  
// 5. View displays the song you're playing

// # Backbone

/*
TODO:
When there's a validation error, make sure to trigger an event
so that the detail view can update itself accordingly (example:
there are no theaters showing that movie, the times are missing, etc)
*/
// Fizz, buzz
(function($, global){

// Some stuff we'll need
  var DAYS     = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
    , TODAY = new Date()
    
// ### Movie *model*  
// Backbone.Model.extend lets you define a model and returns a contructor
// function.  You can then create instances of that model using the *new* operator.
    , Movie    = Backbone.Model.extend({

// After Backbone creates an instance of a model, the 'initialize' method
// will be invoked if it exists. The *options* argument is an object that
// you pass when invoking the constructor.
        initialize: function( options ){
          this.detailed = false;
          this.attributes.selectedDay = DAYS[ TODAY.getDay() ];
        }

// The *url* method is special.  This is what Backbone uses to resolve the url
// that it can use to fetch or save the model from the backend. More on saving
// the model later.
      , url: function(){
          return '/flicks/' + this.id + "?day=" + this.attributes.selectedDay;
        }
        
// Does this movie have a thumbnail?
      , hasThumbnail: function(){
          return (this.get('thumbnail') || '') !== '';
        }
        
      , selectDay: function( day ){
          this.set( { selectedDay: day } );
          this.fetch();
        }
// TODO: selecttime and selecttheater
      
// Because of the way the API i'm using is built, an additional call to the
// backend is necessary to get a detailed version of the movie model.
      , showDetail: function(){
          if ( !this.get('state') === 'detailed' ){ 
            this.fetch({ success: _.bind(this.showDetail, this) });
            return;
          }
// We set the state of the model to 'detailed'
          this.set('state', 'detailed');
        }
    })
// As you may have noticed, there are some things in the model that are not
// directly related to the data. There are ways of separating these things properly,
// but we're not really going to get into that.

  , Soiree = Backbone.Model.extend({
    
      url       : '/soiree/:id'
    , validate  : function(){
      
        return this.get('flick')
            && this.get('food');
      }
    
    })
    
// ### Movies *collection*
// Backbone collections are ordered sets of models.
  , Movies = Backbone.Collection.extend({
        url   : '/flicks'
      , model : Movie
      , withThumbnails: function(){
// Backbone collections are extended with the "enumerable" methods found in Underscore
// for convenience. So you can do collection.filter, collection.select, etc.
          return this.select( 
            function(m){ 
              return m.hasThumbnail(); 
            });
        }
      
      , selectMovie: function( movie ){
          this.selectedMovie = movie;
        }
    })
  

  , MovieThumb = Backbone.View.extend({
    
        tagName   : 'li'
      , className : 'flick'
      , tpl       : _.template(
          '<a href="#/flicks/<%= id %>">'
        + '<img src="<%= thumbnail %>" title="<%= title %>"/></a>' )
    
      , events    : {

          'click' : 'select'
        
        }

      , select: function(){
          
          $(this.el).addClass('selected');
          
          //this.trigger( 'moviethumb:selected', this, this.model );
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

          this.detail = new MovieDetail;
          this.thumbs = [];
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
        
      , reset: function(){
          _(this.thumbs)
            .invoke( 'deselect' );
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

// When the events are triggered using Backbone's event
// handling stuff for views, 'this' is set to the view,
// rather than the element that triggered the element
// (as you might expect with jQuery).    
    
    , events: {
        'click a.close'     : 'hide'
      , 'change select.day' : 'pickDay'
      }

    , tpl: _.template(
          '<a class="close" href="#/flicks"></a>'
        + '<img src="<%= posters[0].href %>">'
        + '<h3><%= title %></h3>'
        + '<p><%= plot %></p>'
        + '<div class="daytime">'
        + '<select class="day"></select>&nbsp;'
        + '<select class="time"></select>'
        + '</div>'
      )
      
    , initialize: function(){
        
        var movie = this.model;
        
        movie.bind( 'changed:state', _.bind(function(){
                    
          var state = movie.get('state');
          
          if (state === 'detailed'){
           
            this.show();
            
          }
        }, this));
      
      }

// When a day is selected in the day combo, trigger a daypick event
    , pickDay: function(){
        var d = this.$('select.day').val();
        this.trigger('moviedetail:daypick', d);
      }

    , render: function(){

        var daylist, idx, dayabbr, moviedate
          , movie = this.model
          , self  = this
          , tag   = this.make
          , today = TODAY.getDay()
          , j
          ;

        $( this.el ).html( this.tpl(movie.attributes) );

        for (var i = 0; i < 7; i++){
          j = (today + i) % DAYS.length;
          
          $( tag('option', { value:  DAYS[j] }, DAYS[j]) )
            .appendTo( this.$('select.day') );
        }


        function updateTimes(){
          
          var movie = this.model;
          this.$('select.time').empty();
          
          _.each( movie.attributes.theaters, 
          
            function(theater){
            
              _.each ( theater.times, function(t){
              
                $( tag( 'option'
                      , { value: theater.id + t }
                      , t + ' - ' + theater.name
                      ))
                .appendTo( this.$('select.time') );
            
              }, this);
            
            }, this);
        }
        updateTimes.call(this);
        
        movie.bind( 'change:theaters', _.bind(updateTimes, this) );
        
        $( this.el ).appendTo('body');      
        this.rendered = true;

        return this;
      }

  
    , show: function(){
      
        if (!this.rendered) this.render();      
    
        this.$('img').attr('src', movie.attributes.thumbnail );
        this.$('h3').text( movie.attributes.title );
        this.$('p').text( movie.attributes.plot );

        $(this.el).position({      
            my: 'center'
          , at: 'center'
          , of: $(window)
        }).show();

        this.trigger('moviedetail:show');
        return this;
      }
    
    , hide: function(e){
        $(this.el).hide();
        this.trigger('moviedetail:close');
      }
    })


// The application view

  , Application = Backbone.View.extend({
    
      title : 'Food & Flicks'  
    , el    : 'div.flicks'    
    
    , initialize : function(){
      
        this.grid = new MovieGrid({ model: this.model });
        this.detail = new MovieDetail;
        
      }
      
    , render: function(){    
        $( this.grid.render().el ).appendTo( this.el ); 
      }

    });

/*

  The controller instantiate the model.
  
  The controller instantiates views, passing in the model:
  
      The view binds to model events and initializes to current model state
      
  The controller binds to view events 
      
      Upon an event, the controller updates the model
      
  The controller triggers model changes ( changes the model )
  
*/


// The FNF controller is the 'main' controller for application.
// Backbone controllers are essentially a convenience to keep
// track of the hash fragment of the URL and dispatch accordingly.

  var FNF = Backbone.Controller.extend({

    routes: {
        '/flicks'          : 'flicks'
      , '/flicks/:flick'   : 'detail'
      , '/soirees/:soiree' : 'soiree'
    }

  , flicks: function(){ 
      
      this.app.detail.close();
    
    }

  , detail: function( id ){
      
      var movie = this.movies.get( id )
        
      if (!movie.detailed){ 
        movie.fetch({ success: _.bind(this.detail, this) });
        return;
      }
      
      movie.set('state', 'detail');
    }
    
// Starts the application
// The 'movies' parameter is passed directly to this method
// from the index.haml to bootstrap the application.

  , start: function( movies ){

// Initialize a collection of movie models

      this.movies = new Movies;

      this.app = new Application({ model: this.movies });

// When the detail view is closed, reset the grid to its initial state
    
      this.app.detail.bind('moviedetail:close', _.bind(function(){    

        this.app.grid.reset();
      
      }, this));

// 'this' is going to be the detail view
      
      this.app.detail.bind('moviedetail:daypick', function(day){
        
        this.model.selectDay( day );

      });
      
      this.movies.refresh( movies );
      this.app.render();

// Backbone.history is what is used internally by the controllers.
// start() begins the process by triggering the events bound to 
// the current URL hash fragment.
      
      Backbone.history.start();
    }

  });
  
  global.FNF = new FNF;


}(jQuery, window));