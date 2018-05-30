var c_data = {
  qualities: {},
  powers: {},
  breaks: {},
  rarities: {},
  skills: {},
  effects: {},
  origins: {},
  quests: {},
  items: {},
  heroes: {},
  quest: {
    name: null,
    b: false,
    c: false,
    i: false
  },
  teams: []
};

Vue.mixin( {
  data: function() { 
    return {
      data: c_data,
      lists: {
        quality: [],
        quest: [],
        origin: []
      },
      teams: {
        visible: function( o ) { return o; },
        filters: {
          name: null
        }
      },
      heroes: {
        lists: {
          type: [],
          tier: [],
          sex: []
        },
        visible: function( o ) { return o; },
        filters: {
          name: null,
          type: null,
          tier: null,
          sex: null,
          origin: null,
          skill: null,
          lv: {
            min: null,
            max: null
          }
        }
      },
      items: {
        lists: {
          type: [],
          origin: []
        },
        sorters: [],
        sorts: { 
          lv: null,
          type: null
        },
        visible: function( o ) { return o; },
        filters: {
          name: null,
          type: null,
          skill: null,
          rarity: null,
          origin: null,
          pre: {
            name: null,
            q: null
          },
          lv: {
            min: null,
            max: null
          }
        }
      },
      origins: {
        lists: {
          type: []
        },
        visible: function( o ) { return o; },
        filters: {
          name: null,
          type: null
        }
      },
      quests: {
        lists: {
          item: [],
          origin: [],
          bag: [],
          chest: []
        },
        visible: function( o ) { return o; },
        filters: {
          name: null,
          item: null,
          origin: null,
          bag: null,
          chest: null
        }
      }
    };
  },
  computed: {
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
  watch: {
    'data.rarities': { 
      handler: function( list ) {
        var n = $.map( list, function( o, name ) {
          return { 
            id: name,
            text: name,
            sort: o.i 
          };
        } );
        Vue.set( this.lists, 'rarity', n );
      }
    },
    'data.skills': { 
      handler: function( list ) {
        var n = $.map( list, function( o, name ) {
          return { 
            id: name,
            text: name,
            iconType: 'skill',
            icon: name.replace( /\s+|\bI+$|-/g, '' ).icon()
          };
        } );
        n.push( { id: 'blanks', text: 'Blanks', custom: true } );         
        n.push( { id: 'nonblanks', text: 'Non-blanks', custom: true } );         
        Vue.set( this.lists, 'skill', n )
      }
    },
    'data.qualities': { 
      handler: function( list ) {
        var n = $.map( list, function( o, name ) {
          return { 
            id: name,
            text: name,
            iconType: 'quality',
            icon: name.icon(),
            sort: -o.i,
            data: {}
          };
        } );
        Vue.set( this.lists, 'quality', n )
      }
    },
    'data.heroes': { 
      handler: function( list ) {
        var 
          vm = this,
          type = [],
          tier = [],
          sex = [];
        vm.heroes.lists.type.splice(0);
        vm.heroes.lists.tier.splice(0);
        vm.heroes.lists.sex.splice(0);
        $.map( list, function( o, name ) {
          if ( type.indexOf( o.type ) < 0 ) {
            type.push( o.type );
            vm.heroes.lists.type.push( { id: o.type, text: o.type } );
          }
          if ( tier.indexOf( o.tier ) < 0 ) {
            tier.push( o.tier );
            vm.heroes.lists.tier.push( { id: o.tier, text: o.tier } );
          }
          if ( sex.indexOf( o.sex ) < 0 ) {
            sex.push( o.sex );
            vm.heroes.lists.sex.push( { id: o.sex, text: o.sex } );
          }
        } );
      }
    },
    'data.items': { 
      handler: function( list ) {
        var
          vm = this,
          custom = {},
          type = [],
          origin = []
        ;
        vm.items.lists.type.splice(0);
        vm.items.lists.origin.splice(0);
        vm.items.lists.origin.push( { id: 'nonblanks', text: 'Non-blanks', custom: true } );
        vm.items.lists.origin.push( { id: 'blanks', text: 'Blanks', custom: true } );
        $.map( list, function( o, name ) {
          if ( o.type && type.indexOf( o.type ) < 0 ) {
            type.push( o.type );
            vm.items.lists.type.push( { 
              id: o.type,
              text: o.type,
              iconType: 'item',
              icon: o.type.icon(),
            } );
          }
          if ( o.origin && origin.indexOf( o.origin ) < 0 ) {
            origin.push( o.origin );
            vm.items.lists.origin.push( { id: o.origin, text: o.origin } );
          }
          if ( o.skill ) {
            if ( !o.skill.init ) {
              $.extend( true, o.skill, vm.getSkill( o.skill.name ), { init: true } );
            }
          }
        } );
      }
    },
    'data.origins': { 
      handler: function( list ) {
        var 
          vm = this,
          type = [];
        vm.origins.lists.type.splice(0);
        vm.lists.origin = $.map( list, function( o, name ) {
          if ( type.indexOf( o.type ) < 0 ) {
            type.push( o.type );
            vm.origins.lists.type.push( { 
              id: o.type,
              text: o.type
            } );
          }
          return {
            id: name,
            text: name
          };
        } );
      }
    },
    'data.quests': { 
      handler: function( list ) {
        var 
          vm = this,
          custom = {},
          loot = [],
          origin = [],
          bag = [],
          chest = [];
        vm.quests.lists.item.splice(0);
        vm.quests.lists.origin.splice(0);
        vm.quests.lists.bag.splice(0);
        vm.quests.lists.chest.splice(0);
        vm.lists.quest = $.map( list, function( o, name ) {
          if ( o.item && loot.indexOf( o.item ) < 0 ) {
            loot.push( o.item );
            vm.quests.lists.item.push( { id: o.item, text: o.item } );
          }
          if ( o.origin && origin.indexOf( o.origin ) < 0 ) {
            origin.push( o.origin );
            vm.quests.lists.origin.push( { id: o.origin, text: o.origin } );
          }
          if ( o.bag && bag.indexOf( o.bag ) < 0 ) {
            bag.push( o.bag );
            vm.quests.lists.bag.push( { id: o.bag, text: o.bag } );
          }
          if ( o.chest && chest.indexOf( o.chest ) < 0 ) {
            chest.push( o.chest );
            vm.quests.lists.chest.push( { id: o.chest, text: o.chest } );
          }
          var children = $.map( o.tiers, function( tier, tname ) {
            return { id: name + ' ' + tname, text: name + ' ' + tname };
          } );
          return { 
            id: name,
            text: name,
            iconType: 'artifact',
            icon: o.item.icon(),
            children: children,
            sort: o.power
          };
        } );
      }
    },
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
    }
  },
  methods: {
    addTeam: function() {
      this.data.teams.push( {
        name: 'Team ' + ( this.data.teams.length + 1 ),
        roster: {
          slot1: this.getEmptyRoster(),
          slot2: this.getEmptyRoster(),
          slot3: this.getEmptyRoster(),
          slot4: this.getEmptyRoster(),
          slot5: this.getEmptyRoster(),
          slot6: this.getEmptyRoster()
        }
      } );
      saveStore( 'teams', this.data.teams );
    },
    removeTeam: function( object ) {
      this.data.teams.splice( this.data.teams.indexOf( object ), 1 );
      saveStore( 'teams', this.data.teams );
    },
    icon: function( str ) {
      return ( str || '' ).icon();
    },
    iconChance: function( chance ) {
      if ( isNaN( chance ) ) {
        return 'none';
      } else if ( chance == 0.0 ) {
        return 'unbreakable';
      } else if ( chance <= 0.03 ) {
        return 'green';
      } else if ( chance <= 0.10 ) {
        return 'yellow';
      } else if ( chance <= 0.20 ) {
        return 'orange';
      }
      return 'red';
    },
    iconAffinity: function( affinity ) {
      return 'affinity' + affinity;
    },
    applyFilter: function( h, f ) {
      if ( !f || !h ) {
        return true;
      }
      var res = true;
      $.map( f, function( v, k ) { 
        res = res && h[k] == v;
      } );
      return res;
    },
    get_k: function( length, divide ) {
      return Math.floor( ( length - 1 ) / divide ) + 1;
    },
    getClone: function( o ) {
      return JSON.parse( JSON.stringify( o ) );
    },
    getSkill: function( name ) {
      var ss = this.data.skills[name];
      var sb = this.data.effects[ss.type];
      return $.extend( true, {}, sb, ss );
    },
    getHero: function( h ) {
      var vm = this;
      var result = {
        hero: h,
        companions: 1,
        optimals: 0,
        chance: 0.0,
        slots: {
          'Weapon': {},
          'Armor': {},
          'Head': {},
          'Hands': {},
          'Feet': {},
          'Aux1': {},
          'Aux2': {}
        },
        power: { 
          info: '',
          base: 0,
          level: 0,
          hero: 0,
          items: 0,
          m: {
            l: 1.0,
            h: 1.0,
            i: 1.0,
            o: 1.0,
            b: 1.0
          }
        },
        skills: {
          hero: [],
          items: []
        },
        info: { 
          hero: {},
          team: {}
        }
      };
      if ( !h ) {
        return result;
      }
      result.origin = vm.data.origins[h.origin];
      if ( result.origin.b ) {
        result.power.m.b = 1.25;
      }
      result.power.base = h.power.base;
      result.power.level = vm.data.powers.lv[h.lv];
      result.power.m.l = h.power.m;
      
      result.companions = 4 + ( h.lv >= 30 ? 1 : 0 );
      result.skills.hero = $.map( h.skills, function( lv, name ) {
        return $.extend( true, vm.getSkill( name ), { lv: lv, active: ( h.lv >= lv ) } );
      } );
      $.map( h.slots, function( slot, islot ) {
        var i = {
          cloned: slot.cloned,
          optimal: false,
          a: 0,
          power: {
            value: NaN,
            info: ''
          },
          chance: {
            base: NaN,
            value: NaN
          },
          list: []
        };
        i.list = $.map( slot.types, function( a, type ) {
          var items = $
            .map( vm.data.items, function( item ) {
              if ( item.type == type ) {
                return {
                  id: item.name,
                  text: item.name,
                  iconType: 'item',
                  icon: [ type.icon(), item.name.icon() ].join( ' ' ),
                  data: {
                    lv: item.lv
                  }
                };
              }
            } )
          return {
            id: type,
            text: type,
            iconType: 'item',
            icon: [ type.icon(), vm.iconAffinity( a ) ].join( ' ' ),
            children: items
          };
        } );
        if ( slot.item ) {
          var found = vm.data.items[slot.item];
          if ( found ) {
            i.item = found;
            var lv_difference = Math.abs( found.lv - h.lv );
            i.optimal = ( lv_difference <= 6 );
            var m_q = vm.data.powers.q[slot.q] || 1.0;
            var p_v = found.power * m_q;
            i.power.value = p_v;
            i.power.info = 'IP = IBP * IQM\r\n{0} = {1} * {2}'
                .format( 
                  p_v.intString(), 
                  found.power.intString(),
                  m_q.fixString(2)
                );
            i.a = slot.types[found.type];
            i.q = slot.q || 'Common';
            i.chance.base = Math.max( 0.03, 1 - Math.pow( Math.max( 0, 1 - 0.03 * lv_difference - vm.data.breaks.a[i.a] ), 0.85 ) ) * vm.data.breaks.q[i.q]
            if ( !i.chance.base ) {
              i.chance.base = 0.0;
            } else if ( i.chance.base < 0.005 ) {
              i.chance.base = 0.0;
            }
            if ( found.skill ) {
              var q1 = vm.data.qualities[slot.q];
              var q2 = vm.data.qualities[found.skill.q];
              i.skill = $.extend( true, {}, found.skill, { active: found.skill.m && ( q1 && q2 && q1.i >= q2.i ) } );
              result.skills.items.push( i.skill );
            }
            result.power.items += i.power.value;
            result.optimals += i.optimal;
          }
        }
        result.slots[islot] = i;
      } );

      var info = []
        .concat( result.skills.hero, result.skills.items )
        .filter( function( s ) { return s && s.active; } )
        .reduce( function( ss, s ) {
          var idx = ss[s.applies][s.type];
          if ( !idx ) {
            ss[s.applies][s.type] = {
              name: s.type,
              base: s.base,
              text: s.text,
              sign: s.sign,
              priority: s.priority,
              cap: s.cap,
              leader: s.leader,
              value: s.value,
              filter: s.filter,
              active: s.active
            };
          } else {
            ss[s.applies][s.type].value += s.value;
          }
          return ss;
        }, {
          team: {},
          hero: {} 
        } );
      result.info.hero = $
        .map( info.hero, function( s ) {
          if ( vm.applyFilter( h, s.filter ) ) {
            if ( 'Leader' == s.base ) {
              result.companions += s.value;
            } else if ( 'Equipment' == s.base ) {
              result.power.m.i += s.value;
            } else if ( 'Strength' == s.base ) {
              result.power.m.h += s.value;
            } else if ( 'Break Chance' == s.base ) {
              result.chance = Math.min( result.chance + s.value, s.cap );
            }
          }
          return s;
        } )
        .sort( function( s1, s2 ) { 
          return s1.priority - s2.priority; 
        } );
      result.info.team = $
        .map( info.team, function( s ) {
          return s;
        } )
        .sort( function( s1, s2 ) { 
          return s1.priority - s2.priority; 
        } );

      if ( result.origin.cj ) {
        result.power.m.b += ( result.origin.cj.value * result.origin.cj.lv || 0 );
      }
      if ( result.optimals == 7 ) {
        result.power.m.o += 0.25;
      }

      $.map( result.slots, function( s ) {
        if ( s.chance ) {
          s.chance.value = s.chance.base * ( 1 - result.chance );
        }
      } );
      
      result.power.hero = result.power.base + result.power.level * result.power.m.l;
      result.power.value = ( result.power.hero * result.power.m.h + result.power.items * result.power.m.i * result.power.m.o ) * result.power.m.b;
      result.power.info = 
        'TP = ( HP * HPM + IP * IOM * IPM ) * BM\r\n{0} = ( {1} * {3}  + {2} * {4} * {5} ) * {6}'
          .format( 
            result.power.value.intString(), 
            result.power.hero.intString(),
            result.power.items.intString(),
            result.power.m.h.fixString(2),
            result.power.m.o.fixString(2),
            result.power.m.i.fixString(2),
            result.power.m.b.fixString(2)
          );
      return result;
    },
    getEmptyRoster: function() {
      return {
        name: null,
        slots: {
          'Weapon': {
            cloned: false,
            item: null,
            q: null
          },
          'Armor': {
            cloned: false,
            item: null,
            q: null
          },
          'Head': {
            cloned: false,
            item: null,
            q: null
          },
          'Hands': {
            cloned: false,
            item: null,
            q: null
          },
          'Feet': {
            cloned: false,
            item: null,
            q: null
          },
          'Aux1': { 
            cloned: false,
            item: null,
            q: null
          },
          'Aux2': { 
            cloned: false,
            item: null,
            q: null
          }
        }
      };
    },
    rowType: function( i ) {
      return i % 2 ? 'even' : 'odd';
    },
    formatFIO: function( v ) {
      if ( !v ) {
        return '';
      }
      var names = v.split( / +/ );
      for ( var i = names.length - 1; i > 0; i-- ) {
        names[i] = names[i][0] + '.';
      }
      if ( names.length > 1 ) {
        names[0] += ' ';
      }
      return names.join( '' );
    },
    formatDate: function( v ) {
      const df = new Intl.DateTimeFormat( 'ru', { year: 'numeric', month: 'numeric', day: 'numeric' } );
      if ( !v ) {
        return '';
      }
      var d = null;
      if ( typeof v == 'string' ) {
        d = new Date();
        d.setTime( Date.parse( v ) );
      } else if ( typeof v == 'number' ) {
        d = new Date();
        d.setTime( v );
      } else {
        d = v
      }
      return df.format( d );
    },
    dateString: function( v ) {
      if ( !v ) {
        return '';
      }
      return v.dateString();
    },
    intString: function( v ) {
      if ( !v || isNaN( v ) ) {
        return '';
      }
      return v.intString();
    },
    fixString: function( v, pos ) {
      if ( !v || isNaN( v ) ) {
        return '';
      }
      return v.fixString( pos );
    },
    pptString: function( v, pos ) {
      if ( !v || isNaN( v ) ) {
        return '';
      }
      return v.pptString( pos );
    },
    showBusy: function( $el ) {
      $( this.$el ).LoadingOverlay( 'show', { fade: false } );
    },
    hideBusy: function( $el ) {
      $( this.$el ).LoadingOverlay( 'hide', true );
    },
    onOperation: function( operation ) {
      var vm = this;
      if ( vm.overlayTick ) {
        clearTimeout( vm.overlayTick );
      }
      vm.overlayTick = setTimeout( operation ? vm.showBusy : vm.hideBusy, 50 );
    }
  }
});

