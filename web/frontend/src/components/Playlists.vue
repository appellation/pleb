<template>
<ul>
  <li v-for="playlist in playlists" :key="playlist.id">{{ playlist.name }}</li>
</ul>
</template>
<script>
import axios from 'axios';
import * as types from '../store/types';
import { Api } from '../util/Constants';

export default {
  name: 'playlists',
  props: ['userID'],
  computed: {
    playlists() {
      return this.$store.state.playlists;
    }
  },
  async mounted() {
    const token = this.$cookie.get('token');
    const result = await axios.get(`${Api}/users/${this.userID}/playlists`, {
      headers: { Authorization: `JWT ${token}` }
    });
    this.$store.commit(types.PLAYLISTS_SET, result.data);
  },
}
</script>

