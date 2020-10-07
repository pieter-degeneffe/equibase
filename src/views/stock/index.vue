<template>
  <div>
    <stockTable title="Stock overzicht" :headers="headers" :filters="filters" :sort-by="sortBy"/>
  </div>
</template>

<script>
  import stockTable from '@/components/stock/Table';

  export default {
    data() {
      return {
        headers: [
          {text: 'Productnaam', value: 'name', sortable: true, selected: true},
          {text: 'Type', value: 'type', sortable: true, selected: true},
          {text: 'CNK', value: 'CNK', sortable: true, selected: true},
          {text: 'Eenheid', value: 'outgoingUnit', sortable: true, selected: true},
          {text: 'BTW', value: 'tax', sortable: true, selected: true},
          {text: 'Wachttijd (dagen)', value: 'waitingTime', sortable: false, selected: false },
          {text: 'Supplement', value: 'supplementAdministration', align: 'end', sortable: true, selected: false },
          {text: 'Totale verkoopsprijs', value: 'value', align: 'end', sortable: true, selected: true},
          {text: 'Resterend', value: 'remaining', align: 'end', sortable: true, selected: true},
        ],
        filters: {
          remaining: 'All',
        },
        sortBy: 'name',
      }
    },
    components: {
      stockTable
    },
  }
</script>