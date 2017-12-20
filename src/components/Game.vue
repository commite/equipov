<template>
  <div class="game">
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
  name: 'game',
  props: {
    game: Object,
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
