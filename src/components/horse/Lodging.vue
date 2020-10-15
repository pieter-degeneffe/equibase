<template>
  <div>
    <v-toolbar flat color="white">
      <v-spacer/>
      <v-btn color="primary" dark  @click="createDialog = true" class="d-print-none">Verblijf toevoegen</v-btn>
    </v-toolbar>
    <v-data-table
        :headers="headers"
        sort-by="arrival"
        :items="horse.lodgings"
        :loading="loading"
        loading-text="Bezig met laden..."
        class="ma-5"
    >
      <template v-slot:no-data>
          Geen verblijven voor deze hengst gevonden
      </template>
      <template v-slot:item="props">
        <tr>
          <td><b>{{ horse.name }}</b></td>
          <td>{{ formatDate(props.item.arrival) }}</td>
          <td>{{ formatDate(props.item.departure) }}</td>
          <td>{{ ( new Date(props.item.departure) - new Date(props.item.arrival) ) / (1000 * 3600 * 24)}} dagen</td>
          <td class="text-right">
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
              <v-date-picker
                  v-model="selectedDates"
                  show-current="false"
                  locale="nl"
                  range
                  full-width
                  no-title
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
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
import { formatDate } from "@/Helpers";

export default {
  props: ['horse'],
  data() {
    return {
      loading: false,
      errored: false,
      errorMessage: '',
      selectedDates: [
          new Date().toISOString(),
          new Date().toISOString()
      ],
      headers: [
        { text: 'Hengst', align: 'left', sortable: false},
        { text: 'Datum aankomst', sortable: false},
        { text: 'Datum vertrek', sortable: false},
        { text: 'Duur verblijf', sortable: false},
        { text: 'Bewerken', align: 'right', value: 'action', sortable: false, class: "d-print-none"}
      ],
      createDialog: false
    };
  },
  methods: {
    formatDate,
    async createLoding() {
      this.errored = false;
      const formattedDates = this.selectedDates.sort().map(date => new Date(date));
      this.horse.lodgings.push({arrival: formattedDates[0], departure: formattedDates[1]})
      this.selectedDates = [];
      this.createDialog = false;
      try {
        console.log('lodgings:',this.horse);
        await horseAPI.postLodging(this.horse);
      } catch (err) {
        this.errored = true;
        this.errorMessage = err.response.data.message;
      }
    },
    async deleteLodging(lodgingToDelete) {
      try {
        await horseAPI.deleteLodging(this.horse, lodgingToDelete);
        this.horse.lodgings = this.horse.lodgings.filter(lodging => lodging._id !== lodgingToDelete._id)
      } catch (err) {
        this.errored = true;
        this.errorMessage = err.response.data.message;
      }
    }
  },
}
</script>
