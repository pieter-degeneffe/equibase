<template>
  <v-card class="ma-5" outlined>
    <products-form :product="product" :loading="loading"></products-form>
  </v-card>
</template>

<script>
  import productsAPI from '@/services/ProductsAPI';
  import productsForm from '@/components/products/Form';

  export default {
    props: ['id'],
    data() {
      return {
        product: [],
        loading: null
      }
    },
    methods: {
      async getProduct(id) {
        this.loading = true;
        try {
          const product = await productsAPI.getProduct(id);
          this.product = product.data;
          console.table(this.product);
        } catch (err) {
          this.errored = true;
          this.errorMessage = err.response.data.message;
        } finally {
          this.loading = false
        }
      }
    },
    components: {
      productsForm,
    },
  }
</script>