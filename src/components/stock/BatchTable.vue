<template>
  <v-card flat>
    <v-toolbar flat>
      <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Zoeken"
          single-line
          hide-details
      />
      <v-btn color="primary" dark @click="filterDialog = true" class="ml-4 d-print-none">
        <v-icon left>mdi-filter</v-icon>
        Filters
      </v-btn>
      <v-btn color="primary" dark @click.stop="columnDialog = true" class="ml-4 d-print-none">
        <v-icon left>mdi-cog</v-icon>
        Kolommen
      </v-btn>
    </v-toolbar>
    <v-data-table :headers='filteredHeaders' :items='filteredBatches' :search="search"
                  :sort-by.sync="sortBy" :sort-desc.sync="sortDesc">
      <template v-slot:no-data>
        Geen batches gevonden
      </template>
      <template v-slot:item='props'>
        <tr>
          <td v-if="showColumn('lotNumber')">{{ props.item.lotNumber }}</td>
          <td v-if="showColumn('expirationDate')">{{ new Date(props.item.expirationDate) | dateFormat('DD/MM/YY') }}</td>
          <td v-if="showColumn('deliveryDate')">{{ new Date(props.item.deliveryDate) | dateFormat('DD/MM/YY') }}</td>
          <td v-if="showColumn('supplier')">{{ props.item.supplier }}</td>
          <td v-if="showColumn('buyInPrice')">{{ props.item.buyInPrice }}</td>
          <td v-if="showColumn('sellingPrice')">{{ props.item.sellingPrice }}</td>
          <td v-if="showColumn('sellingPriceUnit')">{{ props.item.sellingPriceUnit }}</td>
          <td v-if="showColumn('initialAmount')">{{ props.item.initialAmount }}</td>
          <td v-if="showColumn('remainingAmount')">{{ props.item.remainingAmount }}</td>
          <td v-if="showColumn('updatedAt')">{{ new Date(props.item.updatedAt) | dateFormat('DD/MM/YY') }}</td>
        </tr>
      </template>
    </v-data-table>
    <div class="d-flex justify-end mt-5">
      <v-btn color='success' @click='openCreateDialog(editedRow)' class='ml-5 d-print-none' right depressed>
        <v-icon left>mdi-plus</v-icon>
        Nieuw lot toevoegen
      </v-btn>
    </div>
    <v-dialog v-model="filterDialog" max-width="490">
      <v-card>
        <v-card-title>Loten filteren</v-card-title>
        <v-card-text>
          <v-row dense>
            <v-col cols="12">
              <v-autocomplete
                  v-model="options.remaining"
                  outlined
                  label="Filter op remaining"
                  :items="remaining"
                  @input="applyFilter($event)"
                  hide-details
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="error" text @click="filterDialog = false">Sluiten</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model='createDialog' max-width='690'>
      <v-card>
        <v-card-title>Nieuw lot toevoegen</v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref='form' v-model='valid'>
              <v-row>
                <v-col cols='6'>
                  <v-text-field v-model='editedRow.lotNumber' required :rules='required' type='text' label='Lot nummer *'
                                />
                </v-col>
                <v-col cols='6'>
                  <v-menu
                      ref='expirationDateMenu' v-model='expirationDateMenu'
                      :close-on-content-click='false' transition='scale-transition'
                      offset-y max-width='290px' min-width='290px'
                  >
                    <template v-slot:activator='{ on }'>
                      <v-text-field
                          v-model='computedExpirationDateFormatted'
                          label='Verval datum *'
                          hint='MM/DD/YYYY format'
                          persistent-hint
                          v-on='on'
                          readonly
                          required :rules='required'
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model='editedRow.expirationDate' no-title first-day-of-week='1'
                                   @input='expirationDateMenu = false'></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols='6'>
                  <v-text-field v-model='editedRow.supplier' type='text' label='Leverancier *'/>
                </v-col>
                <v-col cols='6'>
                  <v-menu
                      v-model='deliveryDateMenu' :close-on-content-click='false'
                      transition='scale-transition' offset-y max-width='290px' min-width='290px'>
                    <template v-slot:activator='{ on }'>
                      <v-text-field
                          v-model='computedDeliveryDateFormatted'
                          label='Levering datum *'
                          hint='MM/DD/YYYY format'
                          persistent-hint
                          v-on='on'
                          readonly
                          required :rules='required'
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model='editedRow.deliveryDate' locale='nl'
                                   no-title first-day-of-week='1' @input='deliveryDateMenu = false'/>
                  </v-menu>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols='4'>
                  <v-text-field v-model='editedRow.buyInPrice'
                                type='number'
                                label='Aankoopprijs'
                                required
                                :rules="requiredNumber"
                                prefix="€" placeholder="0.00"/>
                </v-col>
                <v-col cols='4'>
                  <v-text-field v-model='editedRow.sellPriceunit'
                                type='number'
                                label='verkoopprijs/eenheid *'
                                required
                                :rules="requiredNumber"
                                prefix="€" placeholder="0.00"/>
                </v-col>
                <v-col cols='4'>
                  <v-text-field v-model='editedRow.initialAmount'
                                required
                                :rules="requiredNumber"
                                type='number'
                                label='Initieel aantal *'
                                placeholder="0"
                                />
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn color='error' text @click='close'>Annuleer</v-btn>
          <v-btn color='success' :disabled='!valid' text @click='save'>Opslaan</v-btn>
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
          <v-spacer/>
          <v-btn color="green darken-1" text @click="columnDialog = false">Sluiten</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-alert type='error' v-if='errored'>
      {{ errorMessage }}
    </v-alert>
    <v-snackbar v-model='snackbar' :timeout='timeout' :color='snackColor' bottom>
      {{ snackText }}
      <v-btn dark text @click='snackbar = false'>
        sluiten
      </v-btn>
    </v-snackbar>
  </v-card>
