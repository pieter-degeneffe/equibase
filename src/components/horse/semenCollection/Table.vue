<template>
  <div>
    <v-data-table :headers="headers" :items="semenCollections" :loading="loading" loading-text="Bezig met laden..." class="ma-5">
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-spacer></v-spacer>
          <v-dialog v-model="createDialog" max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn color="primary" dark  @click="openCreateDialog">Sperma lot toevoegen</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">Gegevens van het lot</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-form ref="form" v-model="valid">
                    <v-row>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field v-model="horse.name" label="Hengst" outlined disabled></v-text-field>
                        <select-owner :owner="horse.owner" @update-owner="updateOwner" required></select-owner>
                        <v-menu v-model="productionDateMenu" :close-on-content-click="false"  transition="scale-transition" offset-y min-width="290px">
                          <template v-slot:activator="{ on }">
                            <v-text-field v-model="computedProductionDateFormatted" label="Datum productie sperma" v-on="on" readonly outlined></v-text-field>
                          </template>
                          <v-date-picker v-model="editedItem.production_date" no-title @input="productionDateMenu = false"></v-date-picker>
                        </v-menu>
                        <v-select v-model="editedItem.type" :items="semenCollectionType" label="Type sperma lot" outlined required :rules="[(v) => !!v || 'Dit veld is verplicht']"></v-select>
                        <v-select v-model="editedItem.location" :items="nitrogenContainers" item-text="name" item-value="_id" label="Locatie - stikstof vat" outlined return-object required :rules="[(v) => !!v || 'Dit veld is verplicht']"></v-select>
                        <v-select v-if="editedItem.location" v-model="editedItem.tube" :items="tubesAvailable(editedItem.location)" label="Locatie - stikstof vat - koker" outlined required :rules="[(v) => !!v || 'Dit veld is verplicht']"></v-select>
                        <v-select v-if="editedItem.location" v-model="editedItem.position" :items="nitrogenContainerPosition" label="Locatie - stikstof vat - koker - positie" outlined required :rules="[(v) => !!v || 'Dit veld is verplicht']"></v-select>
                        <v-text-field v-model="editedItem.inventory" :rules="required" type="number" label="Aantal rietjes" outlined></v-text-field>
                        <v-select v-model="editedItem.color" :items="semenCollectionColor" label="Kleur rietjes" outlined></v-select>
                        <v-alert type="error" v-if="errored" >
                          {{ errorMessage }}
                        </v-alert>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeCreateDialog">Annuleer</v-btn>
                <v-btn color="blue darken-1" text :disabled="!valid" @click="saveSemenCollection">Opslaan</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:no-data>
          Geen sperma loten gevonden
      </template>
      <template v-slot:item="props">
        <tr :style="{ backgroundColor: backgroundColor(props.item.color)}">
          <td>{{ props.item.stallion.name }}</td>
          <td>{{ ownerName(props.item.owner) }}</td>
          <td>{{ props.item.initial_inventory }}</td>
          <td>{{ props.item.current_inventory }}</td>
          <td>{{ new Date(props.item.production_date) | dateFormat('DD/MM/YY')}}</td>
          <td>{{ props.item.location.container.name }} - Koker {{ props.item.location.tube }} - {{ props.item.location.position }}</td>
          <td align='right'><v-icon small class="mr-2" @click="editItem(props.item)">mdi-pencil</v-icon></td>
        </tr>
      </template>
    </v-data-table>
    <edit-dialog :semenCollection="semenCollection" :editDialog="editDialog"></edit-dialog>
  </div>
