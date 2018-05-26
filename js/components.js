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
    }
  },
  methods: {
    addTeam: function() {
      this.data.teams.push( {
        name: 'Team ' + ( this.data.teams.length + 1 ),
        roster: {
          slot1: this.getEmptyHero(),
          slot2: this.getEmptyHero(),
          slot3: this.getEmptyHero(),
          slot4: this.getEmptyHero(),
          slot5: this.getEmptyHero(),
          slot6: this.getEmptyHero()
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
      //var data = this.data;
      var ss = this.data.skills[name];
      var sb = this.data.effects[ss.type];
      return $.extend( true, {}, sb, ss );
    },
    getHero: function( h ) {
      var vm = this;
      var result = $.extend( true, vm.getEmptyHero(), {
        hero: h,
        companions: 1,
        optimals: 0,
        chance: 0.0,
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
            b: 1.0,
            s: 1.0
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
      } );
      if ( !h ) {
        return result;
      }
      result.origin = vm.data.origins[result.hero.origin];
      if ( result.hero.b ) {
        result.power.m.b += 0.25;
      }
      result.power.base = result.hero.power.base;
      result.power.level = vm.data.powers.lv[result.hero.lv];
      result.power.m.l = result.hero.power.m;
      
      result.companions = 4 + ( result.hero.lv >= 30 ? 1 : 0 );
      result.skills.hero = $.map( result.hero.skills, function( lv, name ) {
        return $.extend( true, vm.getSkill( name ), { lv: lv, active: ( result.hero.lv >= lv ) } );
      } );
      $.map( result.hero.slots, function( slot, name ) {
        result.slots[name] = {};
        result.slots[name].list = $.map( slot.types, function( a, type ) {
          var items = $
            .map( vm.data.items, function( i ) {
              if ( i.type == type ) {
                return {
                  id: i.name,
                  text: i.name,
                  iconType: 'item',
                  icon: [ type.icon(), 'i-' + i.name.icon() ].join( ' ' ),
                  data: {
                    lv: i.lv
                  }
                };
              }
            } )
          return {
            id: type,
            text: type,
            iconType: 'item',
            icon: type.icon(),
            children: items
          };
        } );
        var i = {
          optimal: false,
          a: 0,
          power: {
            value: NaN,
            info: ''
          },
          chance: {
            base: NaN,
            value: NaN
          }
        };
        if ( slot.item ) {
          var found = vm.data.items[slot.item];
          if ( found ) {
            result.slots[name].item = found;
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
        $.extend( true, result.slots[name], i );
      } );

      var info = []
        .concat( result.skills.hero, result.skills.items )
        .filter( function( s ) { return s && s.active; } )
        .reduce( function( s, ss ) {
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
    getEmptyHero: function() {
      return {
        name: null,
        b: false,
        slots: {
          'Weapon': { 
            item: null, 
            q: null 
          },
          'Armor': { 
            item: null, 
            q: null 
          },
          'Head': { 
            item: null, 
            q: null 
          },
          'Hands': { 
            item: null, 
            q: null 
          },
          'Feet': { 
            item: null, 
            q: null 
          },
          'Aux1': { 
            item: null, 
            q: null 
          },
          'Aux2': { 
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
      if ( !v ) {
        return '';
      }
      return v.intString();
    },
    fixString: function( v, pos ) {
      if ( !v ) {
        return '';
      }
      return v.fixString( pos );
    },
    pptString: function( v, pos ) {
      if ( !v ) {
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
            return $( '<div class="select2-data-row"><span class="select2-data-item">Список пуст</span></div>' );
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
    <span class="htooltip-text">{{info}}</span>
    <span>{{chance.value.pptString(1)}}</span>  
    <span class="icon break" :class="icon"/>
  </span>
  `,
  props:[ 'chance' ],
  computed: {
    info: function() {
      if ( isNaN( this.chance.value ) ) {
        return '';
      }
      return 'Base chance: {0}\r\nEffective chance: {1}'.format( this.chance.base.pptString(2), this.chance.value.pptString(2) );
    },
    icon: function() {
      if ( isNaN( this.chance.value ) ) {
        return 'none';
      } else if ( this.chance.value == 0.0 ) {
        return 'unbreakable';
      } else if ( this.chance.value <= 0.03 ) {
        return 'green';
      } else if ( this.chance.value <= 0.10 ) {
        return 'yellow';
      } else if ( this.chance.value <= 0.20 ) {
        return 'orange';
      }
      return 'red';
    }
  }
} );

Vue.component( 'power', {
  template: `
  <span v-if="power.value" class="htooltip">
    <span class="htooltip-text" v-if="!!power.info">{{power.info}}</span>
    <span class="icon power"/>
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
    <span class="icon item" :class="[ icon( type ), 'i-affinity' + a ]"/>
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
          m: o.m
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
      editAll: false,
      edits: {
        'lv':     false,
        'Weapon': false,
        'Armor':  false,
        'Head':   false,
        'Hands':  false,
        'Feet':   false,
        'Aux1':   false,
        'Aux2':   false
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
    'editAll': {
      handler: function( editAll ) {
        $.extend( this.edits, {
          'lv':     editAll,
          'Weapon': editAll,
          'Armor':  editAll,
          'Head':   editAll,
          'Hands':  editAll,
          'Feet':   editAll,
          'Aux1':   editAll,
          'Aux2':   editAll
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
        allHeroes: false,
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
      },
      quest: {
        choice: null,
        boss: false,
        boost: {
          c: false,
          i: false
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
          hero.b = rst.b
          $.extend( true, hero.slots, rst.slots );
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
    summary: function() {
      var vm = this;
      var data = vm.data || vm.$parent.data;
      var result = {
        assigned: 0,
        power: {
          hero: 0,
          value: 0
        },
        roster: {
          slot1: {
            
          },
          slot2: {
            
          },
          slot3: {
            
          },
          slot4: {
            
          },
          slot5: {
            
          },
          slot6: {
            
          }
        },
        skills: [],
        quest: {
          origin: null,
          boss: false,
          item: null,
          time: {
            value: 0,
            m: 0.0,
            c: 0.0,
            i: 1.0
          },
          loot: {
            min: 0,
            max: 0
          },
          power: {
            value: 0,
            hero: 0,
            text: null
          }
        }
      };

      if ( vm.quest.choice ) {
        var names = vm.quest.choice.split( ' ' );
        var tname = names.pop();
        var qname = names.join( ' ' );
        var q = vm.data.quests[qname];
        var b = vm.data.origins[q.origin];
        if ( b.cj ) {
          result.quest.c += b.cj.value * b.cj.lv;
        }
        if ( b.boost ) {
          var bs = b.boost[b.lv];
          result.quest.time.c += vm.quest.boost.c && bs ? bs.c : 0.0;
          result.quest.time.i *= vm.quest.boost.i && bs ? Math.pow( bs.i, 3 ) : 1.0;
        }
        var qt = q.tiers[tname];
        result.quest.origin = q.origin;
        result.quest.time.value = q.time;
        result.quest.item = q.item;
        result.quest.power.value = q.power;
        result.quest.boss = !!qt.boss;
        if ( qt.loot ) {
          result.quest.loot.min = qt.loot.min;
          result.quest.loot.max = qt.loot.max;
        }
        result.quest.power = { 
          value: qt.power || q.power,
          hero: !!qt.boss && vm.quest.boss ? qt.boss.power : qt.base.power
        };
      }
      $.map( vm.roster, function( rst, sn ) {
        result.assigned += 1;
        [].push.apply( result.skills, rst.info.team.filter( function( s ) { return !s.leader || sn == 'slot1'; } ) );
      } );
      result.skills = result.skills
        .reduce( function( i, s ) {
          var idx = i.findIndex( function( si ) { return si.name == s.name; } );
          if ( idx < 0 ) {
            i.push( s );
          } else {
            i[idx].value += s.value;
          }
          return i;
        }, [] )
        .sort( function( s1, s2 ) { return s1.priority - s2.priority; } );
      $.map( vm.roster, function( rst, sn ) {
        result.roster[sn] = {
          power: rst.power,
          chance: rst.chance
        };
        var m_r = 0.0;
        var m_h = 0.0;
        var m_e = 0.0;
        var v_min = 0;
        var v_max = 0;
        var m_s = 0.1;
        result.skills
          .filter( function( s ) { return vm.applyFilter( rst.hero, s.filter ); } )
          .map( function( s ) {
            if ( s.type == 'Survival' ) {
              m_s += s.value;
            } else if ( s.type == 'Equipment' ) {
              result.roster[sn].power.m.i += s.value;
            } else if ( s.type == 'Strength' ) {
              result.roster[sn].power.m.h += s.value;
            } else if ( s.type == 'Break Chance' ) {
              result.roster[sn].chance = Math.min( result.roster[sn].chance + s.value, s.cap );
            }
            if ( s.name == 'Healer' ) {
              m_h = Math.min( m_h + s.value, s.cap );
            } else if ( s.name == 'Revive' ) {
              m_r = Math.min( m_r + s.value, s.cap );
            } else if ( s.name == 'Detect Secrets' ) {
              v_min += s.value;
            } else if ( s.name == 'Magic Find' ) {
              v_max += s.value;
            }
          } );
          
        $.map( rst.slots, function( s ) {
          if ( s.chance ) {
            s.chance.value = s.chance.base * ( 1 - result.roster[sn].chance );
          }
        } );
        
        result.roster[sn].power.m.s += m_s * ( result.assigned - 1 );
        result.power.hero += ( result.roster[sn].power.value || 0 );
        result.roster[sn].power.value = ( result.roster[sn].power.hero * result.roster[sn].power.m.h + result.roster[sn].power.items * result.roster[sn].power.m.o * result.roster[sn].power.m.i ) * result.roster[sn].power.m.b * result.roster[sn].power.m.s;
        result.roster[sn].power.info = 
          'TP = ( HP * HPM + IP * IOM * IPM ) * BM * SRM\r\n{0} = ( {1} * {3}  + {2} * {4} * {5} ) * {6} * {7}'
            .format( 
              result.roster[sn].power.value.intString(), 
              result.roster[sn].power.hero.intString(),
              result.roster[sn].power.items.intString(),
              result.roster[sn].power.m.h.fixString(2),
              result.roster[sn].power.m.o.fixString(2),
              result.roster[sn].power.m.i.fixString(2),
              result.roster[sn].power.m.b.fixString(2),
              result.roster[sn].power.m.s.fixString(2)
            );
        result.power.value += ( result.roster[sn].power.value || 0 );

        rst.info.hero.map( function( s ) {
          if ( s.name == 'Energetic' ) {
            m_e = Math.min( m_e + s.value, s.cap );
          } else if ( s.name == 'Minimum' ) {
            v_min += s.value;
          } else if ( s.name == 'Maximum' ) {
            v_max += s.value;
          }
        } );
        result.roster[sn].quest = {
          face: null,
          chance: 0.00,
          rest: {
            value: result.quest.time.value / 2,
            m: ( 1.0 - m_h ) * ( 1.0 - m_e )
          },
          heal: {
            value: result.quest.time.value * 2,
            m: ( 1.0 - m_h )
          },
          loot: {
            min: result.quest.loot.min,
            max: result.quest.loot.max
          },
          power: {
            value: result.quest.power.hero || 0,
            info: null
          }
        };
        var m_face = result.roster[sn].power.value / result.quest.power.hero;
        var p_face = result.quest.power.hero - result.roster[sn].power.value;
        if ( p_face > 0 ) {
          result.roster[sn].quest.power.info = 'Required {0} more power'.format( p_face.intString() );
        }
        if ( m_face >= 1 ) {
          result.roster[sn].quest.face = 'happy';
          result.roster[sn].quest.chance = 0.05;
        } else if ( m_face >= 0.91 ) {
          result.roster[sn].quest.face = 'normal';
          result.roster[sn].quest.chance = 0.25;
        } else if ( m_face >= 0.75 ) {
          result.roster[sn].quest.face = 'content';
          result.roster[sn].quest.chance = 0.45;
        } else if ( m_face >  0.00 ) {
          result.roster[sn].quest.face = 'unhappy';
          result.roster[sn].quest.chance = 0.65;
        }
        result.roster[sn].quest.loot.min += v_min;
        result.roster[sn].quest.loot.max += v_max;
        result.roster[sn].quest.loot.min = Math.min( result.roster[sn].quest.loot.min, result.roster[sn].quest.loot.max );
        result.roster[sn].quest.chance *= ( 1.0 - m_r );
        result.roster[sn].quest.heal.value *= result.roster[sn].quest.heal.m;
        result.roster[sn].quest.rest.value *= result.roster[sn].quest.rest.m;
      } );
      result.power.info = 'Group Bonus: +{0}%'.format( Math.round( 100 * ( result.power.value / result.power.hero - 1 ) ) );
      var p_team = result.quest.power.value - result.power.value;
      if ( p_team > 0 ) {
        result.quest.power.info = 'Required {0} more power'.format( p_team.intString() );
      }
      var s = result.skills.find( function( s ) { return s.type == 'Speed'; } );
      if ( s ) {
        result.quest.time.m += s.value;
      }
      result.quest.time.value *= ( 1 - result.quest.time.m ) * ( 1 - result.quest.time.c ) * result.quest.time.i;
      return result;
    }
  },
  methods: {
    remove: function( object ) {
      this.removeTeam( object );
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
