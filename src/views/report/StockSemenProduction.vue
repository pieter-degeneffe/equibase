<template>
  <v-card class="ma-5" outlined>
    <v-data-table :items="filteredSemenCollections()" item-key="name" :headers="headers" :items-per-page="10" :loading="loading" loading-text="Bezig met laden..." class="ma-5">
      <template v-slot:top>
        <v-row dense>
          <v-col cols="8" sm="6">
            <v-toolbar-title class="float-left">Rapport sperma dekhengsten  - type productie</v-toolbar-title>
          </v-col>
          <v-col cols="4" sm="6">
            <div fixed right>
              <div class="float-right">
                <v-btn color="primary" dark @click="filterDialog = true;" class="mr-2 d-print-none"><v-icon left>mdi-filter</v-icon>Filters</v-btn>
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
          <!-- <td>{{ props.item.initial_inventory }}</td> -->
          <td>{{ calculateStartStock(props.item) }}</td>
          <!-- <td>{{ props.item.current_inventory }} {{ calculateEndStock(props.item) }}</td> -->
          <td>{{ props.item.current_inventory }}</td>
          <td><span v-if="props.item.production_date">{{ new Date(props.item.production_date) | dateFormat('DD/MM/YY')}}</span></td>
          <td>{{ props.item.type }}</td>
        </tr>
        <template v-if="showModifications">
          <tr v-for="modification in filteredModifications(props.item.modifications)" v-bind:key="modification._id">
            <td style="border-bottom: 1px dotted #E0E0E0; height: 24px" class="pl-8">Stockwijziging</td>
            <td style="border-bottom: 1px dotted #E0E0E0; height: 24px">&nbsp;</td>
            <td style="border-bottom: 1px dotted #E0E0E0; height: 24px">{{ modification.amount}}</td>
            <td style="border-bottom: 1px dotted #E0E0E0; height: 24px">{{ new Date(modification.createdAt) | dateFormat('DD/MM/YY')}}</td>
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
              <v-switch v-model="showModifications" label="Toon stockwijzigingen"></v-switch>
            </v-col>
            <!-- <v-col cols="12">
              <v-select v-model="filters.type.value" outlined label="Filter op type lot" :items="filters.type.options" hide-details></v-select>
            </v-col> -->
            <v-col cols="12" class="mb-5">
              <v-select clearable v-model="filters.modificationType.value" outlined label="Filter op type stockwijzigingen" :items="filters.modificationType.options" hide-details></v-select>
            </v-col>
            <v-col cols="12">
              <h3 class="mb-2 text-center">Filter beschikbare stock in bepaalde periode</h3>
              <v-date-picker v-model="filters.dates.value" @change="formatDate(filters.dates.value[0], filters.dates.value[1])" show-current="false" locale="nl" range full-width no-title></v-date-picker>
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
    calculateStartStock(semenCollection) {
      if(this.filters.dates.filteredValue) {
        //const createdAfter = new Date(this.filters.year[0] + "-01").toISOString();
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
    formatDate(...dates) {
      this.filters.dates.filteredValue = dates.sort().map(date => new Date(date).toISOString());
    }
  },
  computed: {
    URLParameters () {
      const URLParameters = {};
      //const formatDate = (...dates) => dates.sort().map(date => new Date(date).toISOString())

      // const formatDate = (date, startofMonth = true) => {
      //   //console.log(startofMonth)
      //   const year = parseInt(date.substr(0,4));
      //   const month = parseInt(date.substr(5,6));
      //   //return the first or the last day of the requested month
      //   // console.log(new Date(year, month -1, 1).toUTCString())
      //   //console.log(new Date(2020, 1, 1).toISOString());
      //   return startofMonth ? new Date(year, month -1).toISOString() : new Date(year, month, 0).toISOString()
      //   //return new Date(year, month, 0).toISOString() //Get the last day of the chosen month
      // }
      // const year = (date) => parseInt(date.substr(0,4));
      // const month = (date) => parseInt(date.substr(5,6));
      // const day = (date) =>
      //if(this.filters.dates[1]) console.log(formatDate(this.filters.dates[1]))
      //if(this.filters.dates[1]) console.log(new Date(this.filters.dates[1].substr(0,4), this.filters.dates[1].substr(5,6), 0).toISOString())
      //if(this.filters.dates[1]) console.log(this.filters.dates[1].substr(5,6))
      //if(this.filters.dates[1]) console.log(this.filters.dates[1].substr(0,4))
      //if(this.filters.dates[1]) console.log(new Date(this.filters.dates[1].substr(5,6), this.filters.dates[1].substr(0,4)).getDate())

      // .getDate())
      //if(this.filters.dates[0] && this.filters.dates[1]) URLParameters.dates = this.formatDate(this.filters.dates[0], this.filters.dates[1])
      //if(this.filters.dates[0]) URLParameters.createdAfter = formatDate(this.filters.dates[0], true);
      //if(this.filters.dates[1]) URLParameters.createdBefore = formatDate(this.filters.dates[1], false);
      //if(this.filters.year.value) URLParameters.createdBefore = new Date(this.filters.year.value+"-12-31").toISOString();
      // if(this.filters.year.value) URLParameters.createdAfter = new Date(this.filters.year.value+"-01-01").toISOString();
      //URLParameters.current_inventory
      URLParameters.type = "Productie"
      if (this.filters.dates.filteredValue) URLParameters.dates = this.filters.dates.filteredValue;
      //if (this.filters.type.value) URLParameters.type = this.filters.type.value;
      if (this.filters.modificationType.value) URLParameters.modificationType = this.filters.modificationType.value;
      return (URLParameters)
    }
  }
};
</script>
