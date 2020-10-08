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
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
              color="primary"
              class="ml-4 d-print-none"
              v-bind="attrs" v-on="on"
              dark :disabled="checkSelectedBatches">
            <v-icon left>mdi-chevron-down</v-icon>
            Acties
          </v-btn>
        </template>
        <v-list>
          <v-list-item
              v-for="(item, index) in actieMenu"
              :key="index"
              @click="item.action"
              :disabled="item.singleSelect ? selectedBatches.length > 1 : false"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <FilterButton
        :toFilter="toFilter"
        :filters="filters"
        :columns=true
        :headers="headers"
        :products="batches"
        @emit-headers="updateFilteredHeaders"
      />
    </v-toolbar>
    <v-data-table :headers='filteredHeaders'
                  :items='batches'
                  :loading="loading"
                  loading-text="Bezig met laden..."
                  :server-items-length="totalBatches"
                  :sort-by="sortBy"
                  :sortDesc="sortDesc"
                  :options.sync="options"
                  v-model="selectedBatches"
                  show-select
                  :single-select="false"
    >
      <template v-slot:no-data>
        Geen batches gevonden
      </template>
      <template v-slot:item='props'>
        <tr
            @click="false && selectRow(props.item)"
            @mouseover="false && ouseOver(true)"
            @mouseleave=" false && mouseOver(false)"
            :style="{
              backgroundColor: (selectedBatches.includes(props.item) ? '#efefef' : (!props.item.active) ? '#f9f9f9' : ''),
              color: ((!props.item.active) ? '#999' : '')
            }"
        >
          <td>
            <v-checkbox
                dense
                :input-value="props.isSelected"
                @change="props.select($event)"
            />
          </td>
          <td v-if="showColumn('lotNumber')">{{ props.item.lotNumber }}</td>
          <td v-if="showColumn('expirationDate')">{{new Date(props.item.expirationDate) | dateFormat('DD/MM/YYYY')}}</td>
          <td v-if="showColumn('deliveryDate')">{{ new Date(props.item.deliveryDate) | dateFormat('DD/MM/YYYY') }}</td>
          <td v-if="showColumn('supplier')">{{ props.item.supplier }}</td>
          <td v-if="showColumn('buyInPrice')" align="end">€ {{ props.item.buyInPrice.toFixed(2) }}</td>
          <td v-if="showColumn('sellingPrice')" align="end">€ {{ props.item.sellingPrice.toFixed(2) }}</td>
          <td v-if="showColumn('sellingPricePerUnit')" align="end">€ {{ props.item.sellingPricePerUnit.toFixed(2) }}</td>
          <td v-if="showColumn('initialAmount')" align="end">{{ props.item.initialAmount }}</td>
          <td v-if="showColumn('remainingAmount')" align="end">{{ props.item.remainingAmount }}</td>
          <td v-if="showColumn('updatedAt')" align="end">{{ new Date(props.item.updatedAt) | dateFormat('DD/MM/YYYY') }}</td>
        </tr>
      </template>
    </v-data-table>
    <div class="d-flex justify-end mt-5">
      <v-btn color='success' @click='openCreateDialog(editedRow)' class='ml-5 d-print-none' right depressed>
        <v-icon left>mdi-plus</v-icon>
        Nieuw lot toevoegen
      </v-btn>
    </div>
    <v-dialog v-model='createDialog' max-width='690'>
      <v-card>
        <v-card-title>Nieuw lot toevoegen</v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref='form' v-model='valid'>
              <v-row>
                <v-col cols='6'>
                  <v-text-field v-model='editedRow.lotNumber' required :rules='required' type='text'
                                label='Lot nummer *'
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
                          label='Leveringsdatum *'
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
                  <v-text-field v-model='editedRow.sellingPricePerUnit'
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
    <v-dialog v-model='editDialog' max-width='690'>
      <v-card>
        <v-card-title>Product aanpassen - type: {{ updateRow.type }}</v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid">
              <v-row class="ml-5 mr-5">
                <v-col cols="6">
                  <v-select
                      :rules="required"
                      :items="modsTypes"
                      disabled
                      v-model="updateRow.type"
                      label="type *"
                      :loading="loading"
                  />
                </v-col>
                <v-col cols="6">
                  <v-text-field
                      min="0"
                      max="10"
                      :rules="requiredNumber"
                      type="number"
                      v-model="updateRow.amount"
                      label="aantal *"
                      :loading="loading"
                  />
                </v-col>
              </v-row>
              <v-row v-if="updateRow.type === 'Verkoop'" class="ml-5 mr-5">
                <v-col cols="12">
                  <v-select
                      :rules="required"
                      :items="customers"
                      item-value="_id"
                      :item-text="generateCustomerName"
                      v-model="updateRow.client"
                      label="Klant *"
                      :loading="loading"
                      clearable
                  />
                </v-col>
              </v-row>
              <v-row v-if="updateRow.type === 'Toediening'" class="ml-5 mr-5">
                <v-col cols="12">
                  <v-select
                      :rules="required"
                      :items="horses"
                      item-value="_id"
                      item-text="name"
                      v-model="updateRow.horse"
                      label="Paard *"
                      :loading="loading"
                      clearable
                  />
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="error" text @click="close">Annuleer</v-btn>
          <v-btn color="success" :disabled="!valid" text @click="edit">Opslaan</v-btn>
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
import {stockAPI, configAPI, customerAPI, horseAPI} from '@/services'
import FilterButton from "@/components/FilterButton";

