import Vue from 'vue'
import Router from 'vue-router'

import PageNotFound from '@/components/views/PageNotFound'
import Timer from '@/components/views/Timer'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Timer',
      component: Timer
    },
    {
      path: '*',
      component: PageNotFound
    }
  ]
})
