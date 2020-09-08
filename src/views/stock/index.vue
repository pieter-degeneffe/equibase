<template>
  <div>
    <stockTable title="Stock overzicht" :headers="headers" :filters="filters"/>
  </div>
</template>

<script>
  import stockTable from '@/components/stock/Table';

  export default {
    data() {
      return {
        headers: [
          {text: 'Productnaam', align: 'left', sortable: true, value: 'name'},
          {text: 'Type', align: 'left', sortable: true, value: 'type'},
          {text: 'CNK', align: 'left', sortable: true, value: 'CNK'},
          {text: 'Eenheid', align: 'left', sortable: true, value: 'outgoingUnit'},
          {text: 'BTW', align: 'left', sortable: true, value: 'tax'},
          {text: 'Verkoopsprijs', align: 'left', sortable: true, value: 'sellingPrice'},
          {text: 'Verkoopsprijs/eenheid', align: 'left', sortable: true, value: 'sellingPricePerUnit'},
          //{ text: 'supplementAdministration', align: 'left', sortable: true, value: 'supplementAdministration' },
          //{ text: 'waitingTime', align: 'left', sortable: false, true: 'waitingTime' },
          //{ text: 'unitSellingPrice', align: 'left', sortable: true, value: 'unitSellingPrice' },
          //{ text: 'unitAdministrationPrice', align: 'left', sortable: true, value: 'unitAdministrationPrice' },
          {text: 'Remaining', align: 'right', sortable: true, value: 'remaining'},
        ],
        filters: {
          name: null,
          type: null,
          CNK: null,
          tax: null,
          eenheid: null,
          remaining: null,
        },
        sortBy: 'name',
        sortDesc: false
      }
    },
    components: {
      stockTable
    },
  }
</script>