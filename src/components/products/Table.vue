<template>
  <v-card class="mx-5 mt-5 mb-5" outlined>
    <v-toolbar flat>
      <SearchProduct
        @emit-product="updateList"
      />
      <v-spacer/>
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
        class="ma-5"
        :headers="filteredHeaders"
        :items="products"
        :search="search"
        :loading="loading"
        loading-text="Bezig met laden..."
        :server-items-length="totalProducts"
        :options.sync="options"
    >
      <template v-slot:no-data>
        Geen producten gevonden
      </template>
      <template v-slot:item="props">
        <tr>
          <td v-if="showColumn('name')">{{ props.item.name }}</td>
          <td v-if="showColumn('type')">{{ props.item.type }}</td>
          <td v-if="showColumn('CNK')">{{ props.item.CNK }}</td>
          <td v-if="showColumn('outgoingUnit')">{{ props.item.outgoingUnit }}</td>
          <td v-if="showColumn('waitingTime')">{{ props.item.waitingTime }}</td>
          <td v-if="showColumn('tax')">{{ props.item.tax }}</td>
          <td v-if="showColumn('supplementAdministration')" align="end">€ {{ props.item.supplementAdministration.toFixed(2) }}</td>
          <td align="end" class="d-print-none">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon dark color="primary" class="mr-2" @click="openProductPage(props.item._id)" v-on="on">
                  mdi-pencil
                </v-icon>
              </template>
              <span>Product bewerken</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon dark color="primary" @click="openDeleteDialog(props.item)" v-on="on">
                  mdi-delete
                </v-icon>
              </template>
              <span>Product verwijderen</span>
            </v-tooltip>
          </td>
        </tr>
      </template>
    </v-data-table>
    <v-dialog v-model="deleteDialog" persistent max-width="500px">
      <v-card>
        <v-card-title>Product verwijderen</v-card-title>
        <v-card-text>
          <p>U staat op het punt om {{ this.deleteQueue.name }} te verwijderen.</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="blue darken-1" text @click="closeDeleteDialog">Annuleren</v-btn>
          <v-btn color="error" text @click="deleteItem(deleteQueue)">Verwijderen</v-btn>
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
  import productsAPI from '@/services/ProductsAPI';
  import FilterButton from "@/components/FilterButton";
  import SearchProduct from "@/components/SearchProduct";

  export default {
    components: {
      FilterButton,
      SearchProduct
    },
    props: ['title', 'headers'],
    data() {
      return {
        search: '',
        totalProducts: 0,
        products: [],
        loading: false,
        errored: false,
        errorMessage: '',
        deleteDialog: false,
        deleteQueue: {},
        options: {},
        sortBy: '',
        sortDesc: false,
        filters: {},
        toFilter: ['type'],
        filteredHeaders: [],
        filteredProducts: [],
      };
    },
    watch: {
      options: {
        handler() {
          this.getProducts();
        },
        deep: true
      },
      filters: {
        handler() {
          this.getProducts();
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
          type: this.filters.type !== null ? this.filters.type : undefined,
        };
      }
    },
    methods: {
      updateList(id) {
        !id ? this.getProducts() : this.getProduct(id);
      },
      updateFilteredHeaders(headers) {
        this.filteredHeaders = headers;
      },
      showColumn(col) {
        return this.headers.find(header => header.value === col).selected;
      },
      async getProduct(id) {
        this.loading = true;
        try {
          const { data } = await productsAPI.getProduct(id);
          this.products = [data];
          console.log(data);
        } catch (err) {
          this.errored = true;
          this.errorMessage = err.response.data.message;
        } finally {
          this.loading = false;
        }
      },
      async getProducts() {
        this.loading = true;
        try {
          const { data: { products, total } } = await productsAPI.getAllProducts(this.URLParameters);
          this.products = products;
          this.totalProducts = total;
        } catch (err) {
          this.errored = true;
          this.errorMessage = err.response.data.message;
        } finally {
          this.loading = false;
        }
      },
      async deleteItem(item) {
        try {
          this.loading = true;
          this.errored = false;
          await productsAPI.deleteProduct(item._id);
          this.deleteDialog = false;
          await this.getProducts();
        } catch (err) {
          this.errored = true;
          this.errorMessage = err.response.data.message;
        } finally {
          this.loading = false;
        }
      },
      openDeleteDialog(item) {
        this.deleteQueue = item;
        this.deleteDialog = true;
      },
      closeDeleteDialog() {
        this.deleteQueue = {};
        this.deleteDialog = false;
      },
      openProductPage(id) {
        this.$router.push(`/settings/product/${id}`);
      }
    },
  }

</script>
