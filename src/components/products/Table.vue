<template>
  <v-card class="mx-5 mt-5 mb-12" outlined>
    <v-data-table :headers="headers" :items="products">
      <template v-slot:item.action="{ item }">
        <v-icon small @click="deleteItem(item)">
          mdi-delete
        </v-icon>
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
  import productsAPI from '@/services/ProductsAPI.js';

  export default {
    props: ['title', 'headers'],
    data() {
      return {
        products: [],
        loading: false,
        errored: false,
        errorMessage: '',
        // te refactoren
        /*types: ['Materiaal','Geneesmiddel','Voedingssupplement','Ontsmettingsmiddel'],
        tax: ['6%','21'],
        products: [],
        editedIndex: -1,
        editedItem: {
          name: ''
        },
        defaultItem: {
          name: ''
        },*/
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
      },
      async deleteItem(item) {
        try {
          this.loading = true;
          this.errored = false;
          await productsAPI.deleteProduct(item.id);
          this.getProducts();
        } catch (e) {
          console.log(e);
          this.errored = true;
          this.errorMessage = e.response.data.message;
        } finally {
          this.loading = false;
        }
      },
      close() {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },
      async save() {
        try {
          this.loading = true;
          this.errored = false;
          const response = await productsAPI.postProduct(this.editedItem);
          console.log(response);
          if (response) {
            this.products.push(response.data);
          }
        } catch(e) {
          this.errored = true;
          this.errorMessage = e.response.data.message;
        } finally {
          this.close()
          this.loading = false;
        }
      }
    }
  }

</script>