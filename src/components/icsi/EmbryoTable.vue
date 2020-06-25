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
            <v-toolbar-title class="float-left">Embryos {{ id? `- ${id}`:'' }} </v-toolbar-title>
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
          <td v-if="showColumn('importedAt')">{{ new Date(props.item.date_imported)| dateFormat('DD/MM/YY') }}</td>
          <td v-if="showColumn('createdAt')">{{ new Date(props.item.createdAt) | dateFormat('DD/MM/YY')}}</td>
          <td v-if="showColumn('updatedAt')">{{ new Date(props.item.updatedAt) | dateFormat('DD/MM/YY')}}</td>
        </tr>
      </template>
    </v-data-table>
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
          <v-spacer></v-spacer>
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
    <v-alert type="error" v-if="errored">
      {{ errorMessage }}
    </v-alert>
  </v-card>
</template>

<script>
  import { ownerName } from '@/Helpers';
  import { horseAPI, icsiAPI } from '@/services';

  export default {
    props: ['id', 'title','showDonors', 'customerId', 'horseId'],
    data() {
      return {
        sortDesc: true,
        filterDialog: false,
        columnDialog: false,
        total: 0,
        data: {
          embryos: [],
          donor_mare: {},
          donor_stallion: {},
        },
        mares: [],
        stallions: [],
        loading: true,
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
      this.getEmbryos();
    },
    computed: {
      filteredHeaders() {
        return this.headers.filter(header => header.selected);
      },
      filteredData() {
        return this.data.embryos.filter(el => el.active).map(el => {
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
      openFilterDialog() {
        this.filterDialog = true;
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
          if(this.id){
            request = icsiAPI.getICSI(this.id);
          }
          if(this.customerId){
            request = icsiAPI.getEmbryosByCustomer(this.customerId);
          }
          if(this.horseId){
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
