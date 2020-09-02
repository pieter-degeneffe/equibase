<template>
  <v-card class="ma-5" outlined>
    <v-data-table :headers="headers" :items="products" :loading="loading" loading-text="Bezig met laden...">
      <template v-slot:item.action="{ item }">
        <v-icon small @click="deleteItem(item)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
    <v-row>
      <v-col cols="12">
        <v-alert type="error" v-if="errored" class="mx-5">
          {{ errorMessage }}
        </v-alert>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import productsAPI from "@/services/ProductsAPI.js";
export default {
  data() {
    return {
      loading: null,
      errored: false,
      errorMessage: '',
      headers: [
        { text: 'Naam medicijn', align: 'left', sortable: true, value: 'name' },
        { text: 'Type', align: 'left', sortable: true, value: 'type' },
        { text: 'CNK', align: 'left', sortable: true, value: 'CNK' },
        { text: 'Eenheid', align: 'left', sortable: false, value: 'outgoingUnit' },
        { text: 'BTW', align: 'left', sortable: false, value: 'tax' },
        { text: 'Verkoopsprijs', align: 'left', sortable: false, value: 'sellingPrice' },
        { text: 'Verkoopsprijs/eenheid', align: 'left', sortable: false, value: 'sellingPricePerUnit' },
        //{ text: 'supplementAdministration', align: 'left', sortable: false, value: 'supplementAdministration' },
        //{ text: 'waitingTime', align: 'left', sortable: false, value: 'waitingTime' },
        //{ text: 'unitSellingPrice', align: 'left', sortable: false, value: 'unitSellingPrice' },
        //{ text: 'unitAdministrationPrice', align: 'left', sortable: false, value: 'unitAdministrationPrice' },
        { text: 'Bewerken', align: 'right', sortable: false, value: 'action' },
      ],
      products: [],
    }
  },
  mounted() {
    this.loadProducts();
  },
  methods: {
    async loadProducts() {
      this.loading = true;
      try {
        const response = await productsAPI.getProduct();
        this.products = response.data.products;
        //console.table(response.data.products);
      } catch (e) {
        console.log(e);
        this.errored = true;
        this.errorMessage = e.response.data.message;
      } finally {
        this.loading = false;
      }
    },
    async deleteItem(item) {
      try {
        this.loading = true;
        this.errored = false;
        const response = await productsAPI.deleteProduct(item.id);
        console.log(response);
        this.loadProducts();
        /*if (response) {
          const index = this.products.indexOf(item)
          this.products.splice(index, 1)
        }*/
      } catch(e) {
        console.log(e);
        this.errored = true;
        this.errorMessage = e.response.data.message;
      } finally {
        this.loading = false;
      }
    },
  }
}
</script>