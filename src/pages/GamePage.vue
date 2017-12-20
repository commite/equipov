<template>
  <v-ons-page>
    <v-ons-toolbar>
      <!-- <div class="left">
        <v-ons-back-button>Back</v-ons-back-button>
      </div> -->
    </v-ons-toolbar>
    <div class="turn-layer" v-if="!turnStarted">
      <div class="center">{{ getCurrentPlayer().name }} turn</div>
      <div class="center"><ons-button @click="startTurn()">Start!</ons-button></div>
    </div>
    <div class="container" v-else>
      <div class="center">{{ getCurrentPlayer().questions || 0 }}</div>
      <img :src="getCurrentPlayer().character.pic" :alt="getCurrentPlayer().character.name"/>
      <div class="center">{{ getCurrentPlayer().name }} turn</div>
      <div class="button-container">
        <ons-button @click="wrongQuestion">Wrong</ons-button>
        <ons-button @click="guessed">Guessed</ons-button>
        <ons-button @click="addQuestion">Right</ons-button>
      </div>
    </div>
  </v-ons-page>
</template>

<script>

export default {
  name: 'game',
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
    }
  },
  methods: {
    addQuestion() {
      if(!this.getCurrentPlayer().questions)
        this.getCurrentPlayer().questions = 0;
      this.getCurrentPlayer().questions += 1;
      this.$forceUpdate();
    },
    getCurrentPlayer() {
      return this.game.players[this.currentPlayerIdx];
    },
    endGame() {
      console.log("Se acabo");
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

.button-container {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
</style>
