<template>
  <v-card class="ma-5" outlined>
    <v-toolbar class="mt-4" flat dense light>
      <v-toolbar-title>Uitgaande producten</v-toolbar-title>
    </v-toolbar>
    <mods
        :outgoing="outgoing"
        :datePicker="datePicker"
        :delivered="delivered"
        :filters="filters"
        :toFilter="toFilter"
    />
  </v-card>
</template>

<script>
import mods from '@/components/stock/Mods'

export default {
  components: {
    mods
  },
  name: "DeliveredProducts.vue",
  data() {
    return {
      outgoing: true,
      datePicker: false,
      delivered: false,
      filters: {},
      toFilter: ['modTypes'],
    };
  }
}
</script>

<style scoped>

</style>