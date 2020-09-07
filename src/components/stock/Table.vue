<template>
  <v-card class="mx-5 mt-5 mb-12" outlined>
    <v-toolbar flat>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Zoeken"
        single-line
        hide-details
      >
      </v-text-field>
    </v-toolbar>
    <v-data-table :headers="headers" :items="products" :search="search"
                  :loading="loading" loading-text="Bezig met laden..."
                  class="ma-5">
      <template v-slot:no-data>
        Geen producten gevonden
      </template>
    </v-data-table>
    <v-row v-if="errored">
      <v-col cols="12">
        <v-alert type="error" v-if="errored" class="mx-5">
          {{ errorMessage }}
        </v-alert>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
  import stockAPI from '@/services/StockAPI';

  export default {
    props: ['title', 'headers'],
    data() {
      return {
        search: '',
        products: [],
        loading: false,
        errored: false,
        errorMessage: '',
      };
    },
    mounted() {
      this.getAllStock();
    },
    methods: {
      async getAllStock() {
        this.loading = true;
        try {
          const { data: { data } } = await stockAPI.getAllStock();
          this.products = data;
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