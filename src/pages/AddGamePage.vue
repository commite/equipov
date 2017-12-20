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
    </div>
  </v-ons-page>
</template>

<script>
export default {
  name: 'game',
  data () {
    return {
      players: [],
    };
  },
  methods: {
    addPlayerToGame(player) {
      this.players.push(player);
    },
    startGame() {
      const characters = [];
      const game = {
        'players': this.players,
        'characters': characters,
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
