<template>
  <products-form :product="product" :loading="loading" callbackURL="/settings/products"
                 :disabled="disabled" @update-product="updateProduct"/>
</template>

<script>
import productsAPI from '@/services/ProductsAPI';
import productsForm from '@/components/products/Form';

export default {
  props: ['id'],
  data() {
    return {
      disabled: false,
      product: {},
      loading: null,
      errored: false,
      errorMessage: '',
    }
  },
  beforeMount() {
    if (this.id !== 'undefined') {
      this.getProduct(this.id);
    }
  },
  methods: {
    async getProduct(id) {
      this.loading = true;
      try {
        const product = await productsAPI.getProduct(id);
        this.product = product.data;
      } catch (err) {
        this.errored = true;
        this.errorMessage = err.response.data.message;
      } finally {
        this.loading = false
      }
    },
    updateProduct(product) {
      this.product = product;
    }
  },
  components: {
    productsForm,
  },
}
</script>
