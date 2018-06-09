$( function() {
  /*
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments)};
  gtag('js', new Date());
  gtag('config', 'UA-107341279-1');
  */
  
  new Vue( {
    el: '#app',
    data: function() {
      return {
        firebase: {
          db: null,
          isLogged: false,
          isAuth: false,
          ui: null,
          user: {}
        },
        overlayTick: null,
        commitTick: null,
        loading: false,
        storing: false,
        source: {}
      }
    },
    computed: {
      userName: function() {
        var res = 'player';
        if ( this.firebase.user ) {
          if ( this.firebase.user.displayName ) {
            res = this.firebase.user.displayName;
          } else if ( this.firebase.user.email ) {
            res = this.firebase.user.email.split( '@' )[0];
          }
        }
        return res;
      },
      visible: function() {
        return {
          teams: $.map( this.data.teams, this.teams.visible ),
          heroes: $.map( this.data.heroes, this.heroes.visible ),
          items: $.map( this.data.items, this.items.visible ),
          origins: $.map( this.data.origins, this.origins.visible ),
          quests: $.map( this.data.quests, this.quests.visible )
        };
      }
    },
    methods: {
      initDatabase: function() {
        firebase
          .initializeApp( {
            apiKey: "AIzaSyA4-n1BuZwnig1BJesEi3yqCBpc62yUk4Y",
            authDomain: "zarusjamer-shopheroes.firebaseapp.com",
            databaseURL: "https://zarusjamer-shopheroes.firebaseio.com",
            projectId: "zarusjamer-shopheroes",
            storageBucket: "",
            messagingSenderId: "659877230172"
          } );
        this.firebase.db = firebase.firestore();
        this.firebase.auth = firebase.auth();
        this.firebase.ui = new firebaseui.auth.AuthUI( this.firebase.auth );
        this.firebase.ui
          .setConfig( {
            autoUpgradeAnonymousUsers: true,
            signInFlow: 'popup',
            signInOptions: [
              firebase.auth.GoogleAuthProvider.PROVIDER_ID,
              firebase.auth.EmailAuthProvider.PROVIDER_ID
            ],
            callbacks: {
              signInSuccessWithAuthResult: this.signInSuccessWithAuthResult,
              signInFailure: this.signInFailure,
              uiShown: this.uiShown
            }
          } );
        this.firebase.db
          .settings( {
            timestampsInSnapshots: true
          } );
        this.firebase.auth
          .setPersistence( firebase.auth.Auth.Persistence.LOCAL );
        this.firebase.auth
          .onAuthStateChanged( this.updateUser );        
        if ( this.firebase.ui.isPendingRedirect() ) {
          this.signIn();
        }
      },
      updateUser: function( user ) {
        this.firebase.user = user;
        if ( !user ) {
          this.firebase.isLogged = false;
          this.firebase.auth.signInAnonymously();
          return;
        }
        this.firebase.isLogged = !user.isAnonymous;
        this.parseData();
        return this.loadCustom();
      },
      signOut: function() {
        this.firebase.auth.signOut();
      },
      signIn: function() {
        this.firebase.isAuth = true;
        this.firebase.ui.start( '#firebaseui-auth-container' );
      },
      signInAnonymously: function() {
        return this.firebase.auth.signInAnonymously();
      },
      enablePersistence: function() {
        return this.firebase.db.enablePersistence();
      },
      signInSuccessWithAuthResult: function() {
        return false;
      },
      signInFailure: function( error ) {
        if ( error.code != 'firebaseui/anonymous-upgrade-merge-conflict' ) {
          return Promise.resolve();
        }
        let cred = error.credential;
        // Copy data from anonymous user to permanent user and delete anonymous
        // user.
        // ...
        return this.firebase.auth.signInAndRetrieveDataWithCredential( cred );
      },
      uiShown: function() {
      },
      loadData: function() {
        let vm = this;
        return this
          .loadJSON( 'data' )
          .done( function( data ) {
            vm.source = data
          } );
      },
      parseData: function() {
        let vm = this;
        if ( !vm.source ) {
          return;
        }
        let data = vm.getClone( vm.source );
        $.map( data, function( value, name ) {
          Vue.set( vm.data, name, value );
        } );
        vm.updateRarities();
        vm.updateQualities();
        vm.updateQuests();
        vm.updateOrigins();
        vm.updateSkills();
        vm.updateHeroes();
        vm.updateItems();
      },
      loadCustom: function() {
        let vm = this;
        vm.loading = true;
        let doc = vm.firebase.db.collection( 'data' ).doc( vm.firebase.user.uid );
        return doc
          .get()
          .then( vm.parseCustom )
          .then( function() {
            vm.loading = false;
          } );
      },
      parseCustom: function( doc ) {
        if ( !doc.exists ) {
          return;
        }
        let vm = this;
        $.map( doc.data(), function( value, name ) {
          let custom = JSON.parse( value );
          if ( vm.data[name] ) {
            $.extend( true, vm.data[name], custom );
          }
          else {
            Vue.set( vm.data, name, custom );
          }
        } );
      },
      commitCustom: function() {
        if ( this.loading ) {
          return;
        }
        if ( this.commitTick ) {
          clearTimeout( this.commitTick );
        }
        this.commitTick = setTimeout( this.saveCustom, 500 );
      },
      saveCustom: function() {
        let vm = this;
        vm.storing = true;
        let changes = {
          origins: {},
          items: {},
          heroes: {},
          teams: []
        };
        $.map( vm.data.origins, function( o, name ) {
          changes.origins[name] = {
            b: o.b
          };
          if ( o.lv ) {
            changes.origins[name].lv = o.lv;
          }
          if ( o.cj ) {
            changes.origins[name].cj = {
              lv: o.cj.lv
            };
          }
        } );
        $.map( vm.data.items, function( o, name ) {
          if ( !o.skill ) {
            return;
          }
          changes.items[name] = {
            skill: {
              m: o.skill.m
            }
          };
        } );
        $.map( vm.data.heroes, function( o, name ) {
          let slots = {};
          $.map( o.slots, function( s, n ) {
            slots[n] = {
              item: s.item,
              q: s.q
            };
          } );
          changes.heroes[name] = {
            lv: o.lv,
            slots: slots
          };
        } );
        [].push.apply( changes.teams, vm.data.teams );
        let custom = {
          origins: JSON.stringify( changes.origins ),
          items: JSON.stringify( changes.items ),
          heroes: JSON.stringify( changes.heroes ),
          teams: JSON.stringify( changes.teams )
        };
        let doc = vm.firebase.db.collection( 'data' ).doc( vm.firebase.user.uid );
        return doc
          .set( custom )
          .then( function() {
            vm.storing = false;
          } );
      }
    },
    mounted: function() {
      let vm = this;
      vm.loading = true;
      $
        .when(  )
        .then( vm.loadData )
        .then( vm.initDatabase )
        .then( vm.enablePersistence )
        .catch( function( err ) {
          console.log( 'Error: ' + err.message );
        } );
    },
    watch: {
      'items.filters': {
        handler: function( filters ) {
          var 
            vm = this,
            test = [];
          if ( vm.items.filters.name ) {
            test.push( function( o ) {
              return o.name.toUpperCase().includes( vm.items.filters.name.toUpperCase() );
            } );
          }
          if ( vm.items.filters.type ) {
            test.push( function( o ) {
              return o.type == vm.items.filters.type;
            } );
          }
          if ( vm.items.filters.rarity ) {
            test.push( function( o ) {
              return o.rarity == vm.items.filters.rarity;
            } );
          }
          if ( vm.items.filters.origin ) {
            if ( vm.items.filters.origin == 'nonblanks' ) {
              test.push( function( o ) {
                return o.origin && o.origin.length > 0;
              } );
            } else if ( vm.items.filters.origin == 'blanks' ) {
              test.push( function( o ) {
                return !o.origin;
              } );
            } else {
              test.push( function( o ) {
                return o.origin == vm.items.filters.origin;
              } );
            }
          }
          if ( vm.items.filters.skill ) {
            if ( vm.items.filters.skill == 'nonblanks' ) {
              test.push( function( o ) { 
                return o.skill;
              } );
            } else if ( vm.items.filters.skill == 'blanks' ) {
              test.push( function( o ) { 
                return !o.skill;
              } );
            } else {
              test.push( function( o ) {
                return o.skill && o.skill.name.toUpperCase() == vm.items.filters.skill.toUpperCase();
              } );
            }
          }
          if ( vm.items.filters.pre.name ) {
            test.push( function( o ) { 
              return o.pre && o.pre.some( function( p ) { return p.item.toUpperCase().includes( vm.items.filters.pre.name.toUpperCase() ); } );
            } );
          }
          if ( vm.items.filters.pre.q ) {
            test.push( function( o ) {
              return o.pre && o.pre.some( function( p ) { return p.q == vm.items.filters.pre.q; } );
            } );
          }
          if ( vm.items.filters.lv.min ) {
            test.push( function( o ) {
              return o.lv >= vm.items.filters.lv.min;
            } );
          }
          if ( vm.items.filters.lv.max ) {
            test.push( function( o ) { 
              return o.lv <= vm.items.filters.lv.max;
            } );
          }
          if ( test.length > 0 ) {
            vm.items.visible = function( o ) { 
              return test.every( function( t ) { return t( o ); } ) ? o : undefined;
            };
          } else {
            vm.items.visible = function( o ) {
              return o;
            };
          }
        },
        deep: true
      },
      'quests.filters': {
        handler: function( filters ) {
          var 
            vm = this,
            test = [];
          if ( vm.quests.filters.name ) {
            test.push( function( o ) {
              return o.name.toUpperCase().includes( vm.quests.filters.name.toUpperCase() );
            } );
          }
          if ( vm.quests.filters.item ) {
            test.push( function( o ) {
              return o.item == vm.quests.filters.item;
            } );
          }
          if ( vm.quests.filters.origin ) {
            test.push( function( o ) {
              return o.origin == vm.quests.filters.origin;
            } );
          }
          if ( vm.quests.filters.bag ) {
            test.push( function( o ) {
              return o.bag == vm.quests.filters.bag;
            } );
          }
          if ( vm.quests.filters.chest ) {
            test.push( function( o ) {
              return o.chest == vm.quests.filters.chest;
            } );
          }
          if ( test.length > 0 ) {
            vm.quests.visible = function( o ) { 
              return test.every( function( t ) { return t( o ); } ) ? o : undefined;
            };
          } else {
            vm.quests.visible = function( o ) {
              return o;
            };
          }
        },
        deep: true
      },
      'origins.filters': {
        handler: function( filters ) {
          var 
            vm = this,
            test = [];
          if ( vm.origins.filters.name ) {
            test.push( function( o ) { 
              return o.name.toUpperCase().includes( vm.origins.filters.name.toUpperCase() ); 
            } );
          }
          if ( vm.origins.filters.type ) {
            test.push( function( o ) { 
              return o.type == vm.origins.filters.type;
            } );
          }
          if ( test.length > 0 ) {
            vm.origins.visible = function( o ) { 
              return test.every( function( t ) { return t( o ); } ) ? o : undefined;
            };
          } else {
            vm.origins.visible = function( o ) {
              return o;
            };
          }
        },
        deep: true
      },
      'heroes.filters': {
        handler: function( filters ) {
          var
            vm = this,
            test = [];
          if ( vm.heroes.filters.name ) {
            test.push( function( o ) { 
              return o.name.toUpperCase().includes( vm.heroes.filters.name.toUpperCase() );
            } );
          }
          if ( vm.heroes.filters.type ) {
            test.push( function( o ) {
              return o.type == vm.heroes.filters.type;
            } );
          }
          if ( vm.heroes.filters.tier ) {
            test.push( function( o ) {
              return o.tier == vm.heroes.filters.tier;
            } );
          }
          if ( vm.heroes.filters.sex ) {
            test.push( function( o ) {
              return o.sex == vm.heroes.filters.sex;
            } );
          }
          if ( vm.heroes.filters.origin ) {
            test.push( function( o ) {
              return o.origin == vm.heroes.filters.origin;
            } );
          }
          if ( vm.heroes.filters.skill ) {
            test.push( function( o ) {
              return o.skills.some( function( s ) { return s.name.toUpperCase() == vm.heroes.filters.skill.toUpperCase(); } );
            } );
          }
          if ( vm.heroes.filters.lv.min ) {
            test.push( function( o ) {
              return o.lv >= vm.heroes.filters.lv.min;
            } );
          }
          if ( vm.heroes.filters.lv.max ) {
            test.push( function( o ) {
              return o.lv <= vm.heroes.filters.lv.max;
            } );
          }
          if ( test.length > 0 ) {
            vm.heroes.visible = function( o ) { 
              return test.every( function( t ) { return t( o ); } ) ? o : undefined;
            };
          } else {
            vm.heroes.visible = function( o ) {
              return o;
            };
          }
        },
        deep: true
      },
      'teams.filters': {
        handler: function( filters ) {
          var 
            vm = this,
            test = [];
          if ( vm.teams.filters.name ) {
            test.push( function( o ) { 
              return o.name.toUpperCase().includes( vm.teams.filters.name.toUpperCase() ); 
            } );
          }
          if ( test.length > 0 ) {
            vm.teams.visible = function( o ) { 
              return test.every( function( t ) { return t( o ); } ) ? o : undefined;
            };
          } else {
            vm.teams.visible = function( o ) {
              return o;
            };
          }
        },
        deep: true
      },
      'data.quest.name': {
        handler: function( name ) {
          if ( !name ) {
            this.data.quest.b = false;
            this.data.quest.c = false;
            this.data.quest.i = false;
          }
        }
      },
      'loading': {
        handler: function( loading ) {
          this.onOperation( this.loading );
        }
      }
    }
  } );
} );