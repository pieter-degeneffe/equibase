<template>
  <!--  <v-card class="ma-5" outlined>-->
  <!--    <h1>test</h1>-->
  <!--  </v-card>-->
  <div>
    <EmbryoTable title="Embryos" :id="$route.params.id" :headers="headers" :filters="filters"></EmbryoTable>
  </div>
</template>

<script>
  import EmbryoTable from '@/components/icsi/EmbryoTable';

  export default {
    data() {
      return {
        headers: [
          { text: 'Code', value: 'code', align: 'left', sortable: true, selected: true },
          { text: 'Donor Merrie', value: 'donor_mare', align: 'left', sortable: true, selected: false },
          { text: 'Donor Hengst', value: 'donor_stallion', align: 'left', selected: false },
          { text: 'Stikstof vat', value: 'container', sortable: true, selected: true },
          { text: 'Koker', value: 'tube', sortable: true, selected: true },
          { text: 'Kleur', value: 'color', sortable: true, selected: false },
          { text: 'Eigenaar', value: 'owner', sortable: true, selected: true },
          { text: 'Geïmporteerd op', value: 'importedAt', sortable: true, selected: true },
          { text: 'Gewijzigd op', value: 'updatedAt', sortable: true, selected: true },
          { text: 'Aangemaakt op', value: 'createdAt', sortable: true, selected: true },
        ],
        filters: {
          donor_mare: null,
          donor_stallion: null,
        },
        sortBy: 'amount'
      };
    },
    // '$route.params.id'(newId) {
    //   this.getEmbryos(newId);
    // },
    components: {
      EmbryoTable
    }
  };
</script>

<style scoped>

</style>
