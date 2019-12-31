<template>
  <v-card class="ma-5" outlined>
    <v-data-table :headers="headers" :items="locations" :loading="loading" loading-text="Bezig met laden..." :sort-by="['stable', 'name']" multi-sort>
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on }">
                <v-btn color="primary" dark class="mb-2" v-on="on">Locatie toevoegen</v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-form ref="form" v-model="valid">
                      <v-row>
                        <v-col cols="12" sm="12" md="12">
                          <v-select v-model="editedItem.stable" :items="stables" label="Stal" outlined></v-select>
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                          <v-text-field v-model="editedItem.name" :rules="required" label="Naam locatie*" outlined></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                          <v-text-field v-model="editedItem.places" :rules="required" type="number" label="Aantal plaatsen*" outlined></v-text-field>
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">Annuleer</v-btn>
                  <v-btn color="blue darken-1" :disabled="!valid" text @click="save">Opslaan</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
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
      <v-row>
        <v-col cols="12">
          <v-alert type="error" v-if="errored" class="mx-5">
            {{ errorMessage }}
          </v-alert>
        </v-col>
      </v-row>
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
        { text: 'Stal', align: 'left', sortable: false, value: 'stable' },
        { text: 'Naam locatie', align: 'left', sortable: false, value: 'name' },
        { text: '# Plaatsen', align: 'left', sortable: false, value: 'places' },
        { text: '# Paarden', align: 'left', sortable: false, value: 'horses.length' },
        { text: 'Bewerken', align: 'right', value: 'action', sortable: false },
      ],
      stables: ['Stal Zoutleeuw','Stal Dormaal','Wei'],
      locations: [],
      editedIndex: -1,
      editedItem: {
        name: ''
      },
      defaultItem: {
        name: ''
      },
    };
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'Nieuwe locatie' : 'locatie bewerken'
    },
  },
  mounted() {
    this.loadLocations();
  },
  watch: {
    dialog (val) {
      val || this.close()
    },
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
    editItem (item) {
      this.editedIndex = this.locations.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    async deleteItem (item) {
      try {
        this.loading = true;
        this.errored = false;
        const respons = await locationAPI.deleteLocation(item._id);
        if (respons) {
          const index = this.locations.indexOf(item)
          this.locations.splice(index, 1)
        }
      } catch(e) {
        this.errored = true;
        this.errorMessage = e.response.data.message;
      } finally {
        this.loading = false;
      }
    },
    close () {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },
    async save() {
      try {
        this.loading = true;
        this.errored = false;
        if (this.editedIndex > -1) {
          const respons = await locationAPI.putLocation(this.editedItem);
          if (respons) {
            Object.assign(this.locations[this.editedIndex], respons.data)
          }
        } else {
          const respons = await locationAPI.postLocation(this.editedItem);
          if (respons) {
            this.locations.push(respons.data);
          }
        }
      } catch (e) {
        this.errored = true;
        this.errorMessage = e.response.data.message;
      } finally {
        this.close()
        this.loading = false;
        this.snackbar = true;
      }
    },
  },
}
</script>
