<template>
  <v-card class="mx-5 mt-5 mb-5" outlined>
    <v-toolbar flat>
      <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Zoeken"
          single-line
          hide-details
      />
    </v-toolbar>
    <v-data-table :headers="headers" :items="products" :search="search"
                  :loading="loading" loading-text="Bezig met laden..."
                  class="ma-5">
      <template v-slot:no-data>
        Geen producten gevonden
      </template>
      <template v-slot:item="props">
        <tr>
          <td>{{ props.item.name }}</td>
          <td>{{ props.item.type }}</td>
          <td>{{ props.item.CNK }}</td>
          <td>{{ props.item.outgoingUnit }}</td>
          <td>{{ props.item.waitingTime }}</td>
          <td>{{ props.item.tax }}</td>
          <td>{{ props.item.supplementAdministration }}</td>
          <td align="right" class="d-print-none">
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

  export default {
    props: ['title', 'headers'],
    data() {
      return {
        search: '',
        products: [],
        loading: false,
        errored: false,
        errorMessage: '',
        deleteDialog: false,
        deleteQueue: {},
      };
    },
    mounted() {
      this.getProducts();
    },
    methods: {
      async getProducts() {
        this.loading = true;
        try {
          const { data: { products } } = await productsAPI.getAllProducts();
          this.products = products;
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
        } catch (e) {
          this.errored = true;
          this.errorMessage = e.response.data.message;
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