</template>

<script>
import {stockAPI} from '@/services'

export default {
  props: ['id', 'headers', 'batches', 'product', 'filters', 'options', 'loading'],
  data() {
    return {
      search: '',
      sortBy: 'expirationDate',
      sortDesc: false,
      expirationDateMenu: false,
      deliveryDateMenu: false,
      createDialog: false,
      filterDialog: false,
      columnDialog: false,
      valid: false,
      snackbar: false,
      timeout: 6000,
      snackText: ``,
      snackColor: '',
      singleRow: false,
      errored: false,
      errorMessage: '',
      requiredNumber: [(v) => v > 0 || 'Dit veld is verplicht en moet groter zijn dan 0'],
      required: [v => !!v || 'Dit veld is verplicht'],
      editedRow: {
        lotNumber: ''
      },
      remaining: ['All', 'In stock', 'Out of stock'],
    };
  },
  computed: {
    filteredHeaders() {
      return this.headers.filter(header => header.selected);
    },
    filteredBatches() {
      return this.batches.map(products => {
        let filtered = { ...products };
        this.headers.forEach(header => {
          if (!header.selected) delete filtered[header.value];
        });
        return filtered;
      });
    },
    computedExpirationDateFormatted() {
      return this.formatDate(this.editedRow.expirationDate);
    },
    computedDeliveryDateFormatted() {
      return this.formatDate(this.editedRow.deliveryDate);
    },
  },
  methods: {
    mouseOver(hoverState) {
      hoverState ? document.body.style.cursor = 'pointer' : document.body.style.cursor = 'default';
    },
    openFilterDialog() {
      this.filterDialog = true;
    },
    openCreateDialog(item) {
      this.createDialog = true;
      this.editedRow = item;
    },
    showColumn(col) {
      return this.headers.find(header => header.value === col).selected;
    },
    close() {
      this.$refs.form.resetValidation()
      this.createDialog = false;
    },
    applyFilter(data) {
      this.$emit('filter-batch', data);
    },
    async save() {
      this.errored = false;
      this.snackbar = true;
      this.snackColor = 'success'
      this.snackText = `Lot succesvol toegevoegd aan ${this.product.name}`
      try {
        this.loading = true;
        const {data} = await stockAPI.postStock({...this.editedRow, product: this.product._id})
        if (data) {
          this.batches.push(data);
        }
      } catch (err) {
        this.snackbar = true;
        this.snackColor = 'error'
        this.snackText = `Fout opgetreden tijden het toegevoegen aan ${this.product.name}`
        this.errored = true;
        this.errorMessage = err.response.data.message;
      } finally {
        this.close()
        this.loading = false;
      }
    },
    formatDate(date) {
      if (!date) return null;
      date = new Date(date).toISOString().substr(0, 10);
      const [year, month, day] = date.split('-');
      return `${day}/${month}/${year}`;
    },
  },
}
</script>