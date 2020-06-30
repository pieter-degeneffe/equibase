<template>
  <v-card class="ma-5" outlined>
    <v-toolbar flat color="primary" dark>
      <v-toolbar-title>{{ horse.name }}
        <v-icon v-if="horse.death">mdi-christianity</v-icon>
      </v-toolbar-title>
    </v-toolbar>
    <v-tabs>
      <v-tab class="d-print-none">
        <v-icon left>mdi-alpha-a-circle</v-icon>
        Algemene gegevens
      </v-tab>
      <v-tab v-if="horse._id" class="d-print-none">
        <v-icon left>mdi-alpha-p-circle</v-icon>
        Paspoort
      </v-tab>
      <v-tab v-if="horse._id && horse.surrogate" class="d-print-none">
        <v-icon left>mdi-sprout</v-icon>
        Embryos
      </v-tab>
      <v-tab v-if="horse._id && horse.stud_horse" class="d-print-none">
        <v-icon left>mdi-alpha-s-circle</v-icon>
        Sperma
      </v-tab>
      <v-tab v-if="horse._id && horse.stud_horse" class="d-print-none">
        <v-icon left>mdi-alpha-v-circle</v-icon>
        Verblijven
      </v-tab>
      <v-tab-item class="ma-5">
        <horse-form :horse="horse" :loading="loading" @update-horse="updateHorse"></horse-form>
      </v-tab-item>
      <v-tab-item class="ma-5">
        <v-card flat>
          <horse-passport :horse="horse"></horse-passport>
        </v-card>
      </v-tab-item>
      <v-tab-item v-if="horse.surrogate" class="ma-5">
        <embryo-table :horse-id="$route.params.id" showDonors="true" show-inactive="true" :action="transferEmbryo" actionLabel="Transfer"/>
      </v-tab-item>
      <v-tab-item v-if="horse.stud_horse" class="ma-5">
        <v-card flat>
          <semen-collection :horse="horse"></semen-collection>
        </v-card>
      </v-tab-item>
      <v-tab-item v-if="horse.stud_horse" class="ma-5">
        <v-card flat>
          <lodging :horse="horse"></lodging>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>
<script>
  import horseForm from '@/components/horse/Form';
  import lodging from '@/components/horse/Lodging';
  import horsePassport from '@/components/horse/Passport';
  import semenCollection from '@/components/horse/semenCollection/Table';
  import { horseAPI, icsiAPI } from '@/services';
  import EmbryoTable from '../../components/icsi/EmbryoTable';

  export default {
    props: ['id'],
    data() {
      return {
        horse: {},
        loading: null,
      };
    },
    watch: {
      '$route.params.id'(newId) {
        this.getHorses(newId);
      }
    },
    beforeMount() {
      if (this.id !== 'undefined') {
        this.getHorses(this.id);
      }
    },
    methods: {
      async transferEmbryo(embryoId, transferDate) {
        console.log(embryoId);
        await icsiAPI.transferEmbryo({
          embryoId,
          surrogateId: this.id,
          transferDate,
        });
      },
      async getHorses(id) {
        this.loading = true;
        try {
          const horse = await horseAPI.getHorse(id);
          this.horse = horse.data;
        } catch (err) {
          this.errored = true;
          this.errorMessage = err.response.data.message;
        } finally {
          this.loading = false;
        }
      },
      updateHorse(horse) {
        this.horse = horse;
      },
    },
    components: {
      EmbryoTable,
      horseForm,
      horsePassport,
      semenCollection,
      lodging
    },
  };
</script>

<style lang="css"></style>
