<template>
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <router-link to="/" class="navbar-brand">Pleb</router-link>
  <button
    class="navbar-toggler"
    type="button"
    data-toggle="collapse"
    data-target="#navbarSupportedContent"
    aria-controls="navbarSupportedContent"
    aria-expanded="false"
    aria-label="Toggle navigation"
  >
    <span class="navbar-toggler-icon"></span>
  </button>

  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav mr-auto">
      <router-link tag="li" to="/" exact class="nav-item" active-class="active">
        <a class="nav-link">Home</a>
      </router-link>
      <router-link v-if="user" tag="li" to="/dashboard/playlists" class="nav-item" active-class="active">
        <a class="nav-link">Playlists</a>
      </router-link>
    </ul>
    <ul class="navbar-nav">
      <span class="navbar-text" v-if="user">{{ user.username }}#{{ user.discriminator }}</span>
      <li class="nav-item">
        <a class="nav-link" @click="auth.logout()" v-if="user">Logout</a>
        <a class="nav-link" :href="authURL" target="_blank" v-else>Login</a>
      </li>
    </ul>
  </div>
</nav>
</template>

<script>
import { OAuth } from '@/util/Constants';

export default {
  computed: {
    authURL() {
      return OAuth.AUTH_URL(this.$store.state.session);
    },
    user() {
      return this.$store.state.user;
    }
  }
}
</script>
