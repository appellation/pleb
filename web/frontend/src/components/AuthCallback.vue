<template>
<h1>Hello there?</h1>
</template>

<script>
import * as types from '@/store/types';

export default {
  beforeMount: function() {
    this.$store.commit(types.LOGIN, this.$route.query);
    this.$router.replace('/');
  }
}
</script>
