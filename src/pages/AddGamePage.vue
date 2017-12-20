<template>
  <v-ons-page>
    <v-ons-toolbar>
      <div class="left">
        <v-ons-back-button>Back</v-ons-back-button>
      </div>
      <div class="center">Add Game</div>
    </v-ons-toolbar>
    <v-ons-list>
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
    <v-ons-fab
      position="bottom right"
      @click="startGame">
      <v-ons-icon icon="md-arrow-right"></v-ons-icon>
    </v-ons-fab>
  </v-ons-page>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'game',
  data () {
    return {
      candidatePlayers: [],
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
          console.log(this.candidatePlayers);
          return;
        }
      }
      this.candidatePlayers.push(player);
    },
    calcCharacters() {
      let availableCharacters = Object.keys(this.characters);
      let idx;
      this.candidatePlayers.forEach((player) => {
        idx = Math.floor(Math.random()*availableCharacters.length)
        player.character = this.characters[idx];
        availableCharacters.splice(idx, 1);
      });
    },
    startGame() {
      this.calcCharacters();
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

    }
  },
}
</script>

<style scoped>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 30px;
  }
</style>