</template>
<script>
import semenCollectionAPI from "@/services/SemenCollectionAPI.js";
import nitrogenContainerAPI from "@/services/NitrogenContainerAPI.js";
import selectOwner from "@/components/SelectOwner";
import editDialog from "@/components/horse/semenCollection/EditDialog";
export default {
  props: ['horse'],
  data() {
    return {
      createDialog: false,
      editDialog: false,
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
        { text: 'Bewerken', align: 'right', value: 'action', sortable: false }
      ],
      loading: false,
      semenCollections: [],
      semenCollection: null,
      editedIndex: -1,
      editedItem: {},
      owner: "",
      semenCollectionType: ['Productie','Import'],
      semenCollectionColor: ['Rood','Oranje','Geel','Groen','Blauw','Indigo','Violet'],
      nitrogenContainers: [],
      nitrogenContainerPosition: ['Boven', 'Onder'],
      productionDateMenu: false,
      errored: false,
      errorMessage: '',
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
    },
    computedProductionDateFormatted () {
      return this.formatDate(this.editedItem.production_date)
    }
  },
  methods: {
    async getSemenCollections() {
      this.loading = true;
      try {
        const response = await semenCollectionAPI.getSemenCollection(this.URLParameters);
        this.semenCollections = response.data;
      } catch (err) {
        this.errored = true;
        this.errorMessage = err.response.data.message;
      } finally {
        this.loading = false;
      }
    },
    async saveSemenCollection() {
      if(!this.editedItem.owner) this.editedItem.owner = this.horse.owner._id;
      const semenCollection = {
        stallion: this.horse._id,
        owner: this.editedItem.owner,
        production_date: this.editedItem.production_date,
        location: {
          container: this.editedItem.location._id,
          tube: this.editedItem.tube,
          position: this.editedItem.position
        },
        type: this.editedItem.type,
        initial_inventory: parseInt(this.editedItem.inventory),
        current_inventory: parseInt(this.editedItem.inventory),
        color: this.editedItem.color
      }
      try {
        const response = await semenCollectionAPI.postSemenCollection(semenCollection);
        this.semenCollections.push(response.data);
        this.createDialog = false;
      } catch (err) {
        this.errored = true;
        this.errorMessage = err.response.data.message;
      }
    },
    async getNitrogenContainers() {
      try {
        const response = await nitrogenContainerAPI.getNitrogenContainers();
        this.nitrogenContainers = response.data;
      } catch (err) {
        this.errored = true;
        this.errorMessage = err.response.data.message;
      }
    },
    ownerName(owner){
      return owner.type === "particulier" ? `${owner.first_name} ${owner.last_name}` : `${owner.company}`
    },
    editItem (item) {
      //this.editedIndex = this.semenCollections.indexOf(item)
      //this.editedItem = Object.assign({}, item)
      this.editDialog = true
      this.semenCollection = item;
    },
    openCreateDialog () {
      this.createDialog = true;
      this.getNitrogenContainers();
    },
    closeCreateDialog () {
      this.createDialog = false
      this.editedItem = Object.assign({}, this.defaultItem)
      this.editedIndex = -1
    },
    updateOwner(newOwner) {
      this.editedItem.owner = newOwner._id;
    },
    tubesAvailable(container) {
      let tubesAvailable = [];
      for (let i = 1; i <= container.available_places; i++) {
        tubesAvailable.push({
          text: `koker ${i}`,
          value: i
        })
      }
      // const tubesAvailable = [...Array(container.available_places + 1).keys()];
      // tubesAvailable.shift();
      return tubesAvailable;
    },
    formatDate (date) {
      if (!date) return null
      date = new Date(date).toISOString().substr(0, 10)
      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },
    backgroundColor (color) {
      switch(color) {
        case 'Rood':
          return "rgba(255,0,0,0.5)";
        case 'Oranje':
          return "rgba(255,165,0,0.5)";
        case 'Geel':
          return "rgba(255,255,0,0.5)";
        case 'Groen':
          return "rgba(0,255,0,0.5)";
        case 'Blauw':
          return "rgba(0,0,255,0.5)";
        case 'Indigo':
          return "rgba(75,0,130,0.5)";
        case 'Violet':
          return "rgba(143,0,255,0.5)";
      }
    },
  },
  components: {
    selectOwner,
    editDialog
  }
}
</script>