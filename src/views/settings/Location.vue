<template>
  <v-card class="mx-5 mt-5 mb-12" outlined>
    <v-toolbar flat>
      <v-toolbar-title>Locaties</v-toolbar-title>
    </v-toolbar>
    <v-data-table
        :headers="headers"
        :items="locations"
        :loading="loading"
        loading-text="Bezig met laden..."
        :server-items-length="totalLocations"
        :sort-by="sortBy"
        :sort-desc="sortDesc"
        :options.sync="options"
        class="ma-5"
    >
      <template v-slot:item.action="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon small @click="deleteItem(item)">
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:no-data>
        Geen locaties in de database
      </template>
    </v-data-table>
    <v-dialog v-model="dialog" max-width="500px">
      <template v-slot:activator="{ on }">
        <v-btn color="primary" fixed bottom right depressed dark class="ma-2" v-on="on">
          Locatie toevoegen
          <v-icon right>mdi-plus</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid">
              <v-row>
                <v-col cols="12">
                  <v-autocomplete
                      v-model="editedItem.stable"
                      :items="stables"
                      label="Stal"
                      clearable
                      outlined
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                      v-model="editedItem.name"
                      :rules="required"
                      label="Naam locatie*"
                      outlined
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                      v-model="editedItem.places"
                      :rules="required"
                      type="number"
                      label="Aantal plaatsen*"
                      outlined
                  />
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="blue darken-1" text @click="close">Annuleer</v-btn>
          <v-btn color="blue darken-1" :disabled="!valid" text @click="save">Opslaan</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-alert type="error" v-if="errored" class="mx-5">
      {{ errorMessage }}
    </v-alert>
  </v-card>
</template>
<script>
import locationAPI from "@/services/LocationAPI.js";

export default {
  data() {
    return {
      dialog: false,
      loading: null,
      valid: false,
      errored: false,
      errorMessage: '',
      required: [
        v => !!v || 'Dit veld is verplicht'
      ],
      headers: [
        {text: 'Stal', align: 'left', value: 'stable', sortable: true},
        {text: 'Naam locatie', align: 'left', value: 'name', sortable: true},
        {text: '# Plaatsen', align: 'left', value: 'places', sortable: true},
        {text: '# Paarden', align: 'left', value: 'horses.length', sortable: true},
        {text: 'Bewerken', align: 'right', value: 'action', sortable: false},
      ],
      stables: ['Stal Zoutleeuw', 'Stal Dormaal', 'Wei'],
      locations: [],
      totalLocations: 0,
      editedIndex: -1,
      options: {},
      filters: {},
      sortBy: 'stable',
      sortDesc: false,
      editedItem: {
        name: ''
      },
      defaultItem: {
        name: ''
      },
    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Nieuwe locatie' : 'locatie bewerken'
    },
    URLParameters() {
      return {
        'page': this.options.page,
        'limit': this.options.itemsPerPage,
        'sortBy': this.options.sortBy,
        'sortDesc': this.options.sortDesc,
        name: this.filters.name !== null ? this.filters.name : undefined,
        stable: this.filters.stable !== null ? this.filters.stable : undefined,
      };
    }
  },
  watch: {
    options: {
      handler() {
        this.getAllLocations();
      },
      deep: true
    },
    filters: {
      handler() {
        this.getAllLocations();
      },
      deep: true
    },
    dialog(val) {
      val || this.close()
    },
  },
  methods: {
    async getAllLocations() {
      this.loading = true;
      try {
        const { data: {locations, total} } = await locationAPI.getLocations(this.URLParameters);
        this.locations = locations;
        this.totalLocations = total;
      } catch (err) {
        this.errored = true;
        this.errorMessage = err.response.data.message;
      } finally {
        this.loading = false;
      }
    },
    editItem(item) {
      this.editedIndex = this.locations.indexOf(item)
      this.editedItem = item
      this.dialog = true
    },
    async deleteItem(item) {
      try {
        this.loading = true;
        this.errored = false;
        const response = await locationAPI.deleteLocation(item._id);
        if (response) {
          const index = this.locations.indexOf(item)
          this.locations.splice(index, 1)
        }
      } catch (err) {
        this.errored = true;
        this.errorMessage = err.response.data.message;
      } finally {
        this.loading = false;
      }
    },
    close() {
      this.dialog = false;
      this.editedIndex = -1;
      this.editedItem = this.defaultItem;
    },
    async save() {
      try {
        this.loading = true;
        this.errored = false;
        if (this.editedIndex > -1) {
          const response = await locationAPI.putLocation(this.editedItem);
          if (response) {
            Object.assign(this.locations[this.editedIndex], response.data)
          }
        } else {
          const response = await locationAPI.postLocation(this.editedItem);
          if (response) {
            this.locations.push(response.data);
          }
        }
      } catch (err) {
        this.errored = true;
        this.errorMessage = err.response.data.message;
      } finally {
        this.close()
        this.loading = false;
        this.snackbar = true;
      }
    },
  },
}
</script>