export default {
  components: {
    FilterButton,
  },
  props: ['id', 'headers', 'sortBy', 'sortDesc', 'product'],
  data() {
    return {
      search: null,
      expirationDateMenu: false,
      deliveryDateMenu: false,
      editDialog: false,
      createDialog: false,
      valid: false,
      loading: false,
      snackbar: false,
      timeout: 6000,
      snackText: ``,
      snackColor: '',
      singleRow: false,
      errored: false,
      errorMessage: '',
      filters: {
        remaining: 'All',
      },
      toFilter: ['remaining'],
      requiredNumber: [(v) => v > 0 || 'Dit veld is verplicht en moet groter zijn dan 0'],
      required: [v => !!v || 'Dit veld is verplicht'],
      editedRow: {
        lotNumber: ''
      },
      updateRow: {},
      totalBatches: 0,
      batches: [],
      selectedBatches: [],
      modsTypes: [],
      customers: [],
      horses: [],
      actieMenu: [
        { title: 'Deactiveer', action: this.deactivate, singleSelect: false },
        { title: 'Activeer', action: this.activate, singleSelect: false },
        { title: 'Beschadigd', action: this.openEditDialog, singleSelect: true },
        { title: 'Verkoop', action: this.openEditDialog, singleSelect: true },
        { title: 'Toediening', action: this.openEditDialog, singleSelect: true },
        { title: 'Controle', action: this.openEditDialog, singleSelect: true },
      ],
      options: {},
      remaining: ['All', 'In stock', 'Out of stock'],
      filteredHeaders: [],
      filteredBatches: [],
    };
  },
  watch: {
    options: {
      handler() {
        this.getStockProduct(this.id);
      },
      deep: true
    },
    filters: {
      handler() {
        this.getStockProduct(this.id);
      },
      deep: true
    },
  },
  mounted() {
    this.getStockProduct(this.id);
    this.getModsConfig();
    this.getCustomers();
    this.getHorses();
  },
  computed: {
    computedExpirationDateFormatted() {
      return this.formatDate(this.editedRow.expirationDate);
    },
    computedDeliveryDateFormatted() {
      return this.formatDate(this.editedRow.deliveryDate);
    },
    checkSelectedBatches() {
      return this.selectedBatches.length === 0;
    },
    URLParameters() {
      return {
        'page': this.options.page,
        'limit': this.options.itemsPerPage,
        'sortBy': this.options.sortBy,
        'sortDesc': this.options.sortDesc,
        'query': this.options.search,
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
    generateCustomerName(item) {
      return (`${item.last_name} ${item.first_name}`);
    },
    selectRow(row) {
      !this.selectedBatches.includes(row) ? this.selectedBatches.push(row) : this.selectedBatches = this.selectedBatches.filter(item => item !== row);
    },
    showSnackbar(color, text) {
      this.snackbar = true;
      this.snackColor = color;
      this.snackText = text;
    },
    mouseOver(hoverState) {
      hoverState ? document.body.style.cursor = 'pointer' : document.body.style.cursor = 'default';
    },
    openCreateDialog(item) {
      this.createDialog = true;
      this.editedRow = item;
    },
    openEditDialog(e) {
      this.editDialog = true;
      this.updateRow = {
        id: this.selectedBatches[0].id,
        type: e.target.innerText,
      };
    },
    close() {
      this.$refs.form.resetValidation()
      this.createDialog = false;
      this.editDialog = false;
      this.getStockProduct(this.id);
    },
    async getModsConfig() {
      this.errored = false;
      try {
        const { data: { types }} = await configAPI.getModConfig();
        this.modsTypes = types;
      } catch (err) {
        this.errored = true;
        this.errorMessage = err.response.data.message;
      }
    },
    async getCustomers() {
      this.errored = false;
      try {
        const { data } = await customerAPI.getCustomers();
        this.customers = data;
      } catch (err) {
        this.errored = true;
        this.errorMessage = err.response.data.message;
      }
    },
    async getHorses() {
      this.errored = false;
      try {
        const { data: { horses } } = await horseAPI.getHorses();
        this.horses = horses;
      } catch (err) {
        this.errored = true;
        this.errorMessage = err.response.data.message;
      }
    },
    async getStockProduct(id) {
      this.loading = true;
      try {
        const {data: {batches, total}} = await stockAPI.getStockProduct(id, this.URLParameters);
        this.batches = batches;
        if (this.filters.remaining === 'All') {
          this.batches = batches;
        } else {
          this.batches = batches.filter(prod => this.filters.remaining === "Out of stock" ? (prod.remainingAmount === 0) : (prod.remainingAmount > 0));
        }
        this.totalBatches = total;
      } catch (err) {
        this.errored = true;
        this.errorMessage = err.response.data.message;
      } finally {
        this.loading = false;
      }
    },
    async edit() {
      this.errored = false;
      try {
        this.loading = true;
        await stockAPI.putStock(this.id, {...this.updateRow}, this.updateRow.id);
        this.showSnackbar('success', `${this.product.name} aangepast`);
      } catch (err) {
        this.showSnackbar('error',`Fout opgetreden tijdens het aanpassen van ${this.product.name}`);
        this.errored = true;
        this.errorMessage = err.response.data.message;
      } finally {
        this.close();
        this.selectedBatches = [];
        this.loading = false;
      }
    },
    async save() {
      this.errored = false;
      try {
        this.loading = true;
        const {data} = await stockAPI.postStock({...this.editedRow, product: this.product._id})
        if (data) {
          this.batches.push(data);
        }
        this.showSnackbar('success', `Lot succesvol toegevoegd aan ${this.product.name}`);
      } catch (err) {
        this.showSnackbar('error',`Fout opgetreden tijdens het toegevoegen aan ${this.product.name}`);
        this.errored = true;
        this.errorMessage = err.response.data.message;
      } finally {
        this.close()
        this.loading = false;
      }
    },
    async deactivate() {
      this.errored = false;
      try {
        this.loading = true;
        await Promise.all(this.selectedBatches.map(({_id}) => stockAPI.deactivateBatch(_id)));
        await this.getStockProduct(this.id);
        this.selectedBatches = [];
        this.showSnackbar('success', 'lot succesvol gedeactiveerd');
      } catch (err) {
        this.showSnackbar('error', `Fout opgetreden tijdens het deactiveren van ${this.selectedBatches._id}`);
        this.errored = true;
        this.errorMessage = err.response.data.message;
      } finally {
        this.loading = false;
      }
    },
    async activate() {
      this.errored = false;
      try {
        this.loading = true;
        await Promise.all(this.selectedBatches.map(({_id}) => stockAPI.activateBatch(_id)));
        await this.getStockProduct(this.id);
        this.selectedBatches = [];
        this.showSnackbar('success', 'lot succesvol geactiveerd');
      } catch (err) {
        this.showSnackbar('error', `Fout opgetreden tijdens het activeren van ${this.selectedBatches._id}`);
        this.errored = true;
        this.errorMessage = err.response.data.message;
      } finally {
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

<style scoped>
.theme--dark.v-btn.v-btn--disabled:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined) {
  background-color: #eee !important;
  color: #999 !important;
}
.theme--dark.v-btn.v-btn--disabled .v-icon, .theme--dark.v-btn.v-btn--disabled .v-btn__loading {
  color: #999 !important;
}
</style>