Vue.component( 'tabs', {
  template: `
  <div>
    <div class="tabs is-medium">
      <ul>
        <li v-for="tab in tabs" :class="{ 'is-active': tab.isActive }">
          <a :href="tab.href">{{ tab.name }}</a>
        </li>
      </ul>
    </div>
    <div class="tabs-details">
      <slot></slot>
    </div>
  </div>
  `,
  data: function() {
    return { 
      tabs: []
    };
  },
  created: function() {
    this.tabs = this.$children;
  },
  methods: {
    selectTab: function( hash ) {
      var selected = false;
      this.tabs.forEach( function( tab ) {
        tab.isActive = ( tab.href == hash );
        if ( tab.isActive ) {
          selected = true;
        }
      } );
      if ( !selected ) {
        this.tabs[0].isActive = true;
      }
    },
    hashChanged: function() {
      var hashes = window.location.hash.split( '-' );
      this.selectTab( hashes[0] );
    }
  },
  mounted: function() {
    $( window ).on( 'hashchange', this.hashChanged );
    this.hashChanged();
  }
} );

Vue.component( 'tab', {
  template: `
  <div v-show="isActive">
    <slot></slot>
  </div>
  `,
  props: {
    name: {
      required: true
    },
    selected: {
      default: false
    }
  },
  data: function() {
    return {
      isActive: false
    };
  },
  computed: {
    href: function() {
      return '#' + this.name.toLowerCase().replace( / /g, '-' );
    }
  },
  mounted: function() {
    this.isActive = this.selected;
  }
} );

