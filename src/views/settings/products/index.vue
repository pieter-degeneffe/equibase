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
          {text: 'Productnaam', value: 'name', sortable: true},
          {text: 'Type', value: 'type', sortable: true},
          {text: 'CNK', value: 'CNK', sortable: true},
          {text: 'Eenheid', value: 'outgoingUnit', sortable: false},
          {text: 'Wachttijd (dagen)', value: 'waitingTime', sortable: false},
          {text: 'BTW', value: 'tax', align: 'left', sortable: false},
          {text: 'Supplement (€)', value: 'supplementAdministration', align: 'end', sortable: false},
          {text: '', value: 'action', align: 'end', sortable: false},
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