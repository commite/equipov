<template>
  <v-ons-page>
    <v-ons-toolbar>
      <div class="left">
        <v-ons-back-button>Back</v-ons-back-button>
      </div>
      <div class="center">Add Game</div>
    </v-ons-toolbar>
    <div class="container">
      <v-ons-list class="players">
        <v-ons-list-item tappable
          v-for="player in players"
          :key="player.id">
          <label class="left">
            <ons-checkbox :input-id="player.id" @click="addPlayerToGame(player)"></ons-checkbox>
          </label>
          <div class="center">
            <label :for="player.id" class="list-item__title">
              {{ player.name }}
            </label>
          </div>
        </v-ons-list-item>
      </v-ons-list>
      <div class="databases">
        <v-ons-list-header>
          Choose characters database
        </v-ons-list-header>
        <v-ons-list>
          <v-ons-list-item v-for="(db, $index) in databases" :key="$index" tappable>
            <label class="left">
              <v-ons-radio
                :input-id="'radio-' + $index"
                :value="db"
                v-model="selectedDatabase">
              </v-ons-radio>
            </label>
            <label class="center" :for="'checkbox-' + $index">
              {{ db }}
            </label>
          </v-ons-list-item>
        </v-ons-list>
      </div>
      <v-ons-fab
        position="bottom right"
        @click="startGame">
        <v-ons-icon icon="md-arrow-right"></v-ons-icon>
      </v-ons-fab>
    </div>
  </v-ons-page>
</template>

<script>
import Promise from 'promise';

import { mapState } from 'vuex';
import { randomCharacter } from '~/api';

export default {
  name: 'game',
  data () {
    return {
      databases: ['marvel', 'generic'],
      candidatePlayers: [],
      selectedDatabase: 'generic',
    };
  },
  computed: {
    ...mapState({
      players: state => state.game.players,
      characters: state => state.game.characters,
    }),
  },
  methods: {
    addPlayerToGame(player) {
      for(var i in this.candidatePlayers) {
        if(this.candidatePlayers[i].name == player.name) {
          this.candidatePlayers.splice(i, 1);
          return;
        }
      }
      this.candidatePlayers.push(player);
    },
    calcCharacters() {
      return Promise.all(this.candidatePlayers.map((player) => {
        return randomCharacter(this.selectedDatabase).then((character) => {
          player.character = character;
        });
      }));
    },
    startGame() {
      this.calcCharacters().then(() =>  {
        const game = {
          'players': this.candidatePlayers
        }

        // TODO: Implement
        // this.$store.dispatch(
        //   'game/startgame', game);

        this.$router.push({
          name: 'Game',
          params: {game: game},
        });
      });
    }
  },
}
</script>

<style scoped>
  .container {
    padding: 10px;
  }
  .databases {
    margin-top: 20px;
  }
</style>