Vue.component( 'select2', {
  template: '<select/>',
  props: [ 'value', 'options', 'loading', 'placeholder', 'minsearch', 'allowclear' ],
  data: function() {
    var matcher = function( params, data ) {
      if ( !params.term ) {
        return data;
      }
      if ( data.custom ) {
        return data;
      }
      if ( data.children && data.children.length > 0 ) {
        var match = $.extend( true, {}, data );
        for ( var c = data.children.length - 1; c >= 0; c-- ) {
          var child = data.children[c];
          var matches = matcher( params, child );
          if ( !matches ) {
            match.children.splice( c, 1 );
          }
        }
        if ( match.children.length > 0 ) {
          return match;
        }
      }
      var terms = params.term.toUpperCase().split( ' ' );
      var texts = [];
      if ( data.text ) {
        texts.push( data.text.toUpperCase() );
      }
      if ( data.data ) {
        $.each( data.data, function( i, v ) {
          if ( v ) {
            texts.push( v.toString().toUpperCase() );
          }
        } );
      }
      for ( var i = terms.length - 1; i >= 0; i-- ) {
        if ( !texts.some( function( s ) { return s.indexOf( terms[i] ) > -1; } ) ) {
          return false;
        }
      };
      return data;
    };
    return {
      busy: this.loading,
      settings: {
        width: '100%',
        dropdownAutoWidth: true,
        data: this.options,
        allowClear: this.allowclear === undefined ? true : !!this.allowclear,
        minimumResultsForSearch: this.minsearch === undefined ? 8 : ( this.minsearch || Infinity ),
        placeholder: this.placeholder === undefined ? ' ' : ( this.placeholder || ' ' ),
        matcher: matcher,
        sorter: function( data ) {
          return data.sort( function( a, b ) {
            if ( a.custom != undefined ) {
              return -1;
            }
            if ( b.custom != undefined ) {
              return 1;
            }
            if ( a.sort != undefined ) {
              return a.sort - b.sort;
            }
            if ( a.text != undefined ) {
              return a.text.localeCompare( b.text );
            }
            return 0;
          } );
        },
        templateSelection: function( data ) {
          if ( !data ) {
            return;
          }
          var $result = $( '<div class="select2-data-sel"/>' );
          if ( data.icon || data.iconType ) {
            $result.addClass( 'select2-data-icon' );
            var $span = $( '<span class="float-left"/>' );
            var $icon = $( '<span class="icon small"/>' );
            $icon.addClass( [ data.iconType, data.icon ].join( ' ' ) )
            $span
              .append( $icon )
              .appendTo( $result );
          }
          if ( data.text ) {
            var $span = $( '<span class="select2-data-item text"/>' )
            $span.html( data.text );
            if ( data.custom ) {
              $span.prepend( 'Contains "' );
              $span.append( '"' );
            }
            $span
              .appendTo( $result );
          }
          return $result;
        },
        templateResult: function( data ) {
          if ( !data ) {
            return;
          }
          var res = [];
          var $result = $( '<div class="select2-data-row"/>' );
          if ( data.icon || data.iconType ) {
            $result.addClass( 'select2-data-icon' );
            var $span = $( '<span class="float-left"/>' );
            var $icon = $( '<span class="icon small"/>' );
            $icon.addClass( [ data.iconType, data.icon ].join( ' ' ) )
            $span
              .append( $icon )
              .appendTo( $result );
          }
          if ( data.text ) {
            var $span = $( '<span class="select2-data-item text"/>' )
            $span.html( data.text );
            if ( data.custom ) {
              $span.prepend( 'Contains "' );
              $span.append( '"' );
            }
            $span
              .appendTo( $result );
          }
          if ( data.data ) {
            $.each( data.data, function( i, v ) {
              var $span = $( '<span class="select2-data-item"/>' );
              $span.html( v );
              $span.addClass( i );
              $span
                .appendTo( $result );
            } );
          }
          res.push( $result );
          if ( data.subs ) {
            var $subs = $( '<div class="select2-data-row"/>' );
            $.each( data.subs, function( i, v ) {
              var $span = $( '<span class="select2-data-item"/>' );
              $span.html( v );
              $span.addClass( i );
              $subs.append( $span );
            } );
            res.push( $subs );
          }
          return res;
        },
        language: {
          noResults: function() {
            return $( '<div class="select2-data-row"><span class="select2-data-item">Empty list</span></div>' );
          }
        }
      }
    };
  },
  mounted: function() {
    this.attach( this.settings );
  },
  destroyed: function() {
    this.detach();
  },
  methods: {
    detach: function() {
      $( this.$el )
        .off()
        .select2( 'destroy' );
      $( this.$el )
        .html('');
    },
    attach: function( settings ) {
      var vm = this;
      if ( !settings.data ) {
        settings.data = [];
      }
      var empty = settings.data.find( function( c ) { return c.id == ''; } );
      if ( !empty ) {
        settings.data.unshift( { id: '' } );
      }
      $( this.$el )
        .select2( settings )
        .val( vm.value )
        .trigger( 'change' )
        .on( 'change', function( event ) {
          var value = $( event.delegateTarget ).val();
          vm.$emit( 'input', value );
        } )
        .on( 'select2:unselecting', function( e ) {
            $( this ).data( 'state', 'unselected' );
        } )
        .on( 'select2:open', function( e ) {
          var self = $( this );
          if ( self.data( 'state' ) === 'unselected' ) {
            self.select2( 'close' );
            self.removeData( 'state' );
          }    
        });
    }
  },
  watch: {
    value: function( value ) {
      $( this.$el )
        .val( value )
        .trigger( 'change' );
    },
    loading: function( loading ) {
      $( this.$el ).prop( 'disabled', loading );
    },
    options: function( options ) {
      this.settings.data = options;
    },
    settings: {
      deep: true,
      handler: function( settings ) {
        this.detach();
        this.attach( settings );
      }
    }
  }
} );

