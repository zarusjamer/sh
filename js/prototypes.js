function cmp( a, b ) {
  var pa = a.split( '.' );
  var pb = b.split( '.' );
  for ( var i = 0, m = Math.min( pa.length, pb.length ); i < m; i++ ) {
    var na = Number( pa[i] );
    var nb = Number( pb[i] );
    if ( na > nb ) return  1;
    if ( nb > na ) return -1;
    if ( !isNaN( na ) &&  isNaN( nb ) ) return  1;
    if (  isNaN( na ) && !isNaN( nb ) ) return -1;
  }
  if ( pa.length > pb.length ) return  1;
  if ( pb.length > pa.length ) return -1;
  return 0;
};
Number.prototype.dateString = function() {
  var s = Math.round( this );
  var dd = Math.floor( s / 86400 );
  var hh = Math.floor( s % 86400 / 3600 );
  var mm = Math.floor( s % 86400 % 3600 / 60 );
  var ss = Math.floor( s % 86400 % 3600 % 60 );
  var res = '{0}{1}{2}{3}'.format(
    dd > 0 ? dd + 'd ' : '',
    hh > 0 ? hh + 'h ' : '',
    mm > 0 ? mm + 'm ' : '',
    ss > 0 ? ss + 's ' : '' );
  return res.trim();
};
Number.prototype.intString = function() {
  if ( isNaN( this ) ) {
    return '';
  }
  let n = Math.round( this, 0 );
  return n.toLocaleString();
};
Number.prototype.fixString = function( pos ) {
  if ( isNaN( this ) ) {
    return '';
  }
  let base = Math.pow( 10, pos || 0 );
  let n = Math.round( base * this, 0 ) / base;
  return n.toFixed( pos ).toLocaleString();
};
Number.prototype.pptString = function( pos ) {
  if ( isNaN( this ) ) {
    return '';
  }
  let base = Math.pow( 10, pos || 0 );
  let n = Math.round( 100 * base * this, 0 ) / base;
  return n.toLocaleString() + '%';
};
if ( !String.prototype.icon ) {
  String.prototype.icon = function() {
    return this.replace( /[\-\'\.\s]+/g, '' ).toLowerCase();
  };
}
if ( !String.prototype.format ) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace( /{(\d+)}/g, function( m, n ) { return typeof args[n] != 'undefined' ? args[n] : m; } );
  };
}
if ( !String.prototype.capitalize ) {
  String.prototype.capitalize = function( lower ) {
    return ( lower ? this.toLowerCase() : this ).replace( /(?:^|\s)\S/g, function( a ) { return a.toUpperCase(); } );
  };
}