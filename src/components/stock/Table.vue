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
      <v-btn color="primary" dark @click="openFilterDialog" class="ml-5 d-print-none">
        <v-icon left>mdi-filter</v-icon>
        Filters
      </v-btn>
      <v-btn color="primary" dark @click.stop="columnDialog = true" class="ml-4 d-print-none">
        <v-icon left>mdi-cog</v-icon>
        Kolommen
      </v-btn>
    </v-toolbar>
    <v-data-table :headers="filteredHeaders" :items="filteredProducts" :search="search"
                  :loading="loading" :sortBy="sortBy" :sortDesc="sortDesc"
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
          <td v-if="showColumn('sellingPrice')">{{ props.item.sellingPrice }}</td>
          <td v-if="showColumn('sellingPricePerUnit')">{{ props.item.sellingPricePerUnit }}</td>
          <td v-if="showColumn('supplementAdministration')">{{ props.item.supplementAdministration }}</td>
          <td v-if="showColumn('waitingTime')">{{ props.item.waitingTime }}</td>
          <td v-if="showColumn('unitSellingPrice')">{{ props.item.unitSellingPrice }}</td>
          <td v-if="showColumn('unitAdministrationPrice')">{{ props.item.unitAdministrationPrice }}</td>
          <td v-if="showColumn('remaining')" align="right">{{ props.item.remaining }}</td>
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
    <v-dialog v-model="columnDialog" max-width="690">
      <v-card>
        <v-card-text>
          <v-list>
            <v-row dense>
              <v-col cols="12" sm="6" md="4" v-for="header in headers" :key="header.text">
                <v-list-item>
                  <v-checkbox :label="header.text" v-model="header.selected" :value="header.selected"></v-checkbox>
                </v-list-item>
              </v-col>
            </v-row>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="columnDialog = false">Sluiten</v-btn>
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
import { stockAPI, configAPI } from '../../services';

export default {
  props: ['title', 'headers', 'filters', 'sortBy'],
  data() {
    return {
      search: '',
      loading: false,
      errored: false,
      errorMessage: '',
      filterDialog: false,
      columnDialog: false,
      sortDesc: true,
      options: {
        remaining: 'All',},
      products: [],
      types: [],
      taxes: [],
      remaining: ['All', 'In stock', 'Out of stock'],
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
        const {data: {stock}} = await stockAPI.getAllStock(this.URLParameters);
        if(this.options.remaining === 'All'){
          this.products = stock;
        } else {
          this.products = stock.filter(prod => this.options.remaining === "Out of stock" ? (prod.remaining === 0) : (prod.remaining > 0));
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
        const { data: { types, tax } } = await configAPI.getProductConfig();
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