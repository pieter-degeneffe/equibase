<template>
  <v-card class="ma-5" outlined>
    <v-data-iterator class="ml-3" :items="locations" hide-default-footer :loading="loading" loading-text="Bezig met laden...">
      <template v-slot:no-data>
          Geen locaties in de database
      </template>
      <v-row>
        <v-col v-for="location in locations" :key="location._id" cols="12" sm="6" md="4" lg="3">
          <v-card>
            <v-card-title><h4>{{ location.name }}</h4></v-card-title>
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
    };
  },
  mounted() {
    this.loadLocations();
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
