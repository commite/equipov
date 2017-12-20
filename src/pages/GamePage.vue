<template>
  <v-ons-page>
    <v-ons-toolbar>
      <div class="left">
        <v-ons-back-button>Back</v-ons-back-button>
      </div>
      <div class="center">Game started</div>
    </v-ons-toolbar>
    <div class="container">
    </div>
  </v-ons-page>
</template>

<script>

export default {
  name: 'game',
  data () {
    return {
    };
  },
  computed: {
    game () {
      return this.$route.params.game;
    },
    currentPlayer () {
      return {};
    },
  },
}
</script>

<style scoped>
  .container {
  }
</style>
