<template>
  <div>
    <ICSITable title="ICSI Loten" :headers="headers" :filters="filters"></ICSITable>
    <v-btn bottom color="primary" class="ma-2 white--text" depressed dark @click="openCreateICSIPage()" fixed right>
      {{ $route.name }} lot toevoegen
      <v-icon right dark>mdi-plus</v-icon>
    </v-btn>
  </div>
</template>

<script>
  import ICSITable from '@/components/icsi/Table';

  export default {
    data() {
      return {
        headers: [
          { text: 'Code', value: 'code', align: 'left', sortable: true, selected: true },
          { text: 'Donor Merrie', value: 'donor_mare', align: 'left', sortable: true, selected: true },
          { text: 'Donor Hengst', value: 'donor_stallion', align: 'left', selected: true },
          { text: 'Aantal embryos', value: 'amount', sortable: true, selected: true },
          { text: 'Gewijzigd op', value: 'updatedAt', sortable: true, selected: true },
          { text: 'Aangemaakt op', value: 'createdAt', sortable: true, selected: true },
        ],
        filters: {
          donor_mare: null,
          donor_stallion: null,
          location: {
            container: null,
            tube: null,
          },
          owner: null,
        },
        sortBy: 'amount'
      };
    },
    methods: {
      openCreateICSIPage() {
        this.$router.push({ path: `/icsi/create` });
      }
    },
    components: {
      ICSITable
    }
  };
</script>

<style scoped>

</style>