Vue.component( 'chance', {
  template: `
  <span v-if="chance" class="htooltip">
    <span class="htooltip-text">Base chance: {{chance.base.pptString(2)}}\r\nEffective chance: {{chance.value.pptString(2)}}</span>
    <span class="float-right">
      <span class="icon break" :class="iconChance(chance.value)"/>
    </span>
    <span>{{chance.value.pptString(1)}}</span>  
  </span>
  `,
  props:[ 'chance' ]
} );

Vue.component( 'power', {
  template: `
  <span v-if="power.value" class="htooltip">
    <span class="htooltip-text" v-if="power.info">{{power.info}}</span>
    <span class="float-left">
      <span class="icon power"/>
    </span>
    <span>{{power.value.intString()}}</span>  
  </span>
  `,
  props:[ 'power' ]
} );

Vue.component( 'timer', {
  template: `
  <span v-if="time">
    <span class="float-left">
      <span class="icon timers quest"/>
    </span>
    <span>{{time.dateString()}}</span>
  </span>
  `,
  props:[ 'time' ]
} );

Vue.component( 'itemSlot', {
  template: `
  <span class="htooltip">
    <span class="htooltip-text">{{summary}}</span>
    <span class="icon type" :class="[ type.icon(), iconAffinity( a ) ]"/>
  </span>
  `,
  props:[ 'type', 'a' ],
  computed: {
    summary: function() {
      var info = '';
      switch ( this.a ) {
        case 1:
          info = 'Excel at handling {0}\r\nBreak chance is lowered';
          break;
        case 0:
          info = 'Knows how to handle {0} properly';
          break;
        case -1:
          info = 'Can handle {0}\r\nBreak chance is increased';
          break;
        case -2:
          info = 'Can barely handle {0}\r\nBreak chance is significantly increased';
          break;
      }
      return info.format( this.type );
    }
  }
} );

