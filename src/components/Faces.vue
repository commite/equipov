<template>
  <div class="game">
    <div class="canvas-container">
      <img
        class="character-picture"
        id="characterPic"
        :src="characterPic" />

      <canvas class="display-canvas" id="wasm"></canvas>
      <canvas style="position:fixed; left:-1000px; visibility: hidden" id="dummy"></canvas>
      <video style="display:none" autoplay id="videoElement"></video>
    </div>
  </div>
</template>

<script>
import { initVideo } from '~/faces.js';

export default {
  name: 'faces',
  props: {
    playerName: String,
    characterPic: String,
    characterName: String,
    debug: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
  },
  mounted() {
    initVideo(this.debug);
  },
}
</script>

<style scoped>
.game {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.canvas-container {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
}
.player-name {
  z-index: 200;
}
.display-canvas {
  position: absolute;
  left: 0;
  top: 0;
}
.character-picture {
  z-index: 100;
  position: absolute;
  display: none;
}
</style>
