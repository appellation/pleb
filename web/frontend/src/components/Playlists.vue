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
import * as types from '../store/types';
import { Api } from '../util/Constants';

export default {
  name: 'playlists',
  computed: {
    playlists() {
      return this.$store.state.playlists;
    }
  },
  async mounted() {
    const token = this.$store.state.token;
    const result = await axios.get(`${Api}/users/${this.$store.state.user.id}/playlists`, {
      headers: { Authorization: `JWT ${token}`, 'x-session': this.$store.state.session }
    });
    this.$store.commit(types.PLAYLISTS_SET, result.data);
  },
}
</script>

