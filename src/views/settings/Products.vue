<template>
  <div>
    <productsTable title="Productenlijst" :headers="headers"></productsTable>
    <!-- <v-data-table :headers="headers" :items="products" :loading="loading" loading-text="Bezig met laden...">
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn color="primary" dark class="mb-2" v-on="on">Product toevoegen</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">Nieuw product toevoegen</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-form ref="form" v-model="valid">
                    <v-row>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field v-model="editedItem.name" :rules="required" label="Productnaam*" outlined></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-select v-model="editedItem.type" :items="types" :rules="required" label="Type*" outlined></v-select>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field v-model="editedItem.CNK" :rules="required" label="CNK*" type="number" outlined></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-select v-model="editedItem.tax" :items="tax" :rules="required" label="Tax*" outlined></v-select>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field v-model="editedItem.outgoingUnit" :rules="required" label="Eenheid*" type="number" outlined></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field v-model="editedItem.sellingPrice" :rules="required" label="sellingPrice*" type="number" outlined></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field v-model="editedItem.sellingPricePerUnit" :rules="required" label="sellingPricePerUnit*" type="number" outlined></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field v-model="editedItem.supplementAdministration" :rules="required" label="supplementAdministration*" type="number" outlined></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field v-model="editedItem.waitingTime" :rules="required" label="waitingTime*" type="number" outlined></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field v-model="editedItem.unitSellingPrice" :rules="required" label="unitSellingPrice*" type="number" outlined></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field v-model="editedItem.unitAdministrationPrice" :rules="required" label="unitAdministrationPrice*" type="number" outlined></v-text-field>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">Annuleer</v-btn>
                <v-btn color="blue darken-1" :disabled="!valid" text @click="save">Opslaan</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon small @click="deleteItem(item)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table> -->
  </div>
</template>

<script>
  import productsAPI from '@/services/ProductsAPI.js';
  import productsTable from '@/components/products/Table';

  export default {
    data() {
      return {
        dialog: false,
        loading: null,
        valid: false,
        errored: false,
        errorMessage: '',
        required: [
          v => !!v || 'Dit veld is verplicht'
        ],
        headers: [
          {text: 'Productnaam', align: 'left', sortable: true, value: 'name'},
          {text: 'Type', align: 'left', sortable: true, value: 'type'},
          {text: 'CNK', align: 'left', sortable: true, value: 'CNK'},
          {text: 'Eenheid', align: 'left', sortable: false, value: 'outgoingUnit'},
          {text: 'BTW', align: 'left', sortable: false, value: 'tax'},
          {text: 'Verkoopsprijs', align: 'left', sortable: false, value: 'sellingPrice'},
          {text: 'Verkoopsprijs/eenheid', align: 'left', sortable: false, value: 'sellingPricePerUnit'},
          //{ text: 'supplementAdministration', align: 'left', sortable: false, value: 'supplementAdministration' },
          //{ text: 'waitingTime', align: 'left', sortable: false, value: 'waitingTime' },
          //{ text: 'unitSellingPrice', align: 'left', sortable: false, value: 'unitSellingPrice' },
          //{ text: 'unitAdministrationPrice', align: 'left', sortable: false, value: 'unitAdministrationPrice' },
          {text: 'Bewerken', align: 'right', sortable: false, value: 'action'},
        ],
        // te refactoren
        /* types: ['Materiaal','Geneesmiddel','Voedingssupplement','Ontsmettingsmiddel'],
        tax: ['6%','21'],
        products: [],
        editedIndex: -1,
        editedItem: {
          name: ''
        },
        defaultItem: {
          name: ''
        },*/
      }
    },
    components: {
      productsTable
    },
    mounted() {
      this.loadProducts();
    },
    watch: {
      dialog(val) {
        val || this.close()
      }
    },
    methods: {
      async loadProducts() {
        this.loading = true;
        try {
          const response = await productsAPI.getProduct();
          this.products = response.data.products;
          //console.table(response.data.products);
        } catch (e) {
          console.log(e);
          this.errored = true;
          this.errorMessage = e.response.data.message;
        } finally {
          this.loading = false;
        }
      },
      async deleteItem(item) {
        try {
          this.loading = true;
          this.errored = false;
          await productsAPI.deleteProduct(item.id);
          this.loadProducts();
          /*if (response) {
            const index = this.products.indexOf(item)
            this.products.splice(index, 1)
          }*/
        } catch (e) {
          console.log(e);
          this.errored = true;
          this.errorMessage = e.response.data.message;
        } finally {
          this.loading = false;
        }
      },
      close() {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },
      async save() {
        try {
          this.loading = true;
          this.errored = false;
          const response = await productsAPI.postProduct(this.editedItem);
          console.log(response);
          if (response) {
            this.products.push(response.data);
          }
        } catch(e) {
          this.errored = true;
          this.errorMessage = e.response.data.message;
        } finally {
          this.close()
          this.loading = false;
        }
      }
    }
  }
</script>