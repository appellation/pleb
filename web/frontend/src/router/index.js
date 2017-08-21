import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import AuthCallback from '@/components/AuthCallback';
import Playlists from '@/components/Playlists';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/auth/callback',
      name: 'AuthCallback',
      component: AuthCallback
    },
    {
      path: '/users/:userID/playlists',
      name: 'Playlists',
      component: Playlists,
      props: true
    }
  ]
})
