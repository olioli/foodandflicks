Food And Flicks API
=====================================

Movie
-----

*   /movies
    * GET : All movie (Should contain thumbs etc)
    * / 


Restaurant
----------

* /restaurants
    * GET ?nearby={lnglat or postal} List of restaurants
    

Food & Flicks
-------------

* /soiree
    * POST creates the events
    * /{id} 
        * GET returns the event

        
        
        
        
Soiree
-----

### Stages ###

* Init   
* packages
* Send out


JSON
------

### Event

    `{ id        : 0
    , title     :  ""
    , stage     : 0
    , date      : "YYYYMMDD"
    , invites   : [ { name  : "" 
                    , email : "" 
                    , pick  : 0  } ]
    , soirees   : [ { id      : 0
                    , name    : ""
                    , flick   : {} 
                    , food    : {}
                    , picks   : [ "email"] } ]  
    }`     

    
### Flick

Everything from **cineti** plus

      `{ theater  : {}
      , time      : "HH:MM"  }`

### Food

Everythind from **YellowAPI** plus
 
      `{ restaurant : ""
      , time        : "HH:MM"}`
