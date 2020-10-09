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
                  outlined
                  label="Filter op type"
                  :items="types"
                  multiple
                  hide-details
              />
            </v-col>
            <v-col v-if="toFilter.includes('modTypes')" :cols="checkAmountFilters">
              <v-autocomplete
                  v-model="filters.type"
                  outlined
                  label="Filter op modificatie"
                  :items="modsTypes"
                  multiple
                  hide-details
              />
            </v-col>
            <v-col v-if="toFilter.includes('tax')" :cols="checkAmountFilters">
              <v-autocomplete
                  v-model="filters.tax"
                  outlined
                  label="Filter op BTW"
                  :items="taxes"
                  item-value="tax"
                  multiple
                  hide-details
              />
            </v-col>
            <v-col v-if="toFilter.includes('searchHorse')" :cols="checkAmountFilters">
              <SearchHorse @emit-horse="assignHorse" />
            </v-col>
            <v-col v-if="toFilter.includes('remaining')" :cols="checkAmountFilters">
              <v-autocomplete
                  v-model="filters.remaining"
                  outlined
                  label="Filter op remaining"
                  :items="remaining"
                  hide-details
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
                  return-object
                  hide-details
                  outlined
                  multiple
              />
            </v-col>
            <v-col v-if="toFilter.includes('nitrogen')" cols="3">
              <v-autocomplete
                  v-model="filters.location.container"
                  label="Container"
                  :items="nitrogenContainers"
                  :item-text="horseName"
                  item-value="_id"
                  return-object
                  hide-details
                  outlined
              />
            </v-col>
            <v-col v-if="toFilter.includes('nitrogen') && filters.location.container" cols="3">
              <v-autocomplete
                  v-model="filters.location.tube"
                  label="Koker"
                  :items="tubesAvailable(filters.location.container)"
                  item-value="_id"
                  return-object
                  hide-details
                  outlined
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn v-if="toFilter.includes('horse')" color="grey darken-1" text @click="assignHorse(undefined)">Clear</v-btn>
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
import {configAPI, customerAPI, horseAPI, nitrogenContainerAPI} from "@/services";
import SearchHorse from "@/components/SearchHorse"

export default {
  name: "FilterButton",
  components: {
    SearchHorse
  },
  props: [
      'filters',
      'columns',
      'headers',
      'products',
      'toFilter',
      'horses',
      'suppliers'
  ],
  mounted() {
    this.emitFiltered();
  },
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
      currentHorse: undefined
    };
  },
  watch: {
    filteredProducts: {
      handler() {
        this.emitFiltered();
      },
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
    },
    assignHorse(id) {
      this.currentHorse = id;
      this.filterDialog = false;
      this.$emit('emit-horse-parent', this.currentHorse);
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
      } catch (e) {
        console.log('Arne: e= ', e);
        this.errored = true;
        this.errorMessage = e.response.data.message;
      }
    },
    async getStallions() {
      try {
        const response = await horseAPI.getHorses({type: 'hengst'});
        this.stallions = response.data.horses;
      } catch (e) {
        this.errored = true;
        this.errorMessage = e.response.data.message;
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
    async getNitrogenContainers() {
      try {
        const { data } = await nitrogenContainerAPI.getNitrogenContainers();
        this.nitrogenContainers = [{name: 'All', value: undefined}, ...data];
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