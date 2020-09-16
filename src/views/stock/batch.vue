<template>
  <v-card class="ma-5" outlined>
    <v-toolbar flat dense light>
      <v-toolbar-title>{{ product.name }}</v-toolbar-title>
    </v-toolbar>
    <v-divider/>
    <v-tabs>
      <v-tab class="d-print-none">
        <v-icon left>mdi-alpha-d-circle</v-icon>
        Details
      </v-tab>
      <v-tab class="d-print-none">
        <v-icon left>mdi-alpha-l-circle</v-icon>
        Loten
      </v-tab>
      <v-tab class="d-print-none">
        <v-icon left>mdi-alpha-m-circle</v-icon>
        Mods
      </v-tab>
      <v-tab-item class="mb-5">
        <productForm :product="product" :loading="loading" callbackURL="/stock"
                     :disabled="true" @update-product="updateProduct"/>
      </v-tab-item>
      <v-tab-item class="ma-5">
        <BatchTable :headers="headers" :id="id" :batches="batches"
                    :product="product" :filters="filters" :options="options"/>
      </v-tab-item>
      <v-tab-item class="ma-5">
        <h3>mods</h3>
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>

<script>
import BatchTable from '@/components/stock/BatchTable';
import ProductForm from '@/components/products/Form';
import {stockAPI} from "@/services";

export default {
  props: ['id'],
  data() {
    return {
      dialog: false,
      disabled: true,
      valid: false,
      product: {},
      batches: [],
      errored: false,
      errorMessage: '',
      loading: false,
      options: {
        remaining: 'All',
      },
      editedIndex: -1,
      headers: [
        {text: 'lot nummer', value: 'lotNumber'},
        {text: 'vervaldatum', value: 'expirationDate'},
        {text: 'leveringsdatum', value: 'deliveryDate'},
        {text: 'leveraar', value: 'supplier'},
        {text: 'buyInPrice', value: 'buyInPrice'},
        {text: 'initial amount', value: 'initialAmount'},
        {text: 'remaining', value: 'remainingAmount'},
        {text: 'laatste update', value: 'updatedAt'},
      ],
      filters: {
        supplier: '',
        remaining: '',
      }
    };
  },
  components: {
    BatchTable,
    ProductForm,
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Nieuwe batch' : 'batch bewerken'
    },
  },
  beforeMount() {
    if (this.id !== 'undefined') {
      this.getStockProduct(this.id);
    }
  },
  methods: {
    async getStockProduct(id) {
      this.loading = true;
      try {
        const {data: {batches}, data} = await stockAPI.getStockProduct(id);
        if (this.options.remaining === 'All') {
          this.batches = batches;
        } else {
          this.batches = batches.filter(prod => this.options.remaining === "Out of stock" ? (prod.remaining === 0) : (prod.remaining > 0));
        }
        this.product = data;
      } catch (err) {
        this.errored = true;
        this.errorMessage = err.response.data.message;
      } finally {
        this.loading = false;
      }
    },
    updateProduct(product) {
      this.product = product;
    },
  },
};
</script>
