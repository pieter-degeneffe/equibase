<template>
  <v-card class="mx-5 mt-5 mb-12" outlined>
    <v-data-table :headers="filteredHeaders" :items="filteredICSIs" :options.sync="options"
                  :server-items-length="totalICSIs" :loading="loading" :sortBy="sortBy" :sortDesc="sortDesc"
                  loading-text="Bezig met laden..." class="ma-5">
      <template v-slot:top>
        <v-row dense class="mx-1">
          <v-col cols="8" sm="6">
            <v-toolbar-title class="float-left">{{ title }}</v-toolbar-title>
          </v-col>
          <v-col cols="4" sm="6">
            <div fixed right>
              <div class="float-right">
                <v-btn color="primary" dark @click="openFilterDialog" class="mr-2 d-print-none">
                  <v-icon left>mdi-filter</v-icon>
                  Filters
                </v-btn>
                <v-btn color="primary" dark @click.stop="columnDialog = true" class="d-print-none">
                  <v-icon left>mdi-cog</v-icon>
                  Kolommen
                </v-btn>
              </div>
            </div>
          </v-col>
        </v-row>
      </template>
      <template v-slot:no-data>
        Geen ICSI loten gevonden
      </template>
      <template v-slot:item="props">
        <tr @click="openICSIPage(props.item.code)" @mouseover="mouseOver(true)" @mouseleave="mouseOver(false)">
          <td v-if="showColumn('code')">{{ props.item.code }}</td>
          <td v-if="showColumn('donor_mare')">{{ props.item.donor_mare.name||'' }}</td>
          <td v-if="showColumn('donor_stallion')">{{ props.item.donor_stallion.name||'' }}</td>
          <td v-if="showColumn('amount')">{{ props.item.embryos.filter(el=>el.active).length}}</td>
          <td v-if="showColumn('createdAt')">{{ new Date(props.item.createdAt) | dateFormat('DD/MM/YY')}}</td>
          <td v-if="showColumn('updatedAt')">{{ new Date(props.item.updatedAt) | dateFormat('DD/MM/YY')}}</td>
        </tr>
      </template>
    </v-data-table>
    <v-dialog v-model="filterDialog" max-width="490">
      <v-card>
        <v-card-text class="pt-5">
          <v-row dense>
            <v-col cols="6">
              <v-autocomplete
                  v-model="filters.donor_mare"
                  outlined
                  label="Filter op merrie"
                  :items="mares"
                  :item-text="horseName"
                  return-object
                  item-value="_id"
                  multiple
                  hide-details
              />
            </v-col>
            <v-col cols="6">
              <v-autocomplete
                  v-model="filters.donor_stallion"
                  outlined
                  label="Filter op hengst"
                  :items="stallions"
                  :item-text="horseName"
                  return-object
                  item-value="_id"
                  multiple
                  hide-details
              />
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="6">
              <v-autocomplete
                  v-model="filters.owner"
                  outlined
                  label="Filter op eigenaar"
                  :items="owners"
                  :item-text="ownerName"
                  return-object
                  item-value="_id"
                  multiple
                  hide-details
              />
            </v-col>
            <v-col cols="3">
              <v-autocomplete
                  v-model="filters.location.container"
                  outlined
                  label="Container"
                  :items="nitrogenContainers"
                  :item-text="horseName"
                  return-object
                  item-value="_id"
                  hide-details
              />
            </v-col>
            <v-col cols="3" v-if="filters.location.container">
              <v-autocomplete
                  v-model="filters.location.tube"
                  outlined
                  label="Koker"
                  :items="tubesAvailable(filters.location.container)"
                  return-object
                  item-value="_id"
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
    <v-alert type="error" v-if="errored">
      {{ errorMessage }}
    </v-alert>
  </v-card>
</template>
<script>
  import { ownerName } from '../../Helpers';
  import { customerAPI, horseAPI, icsiAPI, nitrogenContainerAPI } from '../../services';

  export default {
    props: ['title', 'headers', 'filters', 'sortBy'],
    data() {
      return {
        sortDesc: true,
        filterDialog: false,
        columnDialog: false,
        totalICSIs: 0,
        icsis: [],
        mares: [],
        stallions: [],
        owners: [],
        nitrogenContainers: [],
        tubes: [],
        loading: true,
        options: {},
        errored: false,
        errorMessage: '',
      };
    },
    watch: {
      options: {
        handler() {
          this.getICSIs();
        },
        deep:true
      },
      filters: {
        handler() {
          this.getICSIs();
        },
        deep: true
      }
    },
    mounted() {
      this.getICSIs();
    },
    computed: {
      filteredHeaders() {
        return this.headers.filter(header => header.selected);
      },
      filteredICSIs() {
        return this.icsis.map(icsi => {
          let filtered = { ...icsi };
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
          donor_stallion: this.filters.donor_stallion !== null ? this.filters.donor_stallion.map(el => el._id) : undefined,
          donor_mare: this.filters.donor_mare !== null ? this.filters.donor_mare.map(el => el._id) : undefined,
          owner: this.filters.owner !== null ? this.filters.owner.map(el => el._id) : undefined,
          container: this.filters.location.container !== null ? this.filters.location.container._id : undefined,
          tube: this.filters.location.tube !== null ? this.filters.location.tube.value : undefined,
        };
      }
    },
    methods: {
      ownerName,
      openICSIPage(id) {
        this.$router.push('/icsi/' + id);
      },
      mouseOver(hoverState) {
        hoverState ? document.body.style.cursor = 'pointer' : document.body.style.cursor = 'default';
      },
      openFilterDialog() {
        document.body.style.cursor = 'default';
        this.filterDialog = true;
        this.getMares();
        this.getStallions();
        this.getOwners();
        this.getNitrogenContainers();
      },
      showColumn(col) {
        return this.headers.find(header => header.value === col).selected;
      },
      horseName(horse) {
        return horse.name;
      },
      async getICSIs() {
        this.loading = true;
        try {
          const response = await icsiAPI.getAllICSI(this.URLParameters);
          this.icsis = response.data.icsis;
          this.totalICSIs = response.data.total;
        } catch (e) {
          this.errored = true;
          console.log('Arne: e= ', e);
          // this.errorMessage = e.response.data.message;
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
      tubesAvailable(container) {
        if (container) {
          let tubesAvailable = [{text: 'All', value: undefined}];
          for (let i = 1; i <= container.available_places; i++) {
            tubesAvailable.push({
              text: `koker ${ i }`,
              value: i
            });
          }
          return tubesAvailable;
        }
      },
      async getNitrogenContainers() {
        try {
          const { data } = await nitrogenContainerAPI.getNitrogenContainers();
          this.nitrogenContainers = [{name: 'All', value: undefined}, ...data];
        } catch (err) {
          this.errored = true;
          this.errorMessage = err.response.data.message;
        }
      },
      async getOwners() {
        try {
          const { data } = await customerAPI.getCustomers();
          this.owners = data;
        } catch (e) {
          this.errored = true;
          this.errorMessage = e.response.data.message;
        }
      },
    },
  };
</script>
