<template>
  <v-card class="mx-5 mt-5 mb-12" outlined>
    <v-toolbar flat>
      <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Zoeken"
          single-line
          hide-details
      />
      <v-spacer/>
      <v-btn color="primary" dark @click="openFilterDialog" class="mr-2 d-print-none">
        <v-icon left>mdi-filter</v-icon>
        Filters
      </v-btn>
    </v-toolbar>
    <v-data-table :headers="headers" :items="filteredStock" :search="search"
                  :loading="loading" :sortBy="sortBy" :sortDesc="sortDesc"
                  loading-text="Bezig met laden..." class="ma-5">
      <template v-slot:no-data>
        Geen producten gevonden
      </template>
    </v-data-table>
    <v-dialog v-model="filterDialog" max-width="490">
      <v-card>
        <v-card-text class="pt-5">
          <v-row dense>
            <v-col cols="6">
              <v-autocomplete
                  v-model="filters.type"
                  outlined
                  label="Filter op type"
                  :items="products"
                  :item-text="productType"
                  item-value="type"
                  multiple
                  hide-details
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
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
import stockAPI from '@/services/StockAPI';

export default {
  props: ['title', 'headers', 'filters', 'sortBy'],
  data() {
    return {
      search: '',
      products: [],
      loading: false,
      errored: false,
      errorMessage: '',
      filterDialog: false,
      sortDesc: true,
      options: {}
    };
  },
  watch: {
    filters: {
      handler() {
        this.getAllStock();
      },
      deep: true
    }
  },
  mounted() {
    this.getAllStock();
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
        CNK: this.filters.CNK !== null ? this.filters.CNK : undefined,
        outgoingUnit: this.filters.eenheid !== null ? this.filters.eenheid : undefined,
        remaining: this.filters.remaining !== null ? this.filters.remaining : undefined,
      };
    }
  },
  methods: {
    async getAllStock() {
      this.loading = true;
      try {
        const {data: {data}} = await stockAPI.getAllStock(this.URLParameters);
        this.products = data;
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
    productType(product) {
      return product.type;
    }
  },
}
</script>