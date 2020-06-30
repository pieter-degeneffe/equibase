<template>
  <v-card class="mx-5 mt-5 mb-12" outlined>
    <v-data-table
        :headers="filteredHeaders"
        :items="filteredData"
        :options.sync="options"
        :server-items-length="total"
        :loading="loading"
        :sortBy="sortBy"
        :sortDesc="sortDesc"
        loading-text="Bezig met laden..."
        class="ma-5"
    >
      <template v-slot:top>
        <v-row dense class="mx-1">
          <v-col cols="4" sm="4">
            <v-toolbar-title class="float-left">Embryos {{ id? `- ${id}`:'' }}</v-toolbar-title>
          </v-col>
          <v-col cols="4" sm="4">
            <v-toolbar-title class="float-left" v-if="!showDonors">
              <v-icon medium>mdi-gender-female</v-icon>
              {{horseName(data.donor_mare) }} -
              <v-icon medium>mdi-gender-male</v-icon>
              {{horseName(data.donor_stallion) }}
            </v-toolbar-title>
          </v-col>
          <v-col cols="4" sm="4">
            <div fixed right>
              <div class="float-right">
                <v-btn color="primary" dark @click="openFilterDialog" class="mr-2 d-print-none">
                  <v-icon left>mdi-filter</v-icon>
                  Filters
                </v-btn>
                <v-btn color="primary" dark @click.stop="columnDialog = true" class="d-print-none">
                  <v-icon left>mdi-settings</v-icon>
                  Kolommen
                </v-btn>
              </div>
            </div>
          </v-col>
        </v-row>
      </template>
      <template v-slot:no-data>
        Geen Embryos gevonden
      </template>
      <template v-slot:item="props">
        <tr>
          <td v-if="showColumn('code')">{{ props.item.code }}</td>
          <td v-if="showColumn('donor_mare')">{{ props.item.donor_mare.name||'' }}</td>
          <td v-if="showColumn('donor_stallion')">{{ props.item.donor_stallion.name||'' }}</td>
          <td v-if="showColumn('container')">{{ props.item.location.container.name}}</td>
          <td v-if="showColumn('tube')">{{ props.item.location.tube}}</td>
          <td v-if="showColumn('color')">{{ props.item.color}}</td>
          <td v-if="showColumn('owner')"><span v-if="props.item.owner">{{ ownerName(props.item.owner) }}</span></td>
          <td v-if="showColumn('transferDate')">{{ formatDate(props.item.date_transferred) }}</td>
          <td v-if="showColumn('exportDate')">{{formatDate(props.item.date_exported)}}</td>
          <td v-if="showColumn('importedAt')">{{ formatDate(props.item.date_imported)}}</td>
          <td v-if="showColumn('createdAt')">{{ formatDate(props.item.createdAt) }}</td>
          <td v-if="showColumn('updatedAt')">{{ formatDate(props.item.updatedAt)}}</td>
        </tr>
      </template>
    </v-data-table>
    <v-btn v-if="action" fixed right bottom color="primary" class="ma-2 white--text" depressed dark
           @click="openActionDialog()">
      {{actionLabel}} embryo
      <v-icon right dark>mdi-plus</v-icon>
    </v-btn>
    <v-dialog v-if="action" v-model="actionDialog" max-width="490">
      <v-card>
        <v-card-text class="pt-5">
          <v-row dense>
            <v-col cols="12" md="6">
              <v-autocomplete
                  v-model="embryoToAdd"
                  outlined
                  label="Selecteer een embryo"
                  :items="availableEmbryos"
                  :item-text="embryoCode"
                  return-object
                  item-value="_id"
              />
            </v-col>
            <v-col cols="12" md="6">

              <v-switch v-if="actionLabel === 'Export'"
                        v-model="inHouse"
                        :label="`${inHouse? 'In house stockage':'Stockage bij de eigenaar'}`"
              />
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" md="6">
              <v-menu
                  v-model="actionDateMenu" :close-on-content-click="false" :nudge-right="40"
                  transition="scale-transition" offset-y min-width="290px">
                <template v-slot:activator="{ on }">
                  <v-text-field
                      v-model="computedActionDateFormatted"
                      label="Datum van uitvoering"
                      v-on="on"
                      readonly
                      outlined
                      :loading="loading"
                  />
                </template>
                <v-date-picker
                    required
                    v-model="actionDate"
                    locale="nl"
                    first-day-of-week="1"
                    no-title
                    @input="collectionDateMenu = false"
                />
              </v-menu>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="green darken-1" text @click="executeAction" :loading="executingAction"
                 :disabled="!embryoToAdd || !actionDate">{{actionLabel}}
          </v-btn>
          <v-btn color="red darken-1" text @click="closeActionDialog">Sluiten</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="filterDialog" max-width="490">
      <v-card>
        <v-card-text class="pt-5">
          <v-row dense>
            welke filters zouden hier interessant zijn?
            <!--            <v-col cols="6">-->
            <!--              <v-autocomplete v-model="filters.donor_mare" outlined label="Filter op merrie" :items="mares"-->
            <!--                              :item-text="horseName" return-object item-value="_id" multiple-->
            <!--                              hide-details></v-autocomplete>-->
            <!--            </v-col>-->
            <!--            <v-col cols="6">-->
            <!--              <v-autocomplete v-model="filters.donor_stallion" outlined label="Filter op hengst" :items="stallions"-->
            <!--                              :item-text="horseName" return-object item-value="_id" multiple-->
            <!--                              hide-details></v-autocomplete>-->
            <!--            </v-col>-->
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
                  <v-checkbox :label="header.text" v-model="header.selected" :value="header.selected"/>
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
    <v-alert type="error" v-if="errored">
      {{ errorMessage }}
    </v-alert>
  </v-card>
