import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist';

import { queryWeather } from '~/api';

Vue.use(Vuex)

const vuexLocalStorage = new VuexPersist({
  key: 'vuex', // The key to store the state on in the storage provider.
  storage: window.localStorage, // or window.sessionStorage or localForage
  // Function that passes the state and returns the state with only the objects you want to store.
  reducer: state => {
    return {
      game: {
        characters: state.game.characters,
        currentGame: state.game.currentGame
      },
    };
  },
  // Function that passes a mutation and lets you decide if it should update the state in localStorage.
  // filter: mutation => (true)
})

export default new Vuex.Store({
  modules: {
    navigator: {
      strict: true,
      namespaced: true,
      state: {
        stack: [],
        options: {}
      },
      mutations: {
        PUSH (state, page) {
          state.stack.push(page);
        },
        POP (state) {
          if (state.stack.length > 1) {
            state.stack.pop();
          }
        },
        REPLACE (state, page) {
          state.stack.pop();
          state.stack.push(page);
        },
        RESET (state, pageStack) {
          state.stack = pageStack || [state.stack[0]];
        },
        OPTIONS (state, newOptions = {}) {
          state.options = newOptions;
        },
      },
    },

    splitter: {
      namespaced: true,
      state: {
        open: false
      },
      mutations: {
        toggle (state, shouldOpen) {
          if (typeof shouldOpen === 'boolean') {
            state.open = shouldOpen
          } else {
            state.open = !state.open
          }
        },
      },
    },
    game: {
      namespaced: true,
      state: {
        currentGame: {
          game: undefined,
          currentPlayerIdx: 0,
          turnStarted: false,
          winners: []
        },
        players: {
          1: {
            name: 'Dander',
            gamesWon: 15,
          },
          2: {
            name: 'Dani',
            gamesWon: 8,
          },
          3: {
            name: 'Sergio',
            gamesWon: 7,
          },
          4: {
            name: 'Cesar',
            gamesWon: 5,
          },
          5: {
            name: 'Linator',
            gamesWon: 2,
          },
        },
        games: {},
        characters: {
          1: {
            name: 'Carmen De Mairena',
            pic: 'assets/characters/carmen_de_mairena.png'
          },
          2: {
            name: 'Albert Rivera',
            pic: 'assets/characters/albert_rivera.png'
          },
          3: {
            name: 'Alejandro Sanz',
            pic: 'assets/characters/alejandro_sanz.png'
          },
          4: {
            name: 'Espinete',
            pic: 'assets/characters/espinete.png'
          },
          5: {
            name: 'Mafalda',
            pic: 'assets/characters/mafalda.png'
          },
          6: {
            name: 'Alvaro Ojeda',
            pic: 'assets/characters/ojeda.png'
          },
          7: {
            name: 'Sr Barragan',
            pic: 'assets/characters/sr_barragan.png'
          }
        },
        isFetching: false,
        showAddMessage: false,
      },
      mutations: {
        ADD_GAME (state, name) {
          const game = {
            players: [],
            started: false,
          };
          state.games = state.games.concat([game]);
        },
        ADD_PLAYER (state, player) {
          state.players = {[player.id]: player, ...state.players};
        },
        REMOVE_PLAYER (state, id) {
          // we cannot use delete state.players[name]
          // because of a JS limitation, Vue does not know that
          // the state.locations is mutated and the view does not get
          // refreshed
          Vue.delete(state.players, id);
        },
        RESET_CURRENT_GAME (state) {
          state.currentGame = {
              game: undefined,
              currentPlayerIdx: 0,
              turnStarted: false,
              winners: []
          };
        },
        SET_CURRENT_GAME (state, game) {
          state.currentGame = game;
        },
        SHOW_ADD_MESSAGE (state) {
          state.showAddMessage = true;
        }
      },
      actions: {
        addplayer ({commit, dispatch, state}, player) {
          if (player.id in state.players) {
            this._vm.$ons.notification.toast({
              message: `${player.name} is already in your players`,
              buttonLabel: 'Dismiss',
              timeout: 5000
            });
            return;
          }
          // add the location before fetching the weather
          commit('ADD_PLAYER', player);

          this._vm.$ons.notification.toast({
            message: `${player.name} added to players`,
            buttonLabel: 'Dismiss',
            timeout: 5000
          });
        },
        removeplayer ({commit, state}, id) {
          commit('REMOVE_PLAYER', id);
          this._vm.$ons.notification.toast({
            message: `${name} has been removed from players`,
            buttonLabel: 'Dismiss',
            timeout: 5000
          });
        },
        refresh ({dispatch, commit, state}) {
          if (Object.keys(state.players).length === 0) {
            commit('SHOW_ADD_MESSAGE');
          }
          Object.entries(state.players).forEach(([name, data]) => {
            // TODO: implement
          });
        },
        resetcurrentgame({ commit, state }) {
          commit('RESET_CURRENT_GAME');
        },
        setcurrentgame({ commit, state }, game) {
          commit('SET_CURRENT_GAME', game);
        }
      },
      getters: {
        getCurrentGame: state => state.currentGame
      }
    }
  },
  plugins: [vuexLocalStorage.plugin],
})
