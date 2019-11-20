<template>
  <div></div>
</template>
<script>
import { setIdToken, setAccessToken } from '@/services/auth';
export default {
  name: '',
  mounted() {
    this.$nextTick(() => {
      setAccessToken();
      setIdToken();
      window.location.href = '/';
    });
  },
};
</script>
