<template>
  <div>
    <v-btn v-if="filters" color="primary" dark @click="filterDialog = true" class="ml-4 d-print-none">
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
            <v-col v-if="toFilter.includes('type')" cols="12">
              <v-autocomplete
                  v-model="filters.type"
                  outlined
                  label="Filter op type"
                  :items="types"
                  multiple
                  hide-details
              />
            </v-col>
            <v-col v-if="toFilter.includes('modTypes')" cols="12">
              <v-autocomplete
                  v-model="filters.type"
                  outlined
                  label="Filter op modificatie"
                  :items="modsTypes"
                  multiple
                  hide-details
              />
            </v-col>
            <v-col v-if="toFilter.includes('tax')" cols="12">
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
            <v-col v-if="toFilter.includes('horse')" cols="12">
              <v-autocomplete
                  v-model="filters.horse"
                  outlined
                  label="Filter op paard"
                  :items="horses"
                  item-text="name"
                  item-value="_id"
                  multiple
                  hide-details
              />
            </v-col>
            <v-col v-if="toFilter.includes('remaining')" cols="12">
              <v-autocomplete
                  v-model="filters.remaining"
                  outlined
                  label="Filter op remaining"
                  :items="remaining"
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
import {configAPI} from "@/services";

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
  mounted() {
    this.getConfig();
    this.getModsConfig();
    this.emitFiltered();
  },
  data() {
    return {
      filterDialog: false,
      columnDialog: false,
      types: [],
      taxes: [],
      modsTypes: [],
      remaining: ['All', 'In stock', 'Out of stock'],
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
    filteredHeaders() {
      return this.headers.filter(header => header.selected);
    },
  },
  methods: {
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
    }
  }
}
</script>

<style scoped>

</style>