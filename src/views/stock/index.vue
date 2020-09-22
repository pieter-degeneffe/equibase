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
          {text: 'Productnaam', value: 'name', align: 'start', sortable: true, selected: true},
          {text: 'Type', value: 'type', align: 'start', sortable: true, selected: true},
          {text: 'CNK', value: 'CNK', align: 'start', sortable: true, selected: true},
          {text: 'Eenheid', value: 'outgoingUnit', align: 'start', sortable: true, selected: true},
          {text: 'BTW', value: 'tax', align: 'start', sortable: true, selected: true},
          {text: 'Wachttijd (dagen)', value: 'waitingTime', align: 'left', sortable: false, selected: false },
          {text: 'Supplement', value: 'supplementAdministration', align: 'end', sortable: true, selected: false },
          {text: 'Totale verkoopsprijs', value: 'sellingPrice', align: 'end', sortable: true, selected: true},
          {text: 'Resterend', value: 'remaining', align: 'end', sortable: true, selected: true},
        ],
        filters: {
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