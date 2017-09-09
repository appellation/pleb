<template>
<div>
  <div class="row">
    <div class="col-3">
      <h1>Playlists</h1>
      <ul class="list-group">
        <router-link class="list-group-item list-group-item-action" active-class="active" v-for="playlist in playlists" :to="`/dashboard/playlists/${playlist.name}`" :key="playlist.name">
          {{ playlist.name }} <span class="badge badge-secondary">{{ playlist.songs.length }}</span>
        </router-link>
      </ul>
    </div>
    <div class="col">
      <router-view></router-view>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios';
import { Api } from '../util/Constants';

export default {
  name: 'playlists',
  computed: {
    playlists() {
      return this.$store.state.playlists;
    }
  },
}
</script>

