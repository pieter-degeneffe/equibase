<template>
  <v-card class="mx-5 mt-5 mb-12" outlined>
    <v-toolbar flat>
      <SearchProduct
          @emit-product="updateList"
      />
      <v-spacer/>
      <v-btn color="primary" dark class="ml-4 d-print-none" @click="getDelivery">import medini</v-btn>
      <FilterButton
          :toFilter="toFilter"
          :filters="filters"
          :columns=true
          :headers="headers"
          :products="products"
          @emit-headers="updateFilteredHeaders"
      />
    </v-toolbar>
    <v-data-table
        :headers="filteredHeaders"
        :items="products"
        :server-items-length="totalProducts"
        :loading="loading"
        :sortBy="sortBy"
        :sortDesc="sortDesc"
        :options.sync="options"
        loading-text="Bezig met laden..."
        class="ma-5"
    >
      <template v-slot:no-data>
        Geen producten gevonden
      </template>
      <template v-slot:item="props">
        <tr @click="openStockProductPage(props.item._id)" @mouseover="mouseOver(true)" @mouseleave="mouseOver(false)">
          <td v-if="showColumn('name')">{{ props.item.name }}</td>
          <td v-if="showColumn('type')">{{ props.item.type }}</td>
          <td v-if="showColumn('CNK')">{{ props.item.CNK }}</td>
          <td v-if="showColumn('outgoingUnit')">{{ props.item.outgoingUnit }}</td>
          <td v-if="showColumn('tax')">{{ props.item.tax }}</td>
          <td v-if="showColumn('waitingTime')">{{ props.item.waitingTime }}</td>
          <td v-if="showColumn('supplementAdministration')" class="text-right">€
            {{ props.item.supplementAdministration.toFixed(2) }}
          </td>
          <td v-if="showColumn('value')" class="text-right">€ {{ props.item.value }}</td>
          <td v-if="showColumn('remaining')" class="text-right">{{ props.item.remaining }}</td>
        </tr>
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
import { mouseOver } from '@/Helpers'
import {stockAPI, deliveryAPI} from '@/services';
import FilterButton from '@/components/FilterButton';
import SearchProduct from '@/components/SearchProduct';

export default {
  components: {
    FilterButton,
    SearchProduct
  },
  props: ['title', 'headers', 'filters', 'sortBy'],
  data() {
    return {
      search: null,
      loading: false,
      errored: false,
      errorMessage: '',
      filterDialog: false,
      columnDialog: false,
      sortDesc: false,
      toFilter: ['type', 'tax', 'remaining'],
      options: {},
      totalProducts: 0,
      products: [],
      filteredHeaders: [],
      filteredProducts: [],
      deliveries: {},
    };
  },
  watch: {
    options: {
      handler() {
        this.getAllStock();
      },
      deep: true
    },
    filters: {
      handler() {
        this.getAllStock();
      },
      deep: true
    },

  },
  computed: {
    URLParameters() {
      return {
        'page': this.options.page,
        'limit': this.options.itemsPerPage,
        'sortBy': this.options.sortBy,
        'sortDesc': this.options.sortDesc,
        name: this.filters.name !== null ? this.filters.name : undefined,
        type: this.filters.type !== null ? this.filters.type : undefined,
        tax: this.filters.tax !== null ? this.filters.tax : undefined,
        outgoingUnit: this.filters.eenheid !== null ? this.filters.eenheid : undefined,
        product: this.filters.product !== null ? this.filters.product : undefined,
      };
    }
  },
  methods: {
    updateFilteredHeaders(headers) {
      this.filteredHeaders = headers;
    },
    showColumn(col) {
      return this.headers.find(header => header.value === col).selected;
    },
    updateList(product) {
      product ? this.getStock(product._id) : this.getAllStock();
    },
    openStockProductPage(id) {
      document.body.style.cursor = 'default';
      this.$router.push(`/stock/${id}`);
    },
    mouseOver,
    async getStock(id) {
      this.loading = true;
      try {
        const { data: { product } } = await stockAPI.getStockProduct(id);
        this.products = [product];
      } catch (err) {
        this.errored = true;
        this.errorMessage = err.response.data.message;
      } finally {
        this.loading = false;
      }
    },
    async getAllStock() {
      this.loading = true;
      try {
        const {data: {products, total}} = await stockAPI.getAllStock(this.URLParameters);
        if (this.filters.remaining === 'All') {
          this.products = products;
        } else {
          this.products = products.filter(prod => this.filters.remaining === "Out of stock" ? (prod.remaining === 0) : (prod.remaining > 0));
        }
        this.totalProducts = total;
      } catch (err) {
        this.errored = true;
        this.errorMessage = err.response.data.message;
      } finally {
        this.loading = false;
      }
    },
    async getDelivery() {
      this.loading = true;
      try {
        const {data} = await deliveryAPI.getMediniDelivery();
        this.deliveries = data;
      } catch (err) {
        this.errored = true;
        this.errorMessage = err.response.data.message;
      } finally {
        this.loading = false;
      }
    },
    openFilterDialog() {
      this.filterDialog = true;
    },
  },
}
</script>
