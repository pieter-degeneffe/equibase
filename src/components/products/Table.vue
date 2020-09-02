<template>
  <v-card class="mx-5 mt-5 mb-12" outlined>
    <v-data-table :headers="headers" :items="products">

    </v-data-table>
  </v-card>
</template>

<script>
  //import { productsAPI } from '../../services';
  import productsAPI from '@/services/ProductsAPI.js';

  export default {
    props: ['title', 'headers'],
    data() {
      return {
        products: [],
        loading: false,
        errored: false,
        errorMessage: '',
      };
    },
    mounted() {
      this.getProducts();
    },
    methods: {
      async getProducts() {
        this.loading = true;
        try {
          console.log('hey');
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
      }
    }
  }

</script>