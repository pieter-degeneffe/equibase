<template>
  <div>
    <v-btn v-if="filters" color="primary" dark @click="openFilterDialog" class="ml-4 d-print-none">
      <v-icon left>mdi-filter</v-icon>
      Filters
    </v-btn>
    <v-btn v-if="columns" color="primary" dark @click.stop="columnDialog = true" class="ml-4 d-print-none">
      <v-icon left>mdi-cog</v-icon>
      Kolommen
    </v-btn>
    <v-dialog v-if="filters" v-model="filterDialog" max-width="490">
      <v-card>
        <v-card-text class="pt-5">
          <v-row dense>
            <v-col v-if="toFilter.includes('type')" :cols="checkAmountFilters">
              <v-autocomplete
                  v-model="filters.type"
                  label="Filter op type"
                  :items="types"
                  hide-details
                  clearable
                  outlined
                  multiple
              />
            </v-col>
            <v-col v-if="toFilter.includes('modTypes')" :cols="checkAmountFilters">
              <v-autocomplete
                  v-model="filters.type"
                  label="Filter op modificatie"
                  :items="modsTypes"
                  hide-details
                  clearable
                  outlined
                  multiple
              />
            </v-col>
            <v-col v-if="toFilter.includes('horseType')" cols="12">
              <v-autocomplete
                  v-model="filters.type.value"
                  label="Filter op type paard"
                  :items="filters.type.options"
                  hide-details
                  clearable
                  outlined
              />
            </v-col>
            <v-col v-if="toFilter.includes('surrogate')" cols="12">
              <v-switch
                  v-model="filters.surrogate"
                  label="Toon enkel draagmoeders"
                  class="mb-O"
                  inset
              />
            </v-col>
            <v-col v-if="toFilter.includes('stud_horse')" cols="12">
              <v-switch
                  label="Toon enkel dekhengsten"
                  v-model="filters.stud_horse"
                  class="mb-O"
                  inset
              />
            </v-col>
            <v-col v-if="toFilter.includes('tax')" :cols="checkAmountFilters">
              <v-autocomplete
                  v-model="filters.tax"
                  label="Filter op BTW"
                  :items="taxes"
                  item-value="tax"
                  hide-details
                  clearable
                  outlined
                  multiple
              />
            </v-col>
            <v-col v-if="toFilter.includes('remaining')" :cols="checkAmountFilters">
              <v-autocomplete
                  v-model="filters.remaining"
                  label="Filter op remaining"
                  :items="remaining"
                  hide-details
                  outlined
              />
            </v-col>
            <v-col v-if="toFilter.includes('donor_mare')" cols="12">
              <v-autocomplete
                  v-model="filters.donor_mare"
                  label="Filter op merrie"
                  :items="mares"
                  :item-text="horseName"
                  item-value="_id"
                  return-object
                  hide-details
                  clearable
                  outlined
                  multiple
              />
            </v-col>
            <v-col v-if="toFilter.includes('donor_stallion')" cols="12">
              <v-autocomplete
                  v-model="filters.donor_stallion"
                  label="Filter op hengst"
                  :items="stallions"
                  :item-text="horseName"
                  item-value="_id"
                  return-object
                  hide-details
                  clearable
                  outlined
                  multiple
              />
            </v-col>
            <v-col v-if="toFilter.includes('owner')" cols="6">
              <v-autocomplete
                  v-model="filters.owner"
                  label="Filter op eigenaar"
                  :items="owners"
                  :item-text="ownerName"
                  item-value="_id"
                  hide-details
                  clearable
                  outlined
                  multiple
              />
            </v-col>
            <v-col v-if="toFilter.includes('nitrogen')" cols="6">
              <v-autocomplete
                  v-model="filters.location.container"
                  label="Container"
                  :items="nitrogenContainers"
                  :item-text="horseName"
                  item-value="_id"
                  return-object
                  hide-details
                  clearable
                  outlined
              />
            </v-col>
            <v-col v-if="toFilter.includes('nitrogen') && filters.location.container" cols="6">
              <v-autocomplete
                  v-model="filters.location.tube"
                  label="Koker"
                  :items="tubesAvailable(filters.location.container)"
                  item-value="_id"
                  return-object
                  hide-details
                  clearable
                  outlined
              />
            </v-col>
            <v-col v-if="toFilter.includes('location')" cols="6">
              <v-select
                  v-model="filters.location"
                  label="Filter op locatie"
                  :items="locations"
                  :item-text="item => item.stable +' - '+ item.name"
                  item-value="_id"
                  hide-details
                  clearable
                  outlined
                  multiple
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
    <v-dialog v-if="columns" v-model="columnDialog" max-width="690">
      <v-card>
        <v-card-text>
          <v-list>
            <v-row dense>
              <v-col cols="12" sm="6" md="4" v-for="header in headers" :key="header.text">
                <v-list-item>
                  <v-checkbox
                      :label="header.text"
                      v-model="header.selected"
                      :value="header.selected"
                      @change="emitFiltered"
                  />
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
  </div>