Vue.component( 'skillValue', {
  template: `
  <span v-if="skill">
    <span>{{summary}}</span>
  </span>
  `,
  props:[ 'skill' ],
  computed: {
    summary: function() {
      var val = this.skill.cap ? Math.min( this.skill.value, this.skill.cap ) : this.skill.value;
      return '%' == this.skill.sign ? val.pptString(1) : val.intString();
    }
  }
} );

Vue.component( 'skill', {
  template: `
  <span v-if="skill">
    <span class="float-left htooltip">
      <span class="htooltip-text">{{summary.info}}</span>
      <span class="icon skill" :class="[ icon( summary.icon ) ]"/>
      <span :class="{inactive: skill.active != undefined && !skill.active}">{{skill.name}}</span>
    </span>
  </span>
  `,
  props:[ 'skill' ],
  computed: {
    summary: function() {
      var val = this.skill.cap ? Math.min( this.skill.value, this.skill.cap ) : this.skill.value;
      var value = '%' == this.skill.sign ? val.pptString(1) : val.intString();
      var info = [];
      if ( this.skill.leader ) {
        info.push( 'Leader skill' );
      }
      if ( !!this.skill.text ) {
        info.push( this.skill.text.format( value ) );
      }
      if ( this.skill.cap ) {
        var c_val = this.skill.value - val;
        info.push( 'Capped at {0}'.format( this.skill.sign ? this.skill.cap.pptString(1) : this.skill.cap.intString() ) );
        if ( c_val > 0 ) {
          info.push( 'Wasted surplus of {0}'.format( '%' == this.skill.sign ? c_val.pptString(1) : c_val.intString() ) );
        }
      }
      if ( !this.skill.active ) {
        if ( this.skill.m != undefined && !this.skill.m ) {
          info.push( 'Unlocked on mastered blueprint' );
        }
        if ( this.skill.q != undefined ) {
          info.push( 'Unlocked on item of {0} quality or higher'.format( this.skill.q ) );
        }
        if ( this.skill.lv != undefined ) {
          info.push( 'Unlocked at level {0}'.format( this.skill.lv ) );
        }
      }
      var icon = this.skill.name.replace( /\s+|\bI+$|-/g, '' );
      return {
        icon: icon,
        info: info.join( '\r\n' )
      };
    }
  }
} );

