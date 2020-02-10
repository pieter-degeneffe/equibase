<template>
  <v-card class="ma-5" outlined>
    <v-data-table :items="semenCollections" item-key="name" :headers="headers" :items-per-page="10" :loading="loading" loading-text="Bezig met laden..." class="ma-5">
      <template v-slot:top>
        <v-row dense>
          <v-col cols="8" sm="6">
            <v-toolbar-title class="float-left">Rapport sperma dekhengsten</v-toolbar-title>
          </v-col>
          <v-col cols="4" sm="6">
            <div fixed right>
              <div class="float-right">
                <v-btn color="primary" dark @click="openFilterDialog" class="mr-2 d-print-none"><v-icon left>mdi-filter</v-icon>Filters</v-btn>
             </div>
           </div>
          </v-col>
        </v-row>
      </template>
      <template v-slot:no-data>
          Geen paarden gevonden
      </template>
      <template v-slot:item="props">
        <!-- {{ props.item }} -->
        <tr @click="openHorsePage(props.item.stallion._id)" @mouseover="mouseOver(true)" @mouseleave="mouseOver(false)">
          <td><b>{{ props.item.stallion.name }}</b></td>
          <td>{{ calculateStartStock(props.item) }}</td>
          <!-- <td>{{ props.item.current_inventory }} {{ calculateEndStock(props.item) }}</td> -->
          <td>{{ props.item.current_inventory }}</td>
          <td>{{ new Date(props.item.createdAt) | dateFormat('DD/MM/YY')}}</td>
          <td>{{ props.item.type }}</td>
        </tr>
        <template v-if="showModifications">
          <tr v-for="modification in filteredModifications(props.item.modifications)" v-bind:key="modification._id">
            <td style="border-bottom: 1px dotted #E0E0E0; height: 24px" class="pl-8">Stockwijziging</td>
            <td style="border-bottom: 1px dotted #E0E0E0; height: 24px">&nbsp;</td>
            <td style="border-bottom: 1px dotted #E0E0E0; height: 24px">{{ modification.amount}}</td>
            <td style="border-bottom: 1px dotted #E0E0E0; height: 24px">{{ new Date(modification.createdAt) | dateFormat('DD/MM/YY')}}</td>
            <td style="border-bottom: 1px dotted #E0E0E0; height: 24px">{{ modification.type }}</td>
            <td style="border-bottom: 1px dotted #E0E0E0; height: 24px">&nbsp;</td>
          </tr>
        </template>
      </template>
    </v-data-table>
    <v-dialog v-model="filterDialog" max-width="490">
      <v-card>
        <v-card-text class="pt-5">
          <v-row dense>
            <v-col cols="12">
              <v-select v-model="filters.year.value" outlined label="Filter op jaar" :items="filters.year.options" hide-details></v-select>
            </v-col>
            <v-col cols="12">
              <v-select v-model="filters.type.value" outlined label="Filter op type lot" :items="filters.type.options" hide-details></v-select>
            </v-col>
            <v-col cols="12">
              <v-switch v-model="showModifications" label="Toon stockwijzigingen"></v-switch>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="filterDialog = false">Sluiten</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>
<script>
import semenAPI from "@/services/SemenAPI.js";
export default {
  data() {
    return {
      semenCollections: [],
      filters: {
        type: {
          options: ['Productie','Import'],
          value: null
        },
        year: {
          options: [2020, 2019, 2018, 2017, 2016, 2015],
          value: null,
        }
      },
      loading: true,
      headers: [
        { text: 'Hengst'},
        { text: 'Start stock'},
        { text: 'Eind stock'},
        { text: 'Datum'},
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
        const response = await semenAPI.getSemenCollection(this.URLParameters);
        this.semenCollections = response.data;
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
    mouseOver(hoverState) {
      hoverState ? document.body.style.cursor = "pointer" : document.body.style.cursor = "default";
    },
    openFilterDialog() {
      this.filterDialog = true;
    },
    calculateStartStock(semenCollection) {
      if(this.filters.year.value) {
        const createdAfter = new Date(this.filters.year.value+"-01-01").toISOString();
        const filteredModifications = semenCollection.modifications.filter(modification => modification.createdAt <= createdAfter)
        const filteredModificationsAmount = filteredModifications.reduce((acc, modification) => acc + modification.amount, 0);
        return semenCollection.initial_inventory + filteredModificationsAmount
      }
      return semenCollection.initial_inventory
    },
    filteredModifications(modifications){
      if(this.filters.year.value) {
        const createdAfter = new Date(this.filters.year.value+"-01-01").toISOString();
        const createdBefore = new Date(this.filters.year.value+"-12-31").toISOString();
        const filteredModifications = modifications.filter(modification => modification.createdAt >= createdAfter && modification.createdAt <= createdBefore)
        return filteredModifications;
      }
      return modifications
    }
  },
  computed: {
    URLParameters () {
      const URLParameters = {};
      if(this.filters.year.value) URLParameters.createdBefore = new Date(this.filters.year.value+"-12-31").toISOString();
      if(this.filters.year.value) URLParameters.createdAfter = new Date(this.filters.year.value+"-01-01").toISOString();
      //URLParameters.current_inventory
      if (this.filters.type.value) URLParameters.type = this.filters.type.value;
      return (URLParameters)
    }
  }
};
</script>
