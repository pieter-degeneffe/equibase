<template>
  <v-card class="mx-5 mt-5 mb-12" outlined>
    <v-data-table :headers="headers" :items="products"
                  :loading="loading" loading-text="Bezig met laden..." class="ma-5">
      <template v-slot:item.action="{ item }">
        <v-icon small class="mr-2" @click="openProductPage(item.id)">
          mdi-pencil
        </v-icon>
        <v-icon small @click="deleteItem(item)">
          mdi-delete
        </v-icon>
      </template>
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
  //import { productsAPI } from '../../services';
  import productsAPI from '@/services/ProductsAPI';

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
          const { data: { products } } = await productsAPI.getAllProducts();
          this.products = products;
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
          await productsAPI.deleteProduct(item.id);
          await this.getProducts();
        } catch (e) {
          console.log(e);
          this.errored = true;
          this.errorMessage = e.response.data.message;
        } finally {
          this.loading = false;
        }
      },
      openProductPage(id) {
        this.$router.push(`/settings/product/${id}`);
      }
    }
  }

</script>
