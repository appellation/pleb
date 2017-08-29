import Vue from 'vue';
import Router from 'vue-router';
import Hello from '@/components/Hello'
import Playlists from '@/components/Playlists';
import Playlist from '@/components/Playlist';
import Dashboard from '@/components/Dashboard';

Vue.use(Router);

export default new Router({
  routes: [
    { path: '/', name: 'Hello', component: Hello },
    { path: '/dashboard', name: 'Dashboard', component: Dashboard, children: [
      { path: 'playlists', name: 'Playlists', component: Playlists, children: [
        { path: ':playlistName', name: 'Playlist', component: Playlist, props: true }
      ] }
    ] },
  ],
});
