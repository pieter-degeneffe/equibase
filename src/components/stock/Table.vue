<template>
  <v-card class="mx-5 mt-5 mb-12" outlined>
    <v-toolbar flat>
      <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Zoeken"
          single-line
          hide-details
          @input="searchStock"
      />
      <FilterButton
          :toFilter="toFilter"
          :filters="filters"
          :headers="headers"
          :products="products"
      />
    </v-toolbar>
    <v-data-table :headers="filteredHeaders" :items="filteredProducts" :server-items-length="totalProducts"
                  :loading="loading" :sortBy="sortBy" :sortDesc="sortDesc" :options.sync="options"
                  loading-text="Bezig met laden..." class="ma-5">
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
          <td v-if="showColumn('supplementAdministration')" align="end">€ {{ props.item.supplementAdministration.toFixed(2) }}</td>
          <td v-if="showColumn('value')" align="end">€ {{ props.item.value }}</td>
          <td v-if="showColumn('remaining')" align="end">{{ props.item.remaining }}</td>
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
import { stockAPI } from '../../services';
import FilterButton from '@/components/FilterButton';

export default {
  components: {
    FilterButton,
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
  mounted() {
    this.getAllStock();
  },
  computed: {
    filteredHeaders() {
      return this.headers.filter(header => header.selected);
    },
    filteredProducts() {
      return this.products.map(products => {
        let filtered = { ...products };
        this.headers.forEach(header => {
          if (!header.selected) delete filtered[header.value];
        });
        return filtered;
      });
    },
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
      };
    }
  },
  methods: {
    searchStock(item) {
      this.search = item;
    },
    openStockProductPage(id) {
      document.body.style.cursor = 'default';
      this.$router.push(`/stock/${ id }`);
    },
    mouseOver(hoverState) {
      hoverState ? document.body.style.cursor = 'pointer' : document.body.style.cursor = 'default';
    },
    showColumn(col) {
      return this.headers.find(header => header.value === col).selected;
    },
    async getAllStock() {
      this.loading = true;
      try {
        const { data: {products, total}} = await stockAPI.getAllStock(this.URLParameters);
        if(this.filters.remaining === 'All'){
          this.products = products;
        } else {
          this.products = products.filter(prod => this.filters.remaining === "Out of stock" ? (prod.remaining === 0) : (prod.remaining > 0));
        }
        this.totalProducts = total;
      } catch (err) {
        this.errored = true;
        console.log(err)
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