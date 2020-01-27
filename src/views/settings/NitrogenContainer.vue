<template>
  <v-card class="ma-5" outlined>
    <v-data-table :headers="headers" :items="containers" :loading="loading" loading-text="Bezig met laden..." :sort-by="['name']">
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on }">
                <v-btn color="primary" dark class="mb-2" v-on="on">Container toevoegen</v-btn>
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
                          <v-text-field v-model="editedItem.name" :rules="required" label="Naam container*" outlined></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                          <v-text-field v-model="editedItem.available_places" :rules="required" type="number" label="Aantal plaatsen*" outlined></v-text-field>
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
            Geen containers in de database
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
import nitrogenContainerAPI from "@/services/NitrogenContainerAPI.js";
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
        { text: 'Naam container', align: 'left', sortable: false, value: 'name' },
        { text: '# Plaatsen', align: 'left', sortable: false, value: 'available_places' },
        { text: 'Bewerken', align: 'right', value: 'action', sortable: false },
      ],
      stables: ['Stal Zoutleeuw','Stal Dormaal','Wei'],
      containers: [],
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
      return this.editedIndex === -1 ? 'Nieuwe container' : 'Container bewerken'
    },
  },
  mounted() {
    this.getContainers();
  },
  watch: {
    dialog (val) {
      val || this.close()
    },
  },
  methods: {
    async getContainers() {
      this.loading = true;
      try {
        const response = await nitrogenContainerAPI.getNitrogenContainers();
        this.containers = response.data;
      } catch (e) {
        this.errored = true;
        this.errorMessage = e.response.data.message;
      } finally {
        this.loading = false;
      }
    },
    editItem (item) {
      this.editedIndex = this.containers.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    async deleteItem (item) {
      try {
        this.loading = true;
        this.errored = false;
        const response = await nitrogenContainerAPI.deleteNitrogenContainer(item._id);
        if (response) {
          const index = this.containers.indexOf(item)
          this.containers.splice(index, 1)
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
          const response = await nitrogenContainerAPI.putNitrogenContainer(this.editedItem);
          if (response) {
            Object.assign(this.containers[this.editedIndex], response.data)
          }
        } else {
          const response = await nitrogenContainerAPI.postNitrogenContainer(this.editedItem);
          if (response) {
            this.containers.push(response.data);
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
