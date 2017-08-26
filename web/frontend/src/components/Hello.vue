<template>
  <div class="container pt-5">
    <div class="row">
      <div class="col-6">
        <h1 class="display-3">Pleb</h1>
        <p class="lead">A very low-class Discord bot.</p>
        <p class="lead">
          <a class="btn btn-primary btn-lg" :href="auth_url" target="_blank" role="button">Join {{ info.guilds }} other server{{ info.guilds === 1 ? '' : 's' }}</a>
        </p>
      </div>
      <div class="col-6">
        <img src="/static/lolgo.png" class="img-fluid" alt="Pleb">
      </div>
    </div>
  </div>
</template>

<script>
import { OAuth } from '@/util/Constants';

export default {
  name: 'hello',
  computed: {
    info() {
      return this.$store.state.info;
    },
    auth_url() {
      return OAuth.AUTH_URL(this.$store.state.ws.id);
    },
  }
}
</script>