Vue.component( 'origin', {
  template: '#templates-origin',
  props: [ 'object' ],
  data: function() {
    return {
      editLv: false,
      editCj: false
    };
  },
  methods: {
    commit: function() {
      var custom = {};
      $.map( this.data.origins, function( o, name ) {
        custom[name] = {
          b: o.b
        };
        if ( o.lv ) {
          custom[name].lv = o.lv;
        }
        if ( o.cj ) {
          custom[name].cj = {
            lv: o.cj.lv
          };
        }
      } );
      saveStore( 'origins', custom );
    }
  },
  watch: {
    'object.b': { 
      handler: function( b, bOld ) {
        if ( this.object.b != bOld ) {
          this.commit();
        }
      }
    },
    'object.lv': { 
      handler: function( lv, lvOld ) {
        this.object.lv = Math.min( Math.max( 1, lv ), this.object.cap || lv );
        if ( this.object.lv != lvOld ) {
          this.commit();
        }
      }
    },
    'object.cj.lv': { 
      handler: function( lv, lvOld ) {
        this.object.cj.lv = Math.min( Math.max( 0, lv ), this.object.cj.cap || lv );
        if ( this.object.cj.lv != lvOld ) {
          this.commit();
        }
      }
    }
  }
} );

Vue.component( 'item', {
  template: '#templates-item',
  props: [ 'object' ],
  methods: {
    commit: function() {
      var custom = {};
      $.map( this.data.items, function( o, name ) {
        if ( !o.skill ) {
          return;
        }
        custom[name] = {
          skill: {
            m: o.skill.m
          }
        };
      } );
      saveStore( 'items', custom );
    }
  },
  watch: {
    'object.skill.m': {
      handler: function( m, mOld ) {
        if ( this.object.m != mOld ) {
          this.commit();
        }
      }
    }
  }
} );

Vue.component( 'hero', {
  template: '#templates-hero',
  props: [ 'object' ],
  data: function() {
    return {
      edits: {
        lv:       false,
        expanded: false,
        slotsAll: false,
        slots: {
          'Weapon': false,
          'Armor':  false,
          'Head':   false,
          'Hands':  false,
          'Feet':   false,
          'Aux1':   false,
          'Aux2':   false
        }
      }
    };
  },
  computed: {
    summary: function() {
      return this.getHero( this.object );
    }
  },
  methods: {
    commit: function() {
      var custom = {};
      $.map( this.data.heroes, function( o, name ) {
        slots = {};
        $.map( o.slots, function( s, n ) {
          slots[n] = {
            item: s.item,
            q: s.q
          };
        } );
        custom[name] = {
          lv: o.lv,
          slots: slots
        };
      } );
      saveStore( 'heroes', custom );
    }
  },
  watch: {
    'edits.slotsAll': {
      handler: function( b ) {
        $.extend( this.edits.slots, {
          'Weapon': b,
          'Armor':  b,
          'Head':   b,
          'Hands':  b,
          'Feet':   b,
          'Aux1':   b,
          'Aux2':   b
        } );
      }
    },
    'object.slots': {
      handler: function( slot ) {
        this.commit();
      },
      deep: true
    },
    'object.lv': { 
      handler: function( lv, lvOld ) {
        this.object.lv = Math.min( Math.max( 1, lv ), this.object.cap );
        if ( this.object.lv != lvOld ) {
          this.commit();
        }
      }
    }
  }
} );

