<template>
  <div>
    <v-data-table :headers="headers" sort-by="arrival" :items="horse.lodgings" :loading="loading" loading-text="Bezig met laden..." class="ma-5">
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-spacer></v-spacer>
          <v-btn color="primary" dark  @click="createDialog = true" class="d-print-none">Verblijf toevoegen</v-btn>
        </v-toolbar>
      </template>
      <template v-slot:no-data>
          Geen verblijven voor deze hengst gevonden
      </template>
      <template v-slot:item="props">
        <tr>
          <td><b>{{ horse.name }}</b></td>
          <td>{{ new Date(props.item.arrival) | dateFormat('DD/MM/YY')}}</td>
          <td>{{ new Date(props.item.departure) | dateFormat('DD/MM/YY')}}</td>
          <td>{{ ( new Date(props.item.departure) - new Date(props.item.arrival) ) / (1000 * 3600 * 24)}} dagen</td>
          <td>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon dark color="primary" @click="deleteLodging(props.item)" v-on="on">mdi-delete</v-icon>
              </template>
              <span>Verblijf verwijderen</span>
            </v-tooltip>
          </td>
        </tr>
      </template>
    </v-data-table>
    <v-dialog v-model="createDialog" persistent max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Nieuw verblijf toevoegen</span>
        </v-card-title>
        <v-card-text class="pt-5">
          <v-row dense>
            <v-col cols="12">
              <v-date-picker v-model="selectedDates" show-current="false" locale="nl" range full-width no-title></v-date-picker>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="createDialog = false">Annuleren</v-btn>
          <v-btn color="blue darken-1" v-if="selectedDates.length === 2" text @click="createLoding">Opslaan</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-alert type="error" v-if="errored" >
      {{ errorMessage }}
    </v-alert>
  </div>
</template>
<script>
import horseAPI from "@/services/HorseAPI.js";
export default {
  props: ['horse'],
  data() {
    return {
      loading: false,
      errored: false,
      errorMessage: '',
      selectedDates: [],
      headers: [
        { text: 'Hengst', align: 'left', sortable: false},
        { text: 'Datum aankomst', sortable: false},
        { text: 'Datum vertrek', sortable: false},
        { text: 'Duur verblijf', sortable: false},
        { text: '', align: 'right', value: 'action', sortable: false, class: "d-print-none"}
      ],
      createDialog: false
    };
  },
  methods: {
    async createLoding() {
      this.errored = false;
      const formattedDates = this.selectedDates.sort().map(date => new Date(date).toISOString());
      this.horse.lodgings.push({arrival: formattedDates[0], departure: formattedDates[1]})
      this.selectedDates = [];
      this.createDialog = false;
      try {
        await horseAPI.postLodging(this.horse);
      } catch (e) {
        this.errored = true;
        this.errorMessage = e.response.data.message;
      }
    },
    async deleteLodging(lodgingToDelete) {
      try {
        await horseAPI.deleteLodging(this.horse, lodgingToDelete);
        this.horse.lodgings = this.horse.lodgings.filter(lodging => lodging._id !== lodgingToDelete._id)
      } catch (e) {
        this.errored = true;
        this.errorMessage = e.response.data.message;
      }
    }
  },
}
</script>
