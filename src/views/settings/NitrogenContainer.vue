<template>
  <v-card class="ma-5" outlined>
    <v-toolbar flat>
      <v-toolbar-title>Locaties</v-toolbar-title>
    </v-toolbar>
    <v-data-table
        :headers="headers"
        :items="containers"
        :loading="loading"
        loading-text="Bezig met laden..."
        sort-by="name">
      <template v-slot:item="props">
        <tr>
          <td>{{ props.item.name }}</td>
          <td>{{ props.item.available_places }}</td>
          <td class="text-right d-print-none">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon dark color="primary" class="mr-2" @click="editContainer(props.item)" v-on="on">
                  mdi-pencil
                </v-icon>
              </template>
              <span>Container bewerken</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon dark color="primary" @click="deleteContainer(props.item)" v-on="on">
                  mdi-delete
                </v-icon>
              </template>
              <span>Container verwijderen</span>
            </v-tooltip>
          </td>
        </tr>
      </template>
      <template v-slot:no-data>
        Geen containers in de database
      </template>
    </v-data-table>
    <v-dialog v-model="dialog" max-width="500px">
      <template v-slot:activator="{ on }">
        <v-btn color="primary" fixed bottom right depressed dark class="ma-2" v-on="on">
          Vat toevoegen
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
                <v-col cols="12" sm="12" md="12">
                  <v-text-field
                      v-model="editedItem.name"
                      :rules="required"
                      label="Naam vat"
                      outlined
                  />
                  <v-text-field
                      v-model="editedItem.available_places"
                      :rules="required"
                      type="number"
                      label="Aantal kokers"
                      outlined
                  />
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="error" text @click="close">Annuleer</v-btn>
          <v-btn color="success" :disabled="!valid" text @click="save">Opslaan</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-alert type="error" v-if="errored" class="mx-5">
      {{ errorMessage }}
    </v-alert>
  </v-card>
</template>
<script>
import nitrogenContainerAPI from "@/services/NitrogenContainerAPI.js";

export default {
  data() {
    return {
      search: '',
      dialog: false,
      loading: null,
      valid: false,
      errored: false,
      errorMessage: '',
      required: [
        v => !!v || 'Dit veld is verplicht'
      ],
      headers: [
        {text: 'Naam vat', align: 'left', sortable: false, value: 'name'},
        {text: 'Aantal kokers', align: 'left', sortable: false, value: 'available_places'},
        {text: 'Bewerken', align: 'right', value: 'action', sortable: false},
      ],
      stables: ['Stal Zoutleeuw', 'Stal Dormaal', 'Wei'],
      containers: [],
      totalContainers: 0,
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
    formTitle() {
      return this.editedIndex === -1 ? 'Nieuwe container' : 'Container bewerken'
    },
    URLParameters() {
      return {
        'page': this.options.page,
        'limit': this.options.itemsPerPage,
        'sortBy': this.options.sortBy,
        'sortDesc': this.options.sortDesc,
      };
    }
  },
  mounted() {
    this.getContainers();
  },
  watch: {
    dialog(val) {
      val || this.close()
    },
  },
  methods: {
    async getContainers() {
      this.loading = true;
      try {
        const {data} = await nitrogenContainerAPI.getNitrogenContainers();
        this.containers = data;
        this.totalContainers;
      } catch (err) {
        this.errored = true;
        this.errorMessage = err.response.data.message;
      } finally {
        this.loading = false;
      }
    },
    editContainer(item) {
      this.editedIndex = this.containers.indexOf(item)
      this.editedItem = item
      this.dialog = true
    },
    async deleteContainer(item) {
      try {
        this.loading = true;
        this.errored = false;
        const response = await nitrogenContainerAPI.deleteNitrogenContainer(item._id);
        if (response) {
          const index = this.containers.indexOf(item)
          this.containers.splice(index, 1)
        }
      } catch (err) {
        this.errored = true;
        this.errorMessage = err.response.data.message;
      } finally {
        this.loading = false;
      }
    },
    close() {
      this.$refs.form.reset();
      this.dialog = false;
      this.editedItem = this.defaultItem;
      this.editedIndex = -1;
    },
    async save() {
      try {
        this.loading = true;
        this.errored = false;
        if (this.editedIndex > -1) {
          const {data} = await nitrogenContainerAPI.putNitrogenContainer(this.editedItem);
          if (data) {
            Object.assign(this.containers[this.editedIndex], data)
            await this.getContainers()
          }
        } else {
          await nitrogenContainerAPI.postNitrogenContainer(this.editedItem);
          await this.getContainers();
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
