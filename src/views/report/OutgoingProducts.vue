<template>
  <v-card class="ma-5" outlined>
    <mods
        :title="title"
        :outgoing="outgoing"
        :datePicker="datePicker"
        :preFilter="preFilter"
        :filters="filters"
        :toFilter="toFilter"
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
  name: "OutgoingProducts.vue",
  data() {
    return {
      title: 'Uitgaande producten',
      outgoing: true,
      datePicker: false,
      preFilter: false,
      filters: {},
      toFilter: ['modTypes'],
      headers: [
        {text: 'Type', value: 'type', selected: true},
        {text: 'Product', value: 'product', selected: true},
        {text: 'Lot nummer', value: 'batch', selected: true},
        {text: 'Klant', value: 'client', selected: true},
        {text: 'Paard', value: 'horse', selected: true},
        {text: 'Aantal', value: 'amount', selected: true},
        {text: 'Datum', align: 'end', value: 'createdAt', selected: true},
      ],
    };
  }
}
</script>

<style scoped>

</style>