<template>
  <v-app>
    <app-navigation></app-navigation>
    <router-view></router-view>
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
