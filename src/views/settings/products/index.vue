<template>
  <div>
    <productsTable title="Productenlijst" :headers="headers"></productsTable>
    <v-btn button color="primary" class="ma-2" depressed dark @click="openProductPage()" fixed bottom right>
      product toevoegen
      <v-icon right dark>mdi-plus</v-icon>
    </v-btn>
  </div>
</template>

<script>
  import productsTable from '@/components/products/Table';

  export default {
    data() {
      return {
        headers: [
          {text: 'Productnaam', value: 'name', sortable: true, selected: true},
          {text: 'Type', value: 'type', sortable: true, selected: true},
          {text: 'CNK', value: 'CNK', sortable: true, selected: true},
          {text: 'Eenheid', value: 'outgoingUnit', sortable: false, selected: true},
          {text: 'Wachttijd (dagen)', value: 'waitingTime', sortable: false, selected: true},
          {text: 'BTW', value: 'tax', align: 'left', sortable: false, selected: true},
          {text: 'Supplement (€)', value: 'supplementAdministration', align: 'end', sortable: false, selected: true},
          {text: '', value: 'action', align: 'end', sortable: false, selected: true},
        ],
      }
    },
    components: {
      productsTable
    },
    methods: {
      openProductPage(id) {
        this.$router.push({ path: `/settings/product/${id}` });
      }
    }
  }
</script>