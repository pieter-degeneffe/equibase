<template>
  <v-card class="ma-5" outlined>
    <v-toolbar flat dense light>
      <v-toolbar-title>Geleverde producten</v-toolbar-title>
    </v-toolbar>
    <v-divider/>
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