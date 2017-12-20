import Vue from 'vue'
import Router from 'vue-router'

import store from '~/store'
import { AddGamePage, HomePage, GamePage, Winners } from '~/pages'

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomePage,
      children: [
        {
          path: 'game',
          name: 'Game',
          component: GamePage,
        },
        {
          path: 'addlocation',
          name: 'AddGame',
          component: AddGamePage,
        },
        {
          path: 'winners',
          name: 'Winners',
          component: Winners,
        },
      ]
    }
  ]
});

router.beforeEach((to, from, next) => {
  // Reset pageStack to the new route
  store.commit('navigator/RESET', to.matched.map(m => m.components.default));
  next();
});

export default router
