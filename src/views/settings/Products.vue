<template>
  <v-card class="ma-5" outlined>

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
        this.products = response.data;
        console.table(response.data.products);
      } catch (e) {
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