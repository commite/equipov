import 'onsenui/css/onsenui-core.min.css'; // Onsen UI basic CSS
import '~/app.css'

import Vue from 'vue'
import VueOnsen from 'vue-onsenui/esm'
import * as VOns from '~/ons-components.js';

import loader from '~/lib-loader'
import router from '~/router'
import store from '~/store'
import App from '~/App.vue'
import { Game } from '~/components'
import { GamePage, MenuPage, HomePage } from '~/pages'

Vue.config.productionTip = false

Vue.use(VueOnsen)

// registering vue components
Object.values(VOns).forEach(c => Vue.component(c.name, c));
Object.values([
  Game,
  GamePage,
  MenuPage,
  HomePage]).forEach(c => Vue.component(c.name, c));

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
