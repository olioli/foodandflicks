// Placeholder for native extension and other library elements

Number.prototype.days = function(){
  return this * 24 * 60 * 60 * 1000;
};

(function( G ){
 
  
  Object.ns = function( path ){
    var parts = path.split('.')
      , scope = window
      , p;
    while( p = parts.shift() ){
      scope = scope[p] || (scope[p] = {});
    }
    return scope;
  }
  
}( window ));
