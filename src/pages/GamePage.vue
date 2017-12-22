<template>
  <v-ons-page modifier="transparent">
    <v-ons-toolbar>
      <div class="left">
        <v-ons-back-button>Back</v-ons-back-button>
      </div>
      <div class="center" v-if="!turnStarted" >
        Turn preparation
      </div>
      <div class="center" v-else>
        {{ currentPlayer.character.name }}
      </div>
    </v-ons-toolbar>
    <div class="turn-layer" v-show="!turnStarted">
      <div>Next to play...</div>
      <div class="player-name">
        {{ currentPlayer.name }}
      </div>
      <div class="center"><ons-button @click="startTurn()">Start!</ons-button></div>
    </div>
    <div class="container" v-show="turnStarted">
      <faces
        :playerName="currentPlayer.name"
        :characterName="currentPlayer.character.name"
        :characterPic="currentPlayer.character.picture"></faces>

      <v-ons-fab
        position="bottom left"
        @click="wrongQuestion"
        class="fail">
        <v-ons-icon icon="md-block-alt"></v-ons-icon>
      </v-ons-fab>
      <v-ons-fab
        position="bottom right"
        @click="nextQuestion"
        class="success">
        <v-ons-icon icon="md-check"></v-ons-icon>
      </v-ons-fab>

      <div class="bottom-row">
        <ons-button class="guessed-button secondary" @click="guessed">Discovered?</ons-button>
      </div>
    </div>
  </v-ons-page>
</template>

<script>

export default {
  name: 'game-page',
  data () {
    return {
      currentPlayerIdx: 0,
      turnStarted: false,
      winners: []
    };
  },
  computed: {
    game: {
      get() {
        return this.$route.params.game;
      },
      set(game) {
       this.$route.params.game = game;
      }
    },
    currentPlayer() {
      return this.game.players[this.currentPlayerIdx];
    },
  },
  methods: {
    nextQuestion() {
      if(!this.currentPlayer.questions)
        this.currentPlayer.questions = 0;
      this.currentPlayer.questions += 1;
      this.$store.dispatch('game/questionsuccess');

      this.updateCurrentGame();
      this.$forceUpdate();
    },
    endGame() {
      this.$store.dispatch('game/resetcurrentgame');
      this.$router.push({
        name: 'Winners',
        params: {
            winners: this.winners,
            players: this.game.players,
        },
      });
    },
    guessed() {
      this.turnStarted = false;
      this.winners.push(this.game.players[this.currentPlayerIdx]);
      this.game.players.splice(this.currentPlayerIdx, 1);
      if(this.currentPlayerIdx >= this.game.players.length - 1)
        this.currentPlayerIdx = 0;
      if(this.winners.length == 3 || this.game.players.length == 0)
        this.endGame();
      this.updateCurrentGame();

    },
    nextTurn() {
      this.turnStarted = false;
      if(this.currentPlayerIdx == this.game.players.length - 1)
        this.currentPlayerIdx = 0;
      else
        this.currentPlayerIdx += 1;
      this.updateCurrentGame();
      this.$forceUpdate();
    },
    updateCurrentGame() {
      this.$store.dispatch('game/setcurrentgame', {
        game: this.game,
        currentPlayerIdx: this.currentPlayerIdx,
        turnStarted: this.turnStarted
      })
    },
    startTurn() {
      this.turnStarted = true;
      this.updateCurrentGame();
    },
    wrongQuestion() {
      this.nextQuestion();
      this.nextTurn();
    }
  },
  mounted() {
    if(this.$route.params.currentPlayerIdx)
      this.currentPlayerIdx = this.$route.params.currentPlayerIdx;
    if(this.$route.params.winners)
      this.winners = this.$route.params.winners;
    this.updateCurrentGame();
  }
}
</script>

<style scoped>
.turn-layer {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 100%;
  background-color: #222831;
}
.player-name {
  font-size: 60px;
}
</style>