</template>

<script>
  import { ownerName } from '@/Helpers';
  import { horseAPI, icsiAPI } from '@/services';
  import { formatDate } from '../../Helpers';

  export default {
    props: ['id', 'title', 'showDonors', 'showInactive', 'customerId', 'horseId', 'onClick', 'action', 'actionLabel'],
    data() {
      return {
        executingAction: false,
        actionDate: null,
        actionDateMenu: false,
        sortDesc: true,
        filterDialog: false,
        columnDialog: false,
        actionDialog: false,
        total: 0,
        data: {
          embryos: [],
          donor_mare: {},
          donor_stallion: {},
        },
        embryoToAdd: null,
        availableEmbryos: [],
        mares: [],
        stallions: [],
        loading: true,
        inHouse: true,
        options: {},
        errored: false,
        errorMessage: '',
        headers: [
          { text: 'Code', value: 'code', align: 'left', sortable: true, selected: true },
          { text: 'Donor Merrie', value: 'donor_mare', align: 'left', sortable: true, selected: this.showDonors },
          { text: 'Donor Hengst', value: 'donor_stallion', align: 'left', selected: this.showDonors },
          { text: 'Stikstof vat', value: 'container', sortable: true, selected: true },
          { text: 'Koker', value: 'tube', sortable: true, selected: true },
          { text: 'Kleur', value: 'color', sortable: true, selected: false },
          { text: 'Eigenaar', value: 'owner', sortable: true, selected: true },
          { text: 'Getransfereerd op', value: 'transferDate', sortable: true, selected: true },
          { text: 'Geëxporteerd op', value: 'exportDate', sortable: true, selected: true },
          { text: 'Geïmporteerd op', value: 'importedAt', sortable: true, selected: true },
          { text: 'Gewijzigd op', value: 'updatedAt', sortable: true, selected: true },
          { text: 'Aangemaakt op', value: 'createdAt', sortable: true, selected: true },
        ],
        filters: {
          donor_mare: null,
          donor_stallion: null,
        },
        sortBy: 'amount'
      };
    },
    watch: {
      filters: {
        handler() {
          this.getEmbryos();
        },
        deep: true
      }
    },
    mounted() {
      this.getAvailableEmbryos();
      this.getEmbryos();
    },
    computed: {
      filteredHeaders() {
        return this.headers.filter(header => header.selected);
      },
      computedActionDateFormatted() {
        return this.formatDate(this.actionDate);
      },
      filteredData() {
        return this.data.embryos.filter(el => this.showInactive || el.active).map(el => {
          let filtered = { ...el };
          this.headers.forEach(header => {
            if (!header.selected) delete filtered[header.value];
          });
          return filtered;
        });
      },
      URLParameters() {
        const URLParameters = {
          'page': this.options.page,
          'limit': this.options.itemsPerPage,
          'sortBy': this.options.sortBy,
          'sortDesc': this.options.sortDesc,
        };
        return (URLParameters);
      }
    },
    methods: {
      ownerName,
      formatDate,
      async executeAction() {
        this.executingAction = true;
        await this.action(this.embryoToAdd._id, this.actionDate);
        this.executingAction = false;
        await this.getEmbryos();
        this.closeActionDialog();

      },
      openActionDialog() {
        this.actionDialog = true;
      },
      closeActionDialog() {
        this.actionDialog = false;
        this.embryoToAdd = null;
      },
      embryoCode: embryo => embryo.code || '',
      openFilterDialog() {
        this.filterDialog = true;
      },
      async getAvailableEmbryos() {
        this.loading = true;
        try {
          const { data } = await icsiAPI.getAvailableEmbryos();
          this.availableEmbryos = data.embryos;
        } catch (err) {
          this.errored = true;
          this.errorMessage = err.response.data.message;
        } finally {
          this.loading = false;
        }
      },
      showColumn(col) {
        return this.headers.find(header => header.value === col).selected;
      },
      horseName(horse) {
        return horse.name || '';
      },
      async getEmbryos() {
        this.loading = true;
        try {
          let request;
          if (this.id) {
            request = icsiAPI.getICSI(this.id);
          }
          if (this.customerId) {
            request = icsiAPI.getEmbryosByCustomer(this.customerId);
          }
          if (this.horseId) {
            request = icsiAPI.getEmbryosByHorse(this.horseId);
          }
          const response = await request;
          this.data = response.data;
          this.total = response.data.total;
        } catch (e) {
          this.errored = true;
          this.errorMessage = e.response.data.message;
        } finally {
          this.loading = false;
        }
      },
      async getMares() {
        try {
          const response = await horseAPI.getHorses({
            page: this.options.page,
            limit: this.options.itemsPerPage,
            sortBy: this.options.sortBy,
            sortDesc: this.options.sortDesc,
            type: 'merrie'
          });
          this.mares = response.data.horses;
          ``;
        } catch (e) {
          console.log('Arne: e= ', e);
          this.errored = true;
          this.errorMessage = e.response.data.message;
        }
      },
      async getStallions() {
        try {
          const response = await horseAPI.getHorses({
            page: this.options.page,
            limit: this.options.itemsPerPage,
            sortBy: this.options.sortBy,
            sortDesc: this.options.sortDesc,
            type: 'hengst'
          });
          this.stallions = response.data.horses;
        } catch (e) {
          this.errored = true;
          this.errorMessage = e.response.data.message;
        }
      },
    },
  };
</script>
