<template>
  <div>
    <v-btn color="primary" dark  @click="openCreateDialog">Sperma lot toevoegen</v-btn>
    <v-dialog v-model="createDialog" persistent max-width="500px">
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
                  <select-customer :owner="horse.owner" @update-customer="updateCustomer" label="Eigenaar lot" required></select-customer>
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
          <v-btn color="blue darken-1" text @click="createDialog = false">Annuleer</v-btn>
          <v-btn color="blue darken-1" text :disabled="!valid" @click="createSemenCollection">Opslaan</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import selectCustomer from "@/components/customer/SelectCustomer";
import semenAPI from "@/services/SemenAPI.js";
import nitrogenContainerAPI from "@/services/NitrogenContainerAPI.js";
export default {
  props: ['horse'],
  data() {
    return {
      createDialog: false,
      valid: false,
      required: [
        v => !!v || 'Dit veld is verplicht'
      ],
      editedItem: {},
      productionDateMenu: false,
      nitrogenContainers: [],
      semenCollectionType: ['Productie','Import'],
      semenCollectionColor: ['Rood','Oranje','Geel','Groen','Blauw','Indigo','Violet'],
      nitrogenContainerPosition: ['Boven', 'Onder'],
      errored: false,
      errorMessage: ''
    }
  },
  computed: {
    computedProductionDateFormatted () {
      return this.formatDate(this.editedItem.production_date)
    }
  },
  methods: {
    async createSemenCollection() {
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
        color: this.editedItem.color
      }
      try {
        console.log(semenCollection);
        const response = await semenAPI.postSemenCollection(semenCollection);
        this.$emit('created-semen-collection', response.data);
        //this.semenCollections.push(response.data);
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
    openCreateDialog () {
      this.createDialog = true;
      this.getNitrogenContainers();
    },
    ownerName(owner){
      return owner.type === "particulier" ? `${owner.first_name} ${owner.last_name}` : `${owner.company}`
    },
    updateCustomer(customer) {
      this.editedItem.owner = customer._id;
    },
    formatDate (date) {
      if (!date) return null
      date = new Date(date).toISOString().substr(0, 10)
      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
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
  },
  components: {
    selectCustomer
  }
}
</script>
