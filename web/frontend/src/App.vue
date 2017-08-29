<template>
  <div id="app">
    <navbar></navbar>
    <!-- <img src="./assets/logo.png"> -->
    <div class="my-3">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar';

export default {
  name: 'app',
  components: {
    Navbar,
  },
}
</script>
