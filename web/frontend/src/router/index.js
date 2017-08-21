import Vue from 'vue'
import Router from 'vue-router'
import Cookie from 'vue-cookie';
import Hello from '@/components/Hello'
import Playlists from '@/components/Playlists';

Vue.use(Router);
Vue.use(Cookie);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/users/:userID/playlists',
      name: 'Playlists',
      component: Playlists,
      props: true
    }
  ]
})
