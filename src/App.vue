<template>
  <v-app>
    <app-navigation/>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import AppNavigation from "@/components/AppNavigation";
export default {
  components: {
    AppNavigation
  },
  data: () => ({
    //
  })
};
</script>

<style scoped>
@media print {
  main {
    padding: 0 !important;
  }
}
</style>
