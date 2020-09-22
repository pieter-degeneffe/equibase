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
          {text: 'Productnaam', align: 'left', sortable: true, value: 'name'},
          {text: 'Type', align: 'left', sortable: true, value: 'type'},
          {text: 'CNK', align: 'left', sortable: true, value: 'CNK'},
          {text: 'Eenheid', align: 'left', sortable: false, value: 'outgoingUnit'},
          {text: 'Wachttijd (dagen)', align: 'left', sortable: false, value: 'waitingTime'},
          {text: 'BTW', align: 'left', sortable: false, value: 'tax'},
          {text: 'Supplement (€)', align: 'left', sortable: false, value: 'supplementAdministration'},
          {text: '', align: 'right', sortable: false, value: 'action'},
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