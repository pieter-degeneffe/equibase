<template>
  <div>
    <v-data-table :headers="headers" :items="semenCollections" :loading="loading" loading-text="Bezig met laden..." class="ma-5">
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn color="primary" dark class="mb-2" v-on="on">Lot toevoegen</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">Gegevens lot sperma test </span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-form ref="form" v-model="valid">
                    <v-row>
                      <v-col cols="12" sm="12" md="12" dense>
                        <v-text-field v-model="horse.name" label="Hengst" outlined disabled></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="12" dense>
                        <select-owner :owner="owner" @update-owner="updateOwner"></select-owner>
                      </v-col>
                      <v-col cols="12" md="12">
                        <v-select v-model="editedItem.type" :items="semenCollectionType" label="Type sperma lot" outlined></v-select>
                      </v-col>
                      <p>test</p>
                      <!-- <v-col cols="12" sm="12" md="12">
                        <v-text-field v-model="editedItem.available_places" :rules="required" type="number" label="Aantal plaatsen*" outlined></v-text-field>
                      </v-col> -->
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

      <template v-slot:no-data>
          Geen sperma loten gevonden
      </template>
      <template v-slot:item="props">
        <tr>
          <td>{{ props.item.stallion.name }}</td>
          <td>{{ ownerName(props.item.owner) }}</td>
          <td>{{ props.item.initial_inventory }}</td>
          <td>{{ props.item.current_inventory }}</td>
          <td>{{ new Date(props.item.production_date) | dateFormat('DD/MM/YY')}}</td>
          <td>{{ props.item.location.container.name }} - koker {{ props.item.location.tube }} - {{ props.item.location.position }}</td>
        </tr>
      </template>
    </v-data-table>
    {{ horse }}
    <br/><br/>
    {{ semenCollections }}
  </div>
</template>
<script>
import semenCollectionAPI from "@/services/SemenCollectionAPI.js";
import selectOwner from "@/components/SelectOwner";
export default {
  props: ['horse'],
  data() {
    return {
      dialog: false,
      valid: false,
      required: [
        v => !!v || 'Dit veld is verplicht'
      ],
      headers: [
        { text: 'Hengst', align: 'left', sortable: false},
        { text: 'Eigenaar'},
        { text: 'Beginwaarde'},
        { text: 'Beschikbaar'},
        { text: 'Productiedatum'},
        { text: 'locatie'},
      ],
      loading: false,
      semenCollections: [],
      editedIndex: -1,
      editedItem: {},
      owner: "",
      semenCollectionType: ['Productie','Import']
    };
  },
  mounted() {
    this.getSemenCollections();
  },
  computed: {
    URLParameters () {
      const URLParameters = {};
      if (this.horse._id) URLParameters.stallion = this.horse.id;
      return (URLParameters)
    }
  },
  watch: {
    dialog (val) {
      val || this.close()
    },
  },
  methods: {
    async getSemenCollections() {
      this.loading = true;
      try {
        const response = await semenCollectionAPI.getSemenCollection(this.URLParameters);
        this.semenCollections = response.data;
      } catch (e) {
        this.errored = true;
        this.errorMessage = e.response.data.message;
      } finally {
        this.loading = false;
      }
    },
    ownerName(owner){
      return owner.type === "particulier" ? `${owner.first_name} ${owner.last_name}` : `${owner.company}`
    },
    editItem (item) {
      this.editedIndex = this.semenCollections.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    close () {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },
    save() {
      console.log(this.editedItem);
    },
    updateOwner(newOwner) {
      this.editedItem.owner = newOwner._id;
    },
  },
  components: {
    selectOwner
  }
}
</script>
