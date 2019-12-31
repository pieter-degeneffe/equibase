<template>
  <v-card class="ma-5" outlined>
    <v-select class="d-print-none mx-5 mt-5" v-model="stableFilter" outlined label="Filter locaties per stal" :items="stables"></v-select>
    <v-data-iterator class="mx-5" :items="locations" hide-default-footer :loading="loading" loading-text="Bezig met laden...">
      <template v-slot:no-data>
          Geen locaties in de database
      </template>
      <v-row>
        <v-col v-for="location in filteredLocations" :key="location._id" cols="12" sm="6" md="4" lg="3">
          <v-card>
            <v-card-title><h4>{{ location.stable }} - {{ location.name }}</h4></v-card-title>
            <v-divider></v-divider>
            <v-list-item v-for="horse in location.horses" :key="horse._id">
              <v-list-item-content>{{ horse.name }}</v-list-item-content>
            </v-list-item>
          </v-card>
        </v-col>
      </v-row>
    </v-data-iterator >
  </v-card>
</template>
<script>
import locationAPI from "@/services/LocationAPI.js";
export default {
  data() {
    return {
      dialog: false,
      loading: true,
      locations: [],
      stables: ['Alle','Stal Zoutleeuw','Stal Dormaal','Wei'],
      stableFilter: ''
    };
  },
  mounted() {
    this.loadLocations();
  },
  computed: {
    filteredLocations () {
      if (!this.stableFilter || this.stableFilter === 'Alle') return this.locations;
      return this.locations.filter((location) => {
        return location.stable=== this.stableFilter;
      })
    }
  },
  methods: {
    async loadLocations() {
      this.loading = true;
      try {
        const response = await locationAPI.getLocations();
        this.locations = response.data;
      } catch (e) {
        this.errored = true;
        this.errorMessage = e.response.data.message;
      } finally {
        this.loading = false;
      }
    },
  },
}
</script>
