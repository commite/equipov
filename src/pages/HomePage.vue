<template>
  <v-ons-page>
    <v-ons-toolbar class="home-toolbar">
      <div class="left">
        <v-ons-toolbar-button @click="$store.commit('splitter/toggle')">
          <v-ons-icon icon="ion-navicon, material:md-menu"></v-ons-icon>
        </v-ons-toolbar-button>
      </div>
      <div class="center">Who Am I Game</div>
    </v-ons-toolbar>

    <v-ons-pull-hook
      :action="onRefresh"
      @changestate="pullingState = $event.state">
      <span v-show="pullingState === 'initial'">
        <v-ons-icon size="20" spin="false" icon="long-arrow-down" class="left" />
        Pull to refresh
      </span>
      <span v-show="pullingState === 'preaction'">
        <v-ons-icon size="20" spin="false" icon="long-arrow-up" class="left" />
        Release
      </span>
      <span v-show="pullingState === 'action'">
        <v-ons-icon size="20" spin="false" icon="refresh" class="left" />
        Loading...
      </span>
    </v-ons-pull-hook>

    <v-ons-list>
      <v-ons-list-item
        v-for="player in players"
        @click="goToPlayer(player)"
        :key="player.id"
        tappable>
        <div class="left">
          <img :src="player.avatar" />
        </div>
        <div class="center">
          <div class="list-item__title">
            {{ player.name }}
          </div>
        </div>
        <div class="right">
          <div class="list-item__subtitle">
            {{ player.gamesWon }}
          </div>
        </div>
      </v-ons-list-item>
    </v-ons-list>
    <div v-show="showAddMessage && !hasPlayers" class="no-results">
      There are no players
      <v-ons-button @click="goToAddPlayer">
        <v-ons-icon icon="md-plus"></v-ons-icon> add one
      </v-ons-button>
    </div>
    <div class="bottom-row">
      <v-ons-button modifier="large" @click="continueGame" v-if="getCurrentGame() && getCurrentGame().game">
        Continue game
      </v-ons-button>
      <v-ons-button modifier="large" @click="goToNewGame">
        New game
      </v-ons-button>
    </div>
  </v-ons-page>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'home',
  data() {
    return {
      pullingState: 'initial',
    }
  },
  computed: {
    ...mapState({
      showAddMessage: state => state.game.showAddMessage,
      players: state => state.game.players,
      hasPlayers: state => Object.keys(state.game.players).length > 0
    }),
  },
  methods: {
    getCurrentGame() {
      return this.$store.getters['game/getCurrentGame'];
    },
    goToPlayer(player) {
      // TODO: implement
    },
    goToAddPlayer () {
      // TODO: implement
      // this.$router.push({
      //  name: 'AddPlayer',
      // });
    },
    goToNewGame() {
      this.$store.dispatch('game/resetcurrentgame');
      this.$router.push({
       name: 'AddGame',
      });
    },
    continueGame() {
      let currentGame = this.getCurrentGame();
      this.$router.push({
        name: 'Game',
        params: {
            game: currentGame.game,
            currentPlayerIdx: currentGame.currentPlayerIdx,
            winners: currentGame.winnners
          },
      });
    },
    onRefresh(done) {
      // refresh ranking
      this.$store.dispatch('ranking/refresh');
      // simulate a 1 second timeout to hide the pull hook
      // this should be wait for all the rankings
      setTimeout(() => done(), 1000);
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.header {
  text-align: center;
}

.buttons {
  fontSize: 20px;
  color: #cacaca;
}

.refresh-button {
  margin: 0 25px 0 0;
}

.remove-button {
  margin: 0 10px 0 0;
}

.error {
  color: red;
}

.no-results {
  margin: 20px;
}
</style>
