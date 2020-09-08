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
      <v-btn color="primary" dark @click="openFilterDialog" class="mr-2 ml-5 d-print-none">
        <v-icon left>mdi-filter</v-icon>
        Filters
      </v-btn>
    </v-toolbar>
    <v-data-table :headers="headers" :items="products" :search="search"
                  :loading="loading" :sortBy="sortBy" :sortDesc="sortDesc"
                  loading-text="Bezig met laden..." class="ma-5">
      <template v-slot:no-data>
        Geen producten gevonden
      </template>
      <template v-slot:item="props">
        <tr @click="openStockProductPage(props.item._id)" @mouseover="mouseOver(true)" @mouseleave="mouseOver(false)">
          <td>{{ props.item.name }}</td>
          <td>{{ props.item.type }}</td>
          <td>{{ props.item.CNK }}</td>
          <td>{{ props.item.outgoingUnit }}</td>
          <td>{{ props.item.tax }}</td>
          <td>{{ props.item.sellingPrice }}</td>
          <td>{{ props.item.sellingPricePerUnit }}</td>
          <td align="right">{{ props.item.remaining }}</td>
        </tr>
      </template>
    </v-data-table>
    <v-dialog v-model="filterDialog" max-width="490">
      <v-card>
        <v-card-text class="pt-5">
          <v-row dense>
            <v-col cols="12">
              <v-autocomplete
                  v-model="filters.type"
                  outlined
                  label="Filter op type"
                  :items="types"
                  multiple
                  hide-details
              />
            </v-col>
            <v-col cols="6">
              <v-autocomplete
                  v-model="filters.tax"
                  outlined
                  label="Filter op BTW"
                  :items="taxes"
                  item-value="tax"
                  multiple
                  hide-details
              />
            </v-col>
            <v-col cols="6">
              <v-autocomplete
                  v-model="options.remaining"
                  outlined
                  label="Filter op remaining"
                  :items="remaining"
                  hide-details
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="green darken-1" text @click="filterDialog = false">Sluiten</v-btn>
        </v-card-actions>
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
import { stockAPI, productsAPI } from '../../services';

export default {
  props: ['title', 'headers', 'filters', 'sortBy'],
  data() {
    return {
      search: '',
      loading: false,
      errored: false,
      errorMessage: '',
      filterDialog: false,
      sortDesc: true,
      options: {
        remaining: 'All',},
      products: [],
      types: [],
      taxes: [],
      remaining: ['All', 'In stock', 'Out of stock']
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
    }
  },
  mounted() {
    this.getConfig();
    this.getAllStock();
  },
  computed: {
    URLParameters() {
      return {
        name: this.filters.name !== null ? this.filters.name : undefined,
        type: this.filters.type !== null ? this.filters.type : undefined,
        tax: this.filters.tax !== null ? this.filters.tax : undefined,
        outgoingUnit: this.filters.eenheid !== null ? this.filters.eenheid : undefined,
      };
    }
  },
  methods: {
    openStockProductPage(id) {
      this.$router.push(`/stock/${ id }`);
    },
    mouseOver(hoverState) {
      hoverState ? document.body.style.cursor = 'pointer' : document.body.style.cursor = 'default';
    },
    async getAllStock() {
      this.loading = true;
      try {
        const {data: {data}} = await stockAPI.getAllStock(this.URLParameters);
        if(this.options.remaining === 'All'){
          this.products = data;
        } else {
          this.products = data.filter(prod => this.options.remaining === "Out of stock" ? (prod.remaining === 0) : (prod.remaining > 0));
        }
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
    async getConfig() {
      this.errored = false;
      try {
        const { data: { types, tax } } = await productsAPI.getConfig();
        this.types = types;
        this.taxes = tax;
      } catch (err) {
        this.errored = true;
        this.errorMessage = err.response.data.message;
      }
    }
  },
}
</script>