<template>
  <v-card class="ma-5" outlined>
    <v-toolbar class="mt-4" flat dense light>
      <v-toolbar-title>Geleverde producten</v-toolbar-title>
    </v-toolbar>
    <mods></mods>
  </v-card>
</template>

<script>
import mods from '@/components/stock/Mods'

export default {
  components: {
    mods
  },
  name: "DeliveredProducts.vue"
}
</script>

<style scoped>

</style>