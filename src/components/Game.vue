<template>
  <div class="game">
    <h1>Game started</h1>
		<div class="canvas-container">
			<div class="holder" id="wasmDiv">
				<canvas class="display-canvas" id="wasm"></canvas> <br>WebAssembly</div>
			<canvas style="position:fixed; left:-1000px; visibility: hidden" id="dummy"></canvas>
			<video style="display:none" width="320" height="240" autoplay id="videoElement"></video>
		</div>
  </div>
</template>

<script>
import { initVideo } from '~/video.js';

export default {
  name: 'game',
  props: ['game'],
  methods: {
  },
  mounted() {
    initVideo();
  },
}
</script>

<style scoped>
</style>
