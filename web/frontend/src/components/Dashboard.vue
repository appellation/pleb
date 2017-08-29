<template>
  <div class="container">
    <router-view v-if="user"></router-view>
    <div v-else><p>Waiting for authentication...</p></div>
  </div>
</template>

<script>
export default {
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
}
</script>

