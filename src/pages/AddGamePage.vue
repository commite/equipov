<template>
  <v-ons-page>
    <v-ons-toolbar>
      <div class="left">
        <v-ons-back-button>Back</v-ons-back-button>
      </div>
      <div class="center">Add Game</div>
    </v-ons-toolbar>
    <div class="container">
      <v-ons-list>
        <v-ons-list-item
          v-for="player in players"
          :key="player.id"
          @click="addPlayerToGame(player)">
          Pepe
        </v-ons-list-item>
      </v-ons-list>

      <v-ons-button @click="startGame">Start game</v-ons-button>
    </div>
  </v-ons-page>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'game',
  data () {
    return {
      players: [],
    };
  },
  computed: {
    ...mapState({
      characters: state => state.game.characters,
    }),
  },
  methods: {
    addPlayerToGame(player) {
      this.players.push(player);
    },
    calcCharacters() {
      let availableCharacters = Object.keys(this.characters);
      let idx;
      this.players.forEach((player) => {
        idx = Math.floor(Math.random()*availableCharacters.length)
        player.character = this.characters[idx];
        availableCharacters.splice(idx, 1);
      });
    },
    startGame() {
      this.calcCharacters();
      const game = {
        'players': this.players
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
