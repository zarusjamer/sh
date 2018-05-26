$( function() {

  new Vue( {
    el: '#app',
    mounted: function() {
      var vm = this;
      var data = {};
      loadJSON( 'versions' )
        .done( function( s ) {
          var jsons = [];
          var store = [];
          $.each( s, function( name, version ) {
            jsons.push( loadJSON( name ) );
            store.push( loadStore( name ) );
          } );
          store.push( loadStore( 'teams' ) );
          $ .when.apply( $, jsons )
            .then( function() {
              for ( var i = 0, m = arguments.length; i < m; i++ ) {
                if ( arguments[i] && arguments[i][0] ) {
                  $.extend( true, data, arguments[i][0] );
                }
              }
              $ .when.apply( $, store )
                .then( function() {
                  for ( var i = 0, m = arguments.length; i < m; i++ ) {
                    if ( arguments[i] ) {
                      $.extend( true, data, arguments[i] );
                    }
                  }
                } )
                .then( function() {
                  $.each( data, function( o, n ) {
                    Vue.set( vm.data, o, n );
                  } )
                } );
            } )
            .catch( function( obj, type, error ) {
              console.log( error.stack );
            } );
        } )
        .fail( function( obj, type, error ) {
          console.log( error.stack );
        } );
    }
  } );
  
} );