Vue.component( 'team', {
  template: '#templates-team',
  props: [ 'object' ],
  data: function() {
    return {
      editAll: false,
      edits: {
        name: false,
        expanded: false,
        roster: {
          slot1: {
            hero: false,
            expanded: false,
            allSlots: false,
            slots: {
              'Weapon': false,
              'Armor': false,
              'Head': false,
              'Hands': false,
              'Feet': false,
              'Aux1': false,
              'Aux2': false
            }
          },
          slot2: {
            hero: false,
            expanded: false,
            allSlots: false,
            slots: {
              'Weapon': false,
              'Armor': false,
              'Head': false,
              'Hands': false,
              'Feet': false,
              'Aux1': false,
              'Aux2': false
            }
          },
          slot3: {
            hero: false,
            expanded: false,
            allSlots: false,
            slots: {
              'Weapon': false,
              'Armor': false,
              'Head': false,
              'Hands': false,
              'Feet': false,
              'Aux1': false,
              'Aux2': false
            }
          },
          slot4: {
            hero: false,
            expanded: false,
            allSlots: false,
            slots: {
              'Weapon': false,
              'Armor': false,
              'Head': false,
              'Hands': false,
              'Feet': false,
              'Aux1': false,
              'Aux2': false
            }
          },
          slot5: {
            hero: false,
            expanded: false,
            allSlots: false,
            slots: {
              'Weapon': false,
              'Armor': false,
              'Head': false,
              'Hands': false,
              'Feet': false,
              'Aux1': false,
              'Aux2': false
            }
          },
          slot6: {
            hero: false,
            expanded: false,
            allSlots: false,
            slots: {
              'Weapon': false,
              'Armor': false,
              'Head': false,
              'Hands': false,
              'Feet': false,
              'Aux1': false,
              'Aux2': false
            }
          }
        }
      }
    };
  },
  computed: {
    roster: function() {
      var vm = this;
      var result = {};
      $.map( this.object.roster, function( rst, sn ) {
        if ( rst.name ) {
          var hero = vm.getClone( vm.data.heroes[rst.name] );
          $.map( rst.slots, function( slot, islot ) {
            hero.slots[islot].cloned = true;
            if ( hero.slots[islot].item != slot.item ) {
              hero.slots[islot].item = slot.item;
              hero.slots[islot].cloned = false;
            }
            if ( hero.slots[islot].q != slot.q ) {
              hero.slots[islot].q = slot.q;
              hero.slots[islot].cloned = false;
            }
          } );
          result[sn] = vm.getHero( hero );
        }
      } );
      return result;
    },
    companions: function() {
      var vm = this;
      var result = {};
      var max = 1;
      if ( vm.roster.slot1 ) {
        max = vm.roster.slot1.companions;
      }
      for ( var i = 1; i <= max; i++ ) {
        result['slot' + i] = true;
      }
      return result;
    },
    quest: function() {
      var vm = this;
      if ( !vm.data.quest.name ) {
        return false;
      }
      var result = {
        origin: null,
        boss: false,
        time: {
          value: 0,
          base: 0,
          m: 0.0,
          c: 0.0,
          i: 0.0
        },
        loot: {
          item: null,
          min: 0,
          max: 0
        },
        power: {
          value: NaN,
          hero: NaN,
          boss: NaN,
          text: null
        },
        roster: {},
        m: {
          rv: 0.0,
          hh: 0.0,
          mn: 0,
          mx: 0
        }
      }
      var names = vm.data.quest.name.split( ' ' );
      var tname = names.pop();
      var qname = names.join( ' ' );
      var q = vm.data.quests[qname];
      var b = vm.data.origins[q.origin];
      if ( b.cj ) {
        result.time.c += b.cj.value * b.cj.lv;
      }
      if ( b.boost ) {
        var bs = b.boost[b.lv];
        if ( bs ) {
          result.time.c += vm.data.quest.c ? bs.c : 0.0;
          result.time.i  = vm.data.quest.i ? 0.85 : 0.0;
        }
      }
      var qt = q.tiers[tname];
      result.origin = b;
      result.time.base = q.time;
      result.loot.item = q.item;
      if ( qt.loot ) {
        result.m.mn = qt.loot.min;
        result.m.mx = qt.loot.max;
      }
      result.power.value = qt.power || q.power;
      result.power.base = qt.base.power
      if ( qt.boss ) {
        result.boss = true;
        if ( vm.data.quest.b ) {
          result.power.base = qt.boss.power;
        }
      }
      vm.summary.skills
        .map( function( s ) {
          if ( s.base == 'Healer' ) {
            result.m.hh = Math.min( result.m.hh + s.value, s.cap );
          } else if ( s.base == 'Revive' ) {
            result.m.rv = Math.min( result.m.rv + s.value, s.cap );
          } else if ( s.base == 'Minimum' ) {
            result.m.mn += s.value;
          } else if ( s.base == 'Maximum' ) {
            result.m.max += s.value;
          } else if ( s.base == 'Speed' ) {
            result.time.m += s.value;
          }
        } );
      $.map( vm.roster, function( rst, sn ) {
        var rv = result.m.rv;
        var hh = result.m.hh;
        var en = 0.0;
        var mn = result.m.mn;
        var mx = result.m.mx;
        rst.info.hero.map( function( s ) {
          if ( s.base == 'Energetic' ) {
            en = Math.min( en + s.value, s.cap );
          } else if ( s.base == 'Revive' ) {
            rv = Math.min( rv + s.value, s.cap );
          } else if ( s.base == 'Minimum' ) {
            mn += s.value;
          } else if ( s.base == 'Maximum' ) {
            mx += s.value;
          }
        } );
        mn = Math.min( mn, mx );
        result.loot.min += mn;
        result.loot.max += mx;
        var rstInfo = {
          injury: {
            face: null,
            info: null,
            chance: 0.00
          },
          time: {
            rest: result.time.base / 2 * ( 1.0 - hh ) * ( 1.0 - en ),
            heal: result.time.base * 2 * ( 1.0 - hh )
          },
          loot: {
            min: mn,
            max: mx
          }
        };
        var pw_hero = vm.summary.roster[sn].power.value;
        var m_face = pw_hero / result.power.base;
        var p_face = result.power.base - pw_hero;
        if ( p_face > 0 ) {
          rstInfo.injury.info = 'Required {0} more power'.format( p_face.intString() );
        }
        if ( m_face >= 1 ) {
          rstInfo.injury.face = 'happy';
          rstInfo.injury.chance = 0.05;
        } else if ( m_face >= 0.91 ) {
          rstInfo.injury.face = 'normal';
          rstInfo.injury.chance = 0.25;
        } else if ( m_face >= 0.75 ) {
          rstInfo.injury.face = 'content';
          rstInfo.injury.chance = 0.45;
        } else if ( m_face >  0.00 ) {
          rstInfo.injury.face = 'unhappy';
          rstInfo.injury.chance = 0.65;
        }
        rstInfo.injury.chance *= ( 1.0 - rv );
        result.roster[sn] = rstInfo;
      } );
      var p_team = result.power.value - vm.summary.power.value;
      if ( p_team > 0 ) {
        result.power.info = 'Required {0} more power'.format( p_team.intString() );
        result.power.face = 'unhappy';
      } else {
        result.power.face = '';
      }
      result.time.value = result.time.base * ( 1 - result.time.m ) * ( 1 - result.time.c ) * ( 1 - result.time.i );
      return result;
    },
    summary: function() {
      var vm = this;
      var result = {
        assigned: 0,
        power: {
          hero: 0,
          value: 0
        },
        roster: {},
        skills: []
      };

      var pw_hero = 0.0;
      var pw_value = 0.0;
      var skills = [];
      $.map( vm.roster, function( rst, sn ) {
        result.assigned += 1;
        [].push.apply( skills, rst.info.team.filter( function( s ) { return !s.leader || sn == 'slot1'; } ) );
      } );
      var info = skills
        .reduce( function( ss, s ) {
          var idx = ss[s.name];
          if ( !idx ) {
            ss[s.name] = {
              name: s.name,
              base: s.base,
              text: s.text,
              sign: s.sign,
              priority: s.priority,
              cap: s.cap,
              leader: s.leader,
              value: s.value,
              filter: s.filter,
              active: s.active
            };
          } else {
            ss[s.name].value += s.value;
          }
          return ss;
        }, {} );
      result.skills = $.map( info, function( s ) {
          return s;
        } )
        .sort( function( s1, s2 ) { 
          return s1.priority - s2.priority; 
        } );
      result.skillsRows = vm.get_k( result.skills.length, 7 );
      
      $.map( vm.roster, function( rst, sn ) {
        result.roster[sn] = {
          power: rst.power,
          chance: rst.chance
        };
        var m_op = result.roster[sn].power.m.o;
        var m_eq = result.roster[sn].power.m.i;
        var m_st = result.roster[sn].power.m.h;
        var m_sr = 0.1;
        result.skills
          .filter( function( s ) { 
            return vm.applyFilter( rst.hero, s.filter ); 
          } )
          .map( function( s ) {
            if ( s.base == 'Survival' ) {
              m_sr += s.value;
            } else if ( s.base == 'Equipment' ) {
              m_eq += s.value;
            } else if ( s.base == 'Strength' ) {
              m_st += s.value;
            } else if ( s.base == 'Break Chance' ) {
              result.roster[sn].chance = Math.min( result.roster[sn].chance + s.value, s.cap );
            }
          } );
          
        $.map( rst.slots, function( s ) {
          if ( s.chance ) {
            s.chance.value = s.chance.base * ( 1 - result.roster[sn].chance );
          }
        } );
        m_sr = 1.0 + m_sr * ( result.assigned - 1 );
        
        pw_hero += result.roster[sn].power.value;
        result.roster[sn].power.value = ( result.roster[sn].power.hero * m_st + result.roster[sn].power.items * m_op * m_eq ) * result.roster[sn].power.m.b * m_sr;
        result.roster[sn].power.info = 
          'TP = ( HP * HPM + IP * IOM * IPM ) * BM * SRM\r\n{0} = ( {1} * {3}  + {2} * {4} * {5} ) * {6} * {7}'
            .format( 
              result.roster[sn].power.value.intString(), 
              result.roster[sn].power.hero.intString(),
              result.roster[sn].power.items.intString(),
              m_st.fixString(2),
              m_op.fixString(2),
              m_eq.fixString(2),
              result.roster[sn].power.m.b.fixString(2),
              m_sr.fixString(2)
            );
        pw_value += result.roster[sn].power.value;
      } );
      result.power.value = pw_value;
      result.power.hero = pw_hero;
      result.power.info = 'Group Bonus: +{0}%'.format( Math.round( 100 * ( pw_value / pw_hero - 1 ) ) );
      return result;
    }
  },
  methods: {
    remove: function( object ) {
      this.removeTeam( object );
    },
    cloneSlot: function( sn, islot ) {
      var vm = this;
      var hero = vm.data.heroes[vm.object.roster[sn].name];
      if ( vm.object.roster[sn].slots[islot].item != hero.slots[islot].item ) {
        vm.object.roster[sn].slots[islot].item = hero.slots[islot].item;
      }
      if ( vm.object.roster[sn].slots[islot].q != hero.slots[islot].q ) {
        vm.object.roster[sn].slots[islot].q = hero.slots[islot].q;
      }
    },
    setBoost: function( origin, b ) {
      var vm = this;
      $.map( vm.roster, function( rst, sn ) {
        if ( rst.hero.origin == origin ) {
          vm.object.roster[sn].b = b;
        }
      } );
    },
    getHeroes: function( name ) {
      var vm = this;
      return $.map( vm.data.heroes, function( h ) {
        if ( h.name == name ) {
          return { id: h.name, text: h.name, iconType: 'hero', icon: h.name.icon(), data: { lv: h.lv } };
        }
        var found = $.map( vm.object.roster, function( rst ) { return rst.name == h.name ? h : undefined; } );
        if ( found.length == 0 ) {
          return { id: h.name, text: h.name, iconType: 'hero', icon: h.name.icon(), data: { lv: h.lv } };
        }
      } );
    }
  },
  watch: {
    'object.roster': {
      handler: function() {
        saveStore( 'teams', this.data.teams );
      },
      deep: true
    },
    'edits.roster.slot1.allSlots': {
      handler: function( value ) {
        var vm = this;
        $.map( vm.edits.roster.slot1.slots, function( slot, islot ) {
          vm.edits.roster.slot1.slots[islot] = value;
        } );
      }
    },
    'edits.roster.slot2.allSlots': {
      handler: function( value ) {
        var vm = this;
        $.map( vm.edits.roster.slot2.slots, function( slot, islot ) {
          vm.edits.roster.slot2.slots[islot] = value;
        } );
      }
    },
    'edits.roster.slot3.allSlots': {
      handler: function( value ) {
        var vm = this;
        $.map( vm.edits.roster.slot3.slots, function( slot, islot ) {
          vm.edits.roster.slot3.slots[islot] = value;
        } );
      }
    },
    'edits.roster.slot4.allSlots': {
      handler: function( value ) {
        var vm = this;
        $.map( vm.edits.roster.slot4.slots, function( slot, islot ) {
          vm.edits.roster.slot4.slots[islot] = value;
        } );
      }
    },
    'edits.roster.slot5.allSlots': {
      handler: function( value ) {
        var vm = this;
        $.map( vm.edits.roster.slot5.slots, function( slot, islot ) {
          vm.edits.roster.slot5.slots[islot] = value;
        } );
      }
    },
    'edits.roster.slot6.allSlots': {
      handler: function( value ) {
        var vm = this;
        $.map( vm.edits.roster.slot6.slots, function( slot, islot ) {
          vm.edits.roster.slot6.slots[islot] = value;
        } );
      }
    }
  }
} );
