var c_data = {
  qualities: {},
  powers: {},
  breaks: {},
    rarities: [],
  skills: [],
  skills_effects: [],
  origins: [],
  quests: [],
  items: [],
  heroes: [],
  teams: [],
  extend: function( key, value ) {
    var self = this;
    if ( Array.isArray( value ) ) {
      for ( var i = 0, m = Math.max( value.length, self[key].length ); i < m; i++ ) {
        Vue.set( self[key], i, $.extend( true, {}, self[key][i], value[i] ) );
      }
    } else {
      $.extend( true, self[key], value );
    }
  },
  set: function( key, value ) {
    var self = this;
    if ( Array.isArray( self[key] ) ) {
      self[key].splice( 0 );
      [].push.apply( self[key], value );
    } else {
      self[key] = value;
    }
  }
};

