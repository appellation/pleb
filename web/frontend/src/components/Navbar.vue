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
    </ul>
    <ul class="navbar-nav">
      <li class="nav-item">
        <!-- <a class="nav-link" @click="auth.logout()">Logout</a> -->
        <a class="nav-link" v-bind:href="OAuth.AUTH_URL">Login</a>
      </li>
    </ul>
  </div>
</nav>
</template>

<script>
import { OAuth } from '@/util/Constants';

export default {
  data() {
    return {
      OAuth
    };
  }
}
</script>
