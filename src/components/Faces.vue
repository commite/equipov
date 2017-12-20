<template>
  <div class="game">
    <img
      id="characterPic"
      style="display: none"
      :src="characterPic" />
    <div class="canvas-container">
      <canvas class="display-canvas" id="wasm"></canvas>
      <canvas style="position:fixed; left:-1000px; visibility: hidden" id="dummy"></canvas>
      <video style="display:none" width="320" height="240" autoplay id="videoElement"></video>
    </div>
  </div>
</template>

<script>
import { initVideo } from '~/faces.js';

export default {
  name: 'faces',
  props: {
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
}
.display-canvas {
  width: 100%;
}
</style>
