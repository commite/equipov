<template>
  <div class="game">
    <div class="canvas-container">
      <img
        class="character-picture"
        id="characterPic"
        :src="characterPic" />

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
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.canvas-container {
  position: relative;
  min-width: 300px;
  min-height: 300px;
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
