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
        <BatchTable :headers="headers" :id="id" :batches="batches" :loading="loading"
                    :product="product" :filters="filters" :options="options"
                    @filter-batch="filterBatch"/>
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
        {text: 'lot nummer', value: 'lotNumber', selected: true},
        {text: 'vervaldatum', value: 'expirationDate', selected: true},
        {text: 'leveringsdatum', value: 'deliveryDate', selected: true},
        {text: 'leverancier', value: 'supplier', selected: true},
        {text: 'aankoopprijs', value: 'buyInPrice', selected: true},
        {text: 'verkoopprijs', value: 'sellingPrice', selected: true},
        {text: 'verkoopprijs/eenheid', value: 'sellingPriceUnit', selected: true},
        {text: 'initieel aantal', value: 'initialAmount', selected: false},
        {text: 'resterend', value: 'remainingAmount', selected: true},
        {text: 'laatste update', value: 'updatedAt', selected: false},
      ],
      filters: {
        remaining: null,
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
  watch: {
    options: {
      handler() {
        this.getStockProduct(this.id);
      },
      deep: true
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
          this.batches = batches.filter(prod => this.options.remaining === "Out of stock" ? (prod.remainingAmount === 0) : (prod.remainingAmount > 0));
        }
        this.product = data;
      } catch (err) {
        this.errored = true;
        this.errorMessage = err.response.data.message;
      } finally {
        this.loading = false;
      }
    },
    filterBatch(filter) {
      this.options.remaining = filter;
    },
    updateProduct(product) {
      this.product = product;
    },

  },
};
</script>
