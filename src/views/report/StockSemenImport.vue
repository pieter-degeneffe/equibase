<template>
  <v-card class="mx-5 mt-5 mb-12" outlined>
    <v-toolbar flat>
      <v-toolbar-title>Rapport sperma dekhengsten - type import</v-toolbar-title>
      <v-spacer/>
      <v-btn color="primary" dark @click="filterDialog = true" class="mr-2 d-print-none"><v-icon left>mdi-filter</v-icon>Filters</v-btn>
    </v-toolbar>
    <v-data-table
        :items="filteredSemenCollections()"
        item-key="name"
        :headers="headers"
        :items-per-page="10"
        :loading="loading"
        loading-text="Bezig met laden..."
        class="ma-5"
    >
      <template v-slot:no-data>
          Geen paarden gevonden
      </template>
      <template v-slot:item="props">
        <tr @click="openHorsePage(props.item.stallion._id)" @mouseover="mouseOver(true)" @mouseleave="mouseOver(false)">
          <td><b>{{ props.item.stallion.name }}</b></td>
          <td>{{ calculateStartStock(props.item) }}</td>
          <td>{{ props.item.current_inventory }}</td>
          <td>{{ props.item.production_date ? formatDate(props.item.production_date) : '-'}}</td>
          <td>{{ props.item.type }}</td>
        </tr>
        <template v-if="showModifications">
          <tr v-for="modification in filteredModifications(props.item.modifications)" v-bind:key="modification._id">
            <td style="border-bottom: 1px dotted #E0E0E0; height: 24px" class="pl-8">Stockwijziging</td>
            <td style="border-bottom: 1px dotted #E0E0E0; height: 24px">&nbsp;</td>
            <td style="border-bottom: 1px dotted #E0E0E0; height: 24px">{{ modification.amount}}</td>
            <td style="border-bottom: 1px dotted #E0E0E0; height: 24px">{{ formatDate(modification.createdAt) }}</td>
            <td style="border-bottom: 1px dotted #E0E0E0; height: 24px">{{ modification.type }}</td>
          </tr>
        </template>
      </template>
    </v-data-table>
    <v-dialog v-model="filterDialog" max-width="490">
      <v-card>
        <v-card-text class="pt-5">
          <v-row dense>
            <v-col cols="12">
              <v-switch v-model="showModifications" label="Toon stockwijzigingen"/>
            </v-col>
            <v-col cols="12">
              <v-select
                  clearable
                  v-model="filters.modificationType.value"
                  outlined label="Filter op type stockwijzigingen"
                  :items="filters.modificationType.options" hide-details
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
  </v-card>
</template>
<script>
import semenAPI from "@/services/SemenAPI.js";
import { mouseOver, formatDate } from "@/Helpers";

export default {
  data() {
    return {
      semenCollections: [],
      filters: {
        type: {
          options: ['Productie','Import'],
          value: null
        },
        modificationType: {
          options: ['Export','Controle'],
          value: null
        },
        dates: {
          value: [null, null],
          filteredValue: null
        }
      },
      loading: true,
      headers: [
        { text: 'Hengst'},
        { text: 'Start stock'},
        { text: 'Eind stock'},
        { text: 'Productiedatum'},
        { text: 'Type'}
      ],
      filterDialog: false,
      showModifications: false
    };
  },
  watch: {
    filters: {
      handler() {
        this.getSemenCollections()
      },
      deep: true
    }
  },
  mounted() {
    this.getSemenCollections();
  },
  methods: {
    async getSemenCollections() {
      this.loading = true;
      try {
        const { data } = await semenAPI.getSemenCollection(this.URLParameters);
        this.semenCollections = data;
      } catch (err) {
        this.errored = true;
        this.errorMessage = err.response.data.message;
      } finally {
        this.loading = false;
      }
    },
    openHorsePage(id){
      this.$router.push("/horse/" + id);
    },
    mouseOver,
    formatDate,
    calculateStartStock(semenCollection) {
      if(this.filters.dates.filteredValue) {
        const filteredModifications = semenCollection.modifications.filter(modification => modification.createdAt <= this.filters.dates.filteredValue[0])
        const filteredModificationsAmount = filteredModifications.reduce((acc, modification) => acc + modification.amount, 0);
        return semenCollection.initial_inventory + filteredModificationsAmount
      }
      return semenCollection.initial_inventory
    },
    filteredModifications(modifications){
      return this.filters.dates.filteredValue ? modifications.filter(modification => modification.createdAt >= this.filters.dates.filteredValue[0] && modification.createdAt <= this.filters.dates.filteredValue[1]) : modifications
    },
    filteredSemenCollections() {
      return this.filters.modificationType.value ? this.semenCollections.filter(collection => collection.modifications.length > 0) : this.semenCollections
    },
  },
  computed: {
    URLParameters () {
      const URLParameters = {};
      URLParameters.type = "Import"
      if (this.filters.dates.filteredValue) URLParameters.dates = this.filters.dates.filteredValue;
      if (this.filters.modificationType.value) URLParameters.modificationType = this.filters.modificationType.value;
      return (URLParameters)
    }
  }
};
</script>
