<template>
  <v-app>
    <app-navigation></app-navigation>
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import AppNavigation from "@/components/AppNavigation";
export default {
  name: "Equibase",
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
    padding: 0px !important;
  }
}
</style>
