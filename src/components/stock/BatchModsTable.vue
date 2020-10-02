<template>
  <v-card flat>
    <v-toolbar flat></v-toolbar>
    <v-data-table :headers="headers" :items="mods">
      <template v-slot:no-data>
        Geen stock modificaties voor product {{ product.name }} gevonden.
      </template>
    </v-data-table>
    <v-alert type='error' v-if='errored'>
      {{ errorMessage }}
    </v-alert>
  </v-card>
</template>

<script>
import {stockAPI} from '@/services'

export default {
  name: "BatchModsTable",
  props: ['id', 'product'],

  data() {
    return {
      mods: [],
      errored: false,
      errorMessage: '',
      headers: [
        {text: 'Type', value: 'type', selected: true},
        {text: 'Product', value: 'product', selected: true},
        {text: 'Batch', value: 'batch', selected: true},
        {text: 'Klant', value: 'client', selected: true},
        {text: 'Paard', value: 'horse', selected: true},
        {text: 'Aantal', value: 'amount', selected: true},
      ],
    };
  },
  mounted() {
    this.getStockProductMods(this.id);
  },
  methods: {
    async getStockProductMods(id) {
      this.loading = true;
      try {
        const { data } = await stockAPI.getStockProductMods(id, false);
        this.mods = data;
        console.log(data);
        this.errored = false;
      } catch (err) {
        this.errored = true;
        this.errorMessage = err.response.data.message;
      } finally {
        this.loading = false;
      }
    }
  },
}
</script>

<style scoped>

</style>