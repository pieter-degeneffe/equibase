<template>
  <v-card
    class="ma-5"
    outlined
  >
    <v-toolbar
      flat
      color="blue-grey"
      dark
    >
      <v-toolbar-title>Hengsten</v-toolbar-title>
    </v-toolbar>
    <!-- <v-data-table
      :headers="headers"
      :items="horses"
      :items-per-page="2"
    ></v-data-table> -->
    <v-simple-table fixed-header>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Hengst</th>
            <th class="text-left">Stamboom</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="horse in horses" :key="horse._id" @click="openHorsePage(horse._id)">
            <td>{{ horse.name }}</td>
            <td>{{ horse.father }} x {{ horse.grandfather }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </v-card>
</template>
<script>
import horseAPI from "@/services/HorseAPI.js";
export default {
  data() {
    return {
      headers: [
        {
          text: 'Naam hengst', align: 'left', sortable: true, value: 'name'
        },
        { text: 'Vader', value: 'father' }
      ],
      errored: false,
      loading: true,
      horses: [],
    };
  },
  mounted() {
    this.loadHorses();
  },
  methods: {
    async loadHorses() {
      try {
        const response = await horseAPI.getHorses();
        this.horses = response.data;
      } catch (e) {
        this.errored = true;
      } finally {
        this.loading = false;
      }
    },
    openHorsePage(id) {
      this.$router.push("/horse/" + id);
    }
  }
};
</script>
