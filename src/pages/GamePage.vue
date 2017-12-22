<template>
  <v-ons-page>
    <v-ons-toolbar>
      <!-- <div class="left">
        <v-ons-back-button>Back</v-ons-back-button>
      </div> -->
    </v-ons-toolbar>
    <div class="turn-layer" v-if="!turnStarted">
      <div class="center">{{ currentPlayer.name }} turn</div>
      <div class="center"><ons-button @click="startTurn()">Start!</ons-button></div>
    </div>
    <div class="container" v-else>
      <div class="center">{{ currentPlayer.questions || 0 }}</div>
      <div class="center">{{ currentPlayer.name }} turn guessing {{ currentPlayer.character.name }}</div>
      <faces
        :characterName="currentPlayer.character.name"
        :characterPic="currentPlayer.character.picture"></faces>

      <v-ons-fab
        position="bottom left"
        @click="wrongQuestion">
        <v-ons-icon icon="md-minus"></v-ons-icon>
      </v-ons-fab>
      <v-ons-fab
        position="bottom right"
        @click="addQuestion">
        <v-ons-icon icon="md-check"></v-ons-icon>
      </v-ons-fab>

      <div class="bottom-row">
        <ons-button class="guessed-button" @click="guessed">Guessed</ons-button>
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
      showGuessed: false,
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
    addQuestion() {
      if(!this.currentPlayer.questions)
        this.currentPlayer.questions = 0;
      this.currentPlayer.questions += 1;
      this.$forceUpdate();
    },
    endGame() {
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
    },
    nextTurn() {
      this.turnStarted = false;
      if(this.currentPlayerIdx == this.game.players.length - 1)
        this.currentPlayerIdx = 0;
      else
        this.currentPlayerIdx += 1;
      this.$forceUpdate();
    },
    startTurn() {
      this.turnStarted = true;
    },
    wrongQuestion() {
      this.addQuestion();
      this.nextTurn();
    }
  }
}
</script>

<style scoped>
.turn-layer {
  background-color: pink;
  height: 100%;
  width: 100%;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
}
</style>
