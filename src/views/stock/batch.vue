<template>
  <BatchTable :headers="headers" :id="id" />

</template>

<script>
  import BatchTable from '@/components/stock/BatchTable';

  export default {
    props: ['id'],
    data() {
      return {
        headers: [
          { text: 'lot nummer', value: 'lotNumber' },
          { text: 'vervaldatum', value: 'expirationDate' },
          { text: 'leveringsdatum', value: 'deliveryDate' },
          { text: 'leveraar', value: 'supplier' },
          { text: 'laatste update', value: 'updatedAt' },
          { text: 'initial amount', value: 'initialAmount' },
          { text: 'remaining', value: 'remainingAmount' },
        ],
      };
    },
    components: {
      BatchTable
    },
    methods: {
      },
  };
</script>