</template>

<script>
import { ownerName } from '@/Helpers';
import {configAPI, customerAPI, horseAPI, locationAPI, nitrogenContainerAPI} from "@/services";

export default {
  name: "FilterButton",
  props: [
      'filters',
      'columns',
      'headers',
      'products',
      'toFilter',
      'horses',
      'suppliers'
  ],
  data() {
    return {
      filterDialog: false,
      columnDialog: false,
      types: [],
      taxes: [],
      mares: [],
      stallions: [],
      owners: [],
      nitrogenContainers: [],
      tubes: [],
      modsTypes: [],
      remaining: ['All', 'In stock', 'Out of stock'],
      locations: [],
      currentHorse: undefined
    };
  },
  watch: {
    filteredProducts: {
      handler() {
        this.emitFiltered();
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    checkAmountFilters() {
      return this.toFilter.length > 1 ? 6 : 12;
    },
    filteredHeaders() {
      return this.headers.filter(header => header.selected);
    },
  },
  methods: {
    openFilterDialog(){
      this.filterDialog = true;
      this.toFilter.includes('tax' || 'type') ? this.getConfig() : '';
      this.toFilter.includes('modTypes') ? this.getModsConfig() : '';
      this.toFilter.includes('donor_mare') ? this.getMares() : '';
      this.toFilter.includes('donor_stallion') ? this.getStallions() : '';
      this.toFilter.includes('owner') ? this.getOwners() : '';
      this.toFilter.includes('nitrogen') ? this.getNitrogenContainers() : '';
      this.toFilter.includes('location') ? this.getLocations() : '';
    },
    horseName(horse) {
      return horse.name;
    },
    ownerName,
    emitFiltered() {
      this.$emit('emit-headers', this.filteredHeaders);
    },
    async getModsConfig() {
      this.errored = false;
      try {
        const {data: {types}} = await configAPI.getModConfig();
        this.modsTypes = types;
      } catch (err) {
        this.errored = true;
        this.errorMessage = err.response.data.message;
      }
    },
    async getConfig() {
      this.errored = false;
      try {
        const {data: {types, tax}} = await configAPI.getProductConfig();
        this.types = types;
        this.taxes = tax;
      } catch (err) {
        this.errored = true;
        this.errorMessage = err.response.data.message;
      }
    },
    async getMares() {
      try {
        const response = await horseAPI.getHorses({type: 'merrie'});
        this.mares = response.data.horses;
      } catch (err) {
        this.errored = true;
        this.errorMessage = err.response.data.message;
      }
    },
    async getStallions() {
      try {
        const response = await horseAPI.getHorses({type: 'hengst'});
        this.stallions = response.data.horses;
      } catch (err) {
        this.errored = true;
        this.errorMessage = err.response.data.message;
      }
    },
    async getOwners() {
      try {
        const { data: { customers } } = await customerAPI.getCustomers();
        this.owners = customers;
      } catch (err) {
        this.errored = true;
        this.errorMessage = err.response.data.message;
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
    async getLocations() {
      try {
        const { data } = await locationAPI.getLocations();
        this.locations = data;
      } catch (err) {
        this.errored = true;
        this.errorMessage = err.response.data.message;
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
  }
}
</script>

<style scoped>

</style>
