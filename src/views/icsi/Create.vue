<template>
  <v-card class="ma-5" outlined>
    <v-toolbar flat color="primary" dark>
      <v-toolbar-title>{{ icsi.code }}</v-toolbar-title>
    </v-toolbar>
    <icsi-form :icsi="icsi" :loading="loading"/>
  </v-card>
</template>

<script>
  import icsiForm from '@/components/icsi/Form';
  import icsiAPI from '@/services/icsi';

  export default {
    props: ['id'],
    data() {
      return {
        icsi: {
          embryos: [],
          location: {}
        },
        loading: null
      };
    },
    watch: {
      date() {
        this.dateFormatted = this.formatDate(this.icsi.collectionDate);
      },
      // '$route.params.id'(newId) {
      //   this.getICSI(newId);
      // }
    },
    beforeMount() {
      // if (this.id !== 'undefined') this.getICSI(this.id);
    },
    methods: {
      async getICSI(id) {
        this.loading = true;
        try {
          const icsi = await icsiAPI.getICSI(id);
          this.icsi = icsi.data;
        } catch (err) {
          this.errored = true;
          this.errorMessage = err.response.data.message;
        } finally {
          this.loading = false;
        }
      },
      updateICSI(icsi) {
        this.icsi = icsi;
      },
    },
    components: {
      icsiForm,
    },
  };
</script>

