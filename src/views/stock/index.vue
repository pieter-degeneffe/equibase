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
          {text: 'Productnaam', value: 'name', align: 'left', sortable: true, selected: true},
          {text: 'Type', value: 'type', align: 'left', sortable: true, selected: true},
          {text: 'CNK', value: 'CNK', align: 'left', sortable: true, selected: true},
          {text: 'Eenheid', value: 'outgoingUnit', align: 'left', sortable: true, selected: true},
          {text: 'BTW', value: 'tax', align: 'left', sortable: true, selected: true},
          {text: 'Verkoopsprijs', value: 'sellingPrice', align: 'left', sortable: true, selected: true},
          {text: 'Verkoopsprijs/eenheid', value: 'sellingPricePerUnit', align: 'left', sortable: true, selected: true},
          {text: 'supplementAdministration', value: 'supplementAdministration', align: 'left', sortable: true, selected: false },
          {text: 'waitingTime', value: 'waitingTime', align: 'left', sortable: false, selected: false },
          {text: 'unitSellingPrice', value: 'unitSellingPrice', align: 'left', sortable: true, selected: false },
          {text: 'unitAdministrationPrice', value: 'unitAdministrationPrice', align: 'left', sortable: true, selected: false },
          {text: 'Remaining', value: 'remaining', align: 'right', sortable: true, selected: true},
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