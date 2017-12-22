<template>
  <v-ons-page>
    <v-ons-toolbar class="home-toolbar">
      <div class="left">
        <v-ons-toolbar-button @click="$store.commit('splitter/toggle')">
          <v-ons-icon icon="ion-navicon, material:md-menu"></v-ons-icon>
        </v-ons-toolbar-button>
      </div>
      <div class="center">Winners</div>
    </v-ons-toolbar>

    <v-ons-list>
      <v-ons-list-item
        v-for="(player, idx) in winners" :key="idx">
        <div class="left">
          {{ idx }}.
          <img :src="player.character.pic" width="128px" />
        </div>
        <div class="center">
          <div class="list-item__title">
            {{ player.name }} <span v-if="idx == 0"> WINNER!</span>
          </div>
        </div>
        <div class="right">
          <div class="list-item__subtitle">
            {{ player.questions || 0 }}
          </div>
        </div>
      </v-ons-list-item>
      <v-ons-list-item
        v-for="(player, idx) in players" :key="idx">
        <div class="left">
          {{ winners.length + idx }}.
          <img :src="player.character.pic" width="128px" />
        </div>
        <div class="center">
          <div class="list-item__title">
            {{ player.name }}
          </div>
        </div>
        <div class="right">
          <div class="list-item__subtitle">
            {{ player.questions || 0 }}
          </div>
        </div>
      </v-ons-list-item>
    </v-ons-list>

  </v-ons-page>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'winners',
  computed: {
    winners() {
        return this.$route.params.winners;
    },
    players() {
      return this.$route.params.players;
    }
  },
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
