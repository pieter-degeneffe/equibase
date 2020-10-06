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
      <v-tab class="d-print-none" @change="setRefresh">
        <v-icon left>mdi-alpha-m-circle</v-icon>
        Mods
      </v-tab>
      <v-tab-item class="mb-5">
        <productForm
            :product="product"
            :loading="loading"
            callbackURL="/stock"
            :disabled="true"
            @update-product="updateProduct"
        />
      </v-tab-item>
      <v-tab-item class="ma-5">
        <BatchTable
            :headers="headers"
            :id="id"
            :product="product"
            :sort-by="sortBy"
        />
      </v-tab-item>
      <v-tab-item class="ma-5">
        <BatchModsTable
            :product="product"
            :id="id"
            :refresh="refresh"
            @update-refresh="refresh=false"
        />
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>

<script>
import BatchTable from '@/components/stock/BatchTable';
import ProductForm from '@/components/products/Form';
import BatchModsTable from '@/components/stock/BatchModsTable';
import { productsAPI} from "@/services";

export default {
  props: ['id'],
  data() {
    return {
      dialog: false,
      disabled: true,
      valid: false,
      product: {},
      totalBatches: 0,
      errored: false,
      errorMessage: '',
      loading: false,
      editedIndex: -1,
      headers: [
        {text: 'lot nummer', value: 'lotNumber', selected: true},
        {text: 'vervaldatum', value: 'expirationDate', selected: true},
        {text: 'leveringsdatum', value: 'deliveryDate', selected: true},
        {text: 'leverancier', value: 'supplier', selected: true},
        {text: 'aankoopprijs', value: 'buyInPrice', align: 'end', selected: true},
        {text: 'verkoopprijs', value: 'sellingPrice', align: 'end', selected: true},
        {text: 'verkoopprijs/eenheid', value: 'sellingPricePerUnit', align: 'end', selected: true},
        {text: 'initieel aantal', value: 'initialAmount', align: 'end', selected: false},
        {text: 'resterend', value: 'remainingAmount', align: 'end', selected: true},
        {text: 'laatste update', value: 'updatedAt', align: 'end',selected: false},
      ],
      filters: {
        remaining: 'All',
      },
      sortBy: 'expirationDate',
      sortDesc: false,
      refresh: false,
    };
  },
  components: {
    BatchTable,
    ProductForm,
    BatchModsTable
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Nieuwe batch' : 'batch bewerken'
    },
  },
  mounted() {
    this.getProduct(this.id);
  },
  methods: {
    setRefresh() {
      console.log('setRefresh: true');
      this.refresh = true;
    },
    async getProduct(id) {
      this.loading = true;
      try {
        const { data } = await productsAPI.getProduct(id);
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
