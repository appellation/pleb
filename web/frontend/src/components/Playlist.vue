<template>
<div>
  <h2>{{ playlist.name }}</h2>
  <ol>
    <li v-for="song in playlist.songs" :key="song.id">{{ song.title }}</li>
  </ol>
</div>
</template>
<script>
export default {
  props: ['playlistName'],
  computed: {
    playlist() {
      return this.$store.state.playlists.find(p => p.name === this.playlistName);
    },
  },
}
</script>

