<template>
  <v-card class="ma-5" outlined>
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
  name: "AppliedMedication.vue",
  data() {
    return {
      title: 'Toegediende medicatie',
      outgoing: false,
      datePicker: false,
      preFilter: 'Toediening',
      filters: false,
      toFilter: ['horse'],
      headers: [
        {text: 'Type', value: 'type', selected: true},
        {text: 'Product', value: 'product', selected: true},
        {text: 'Lot nummer', value: 'batch', selected: true},
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