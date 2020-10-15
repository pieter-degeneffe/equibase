<template>
  <v-card class="mx-5 mt-5 mb-12" outlined>
    <mods
        :title="title"
        :outgoing="outgoing"
        :datePicker="datePicker"
        :preFilter="preFilter"
        :fitlers="filters"
        :headers="headers"
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
      title: 'Geleverde producten',
      outgoing: false,
      datePicker: true,
      preFilter: 'Aankoop',
      filters: false,
      toFilter: ['supplier'],
      headers: [
        {text: 'Type', value: 'type', selected: true},
        {text: 'Product', value: 'product', selected: true},
        {text: 'Lot nummer', value: 'batch', selected: true},
        {text: 'Leverancier', value: 'batch.supplier', selected: true},
        {text: 'Aantal', value: 'amount', selected: true},
        {text: 'Datum', align: 'end', value: 'createdAt', selected: true},
      ],
    };
  }
}
</script>

<style scoped>

</style>