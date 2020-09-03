<template>
  <div>
    <productsTable title="Productenlijst" :headers="headers"></productsTable>
    <v-btn button color="primary" class="ma-2 white--text" depressed dark @click="openCreateProductPage()" fixed right>
      {{ $route.name }} toevoegen
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
          {text: 'BTW', align: 'left', sortable: false, value: 'tax'},
          {text: 'Verkoopsprijs', align: 'left', sortable: false, value: 'sellingPrice'},
          {text: 'Verkoopsprijs/eenheid', align: 'left', sortable: false, value: 'sellingPricePerUnit'},
          //{ text: 'supplementAdministration', align: 'left', sortable: false, value: 'supplementAdministration' },
          //{ text: 'waitingTime', align: 'left', sortable: false, value: 'waitingTime' },
          //{ text: 'unitSellingPrice', align: 'left', sortable: false, value: 'unitSellingPrice' },
          //{ text: 'unitAdministrationPrice', align: 'left', sortable: false, value: 'unitAdministrationPrice' },
          {text: 'Bewerken', align: 'right', sortable: false, value: 'action'},
        ],
      }
    },
    components: {
      productsTable
    },
    methods: {
      openCreateProductPage() {
        this.$router.push({ path: `/settings/products/create` });
      }
    }
  }
</script>