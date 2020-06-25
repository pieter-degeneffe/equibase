<template>
  <div>
    <v-dialog v-model="createDialog" persistent max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline" v-if="!editSemenCollection._id">Gegevens van het nieuwe lot</span>
          <span class="headline" v-else>Lot bewerken</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid">
              <v-row dense>
                <v-col cols="12" sm="12" md="12">
                  <v-text-field v-model="horse.name" label="Hengst" outlined disabled></v-text-field>
                  <select-customer :owner="horse.owner" @update-customer="updateCustomer" label="Eigenaar lot" required></select-customer>
                  <v-select v-model="editSemenCollection.type" :items="semenCollectionType" label="Type sperma lot" outlined required :rules="[(v) => !!v || 'Dit veld is verplicht']" :disabled="!!editSemenCollection._id"></v-select>
                  <v-menu v-if="editSemenCollection.type === 'Productie'" v-model="productionDateMenu" :close-on-content-click="false"  transition="scale-transition" offset-y min-width="290px">
                    <template v-slot:activator="{ on }">
                      <v-text-field v-model="computedProductionDateFormatted" label="Datum productie sperma" v-on="on" readonly outlined required :rules="required"></v-text-field>
                    </template>
                    <v-date-picker v-model="editSemenCollection.production_date" no-title @input="productionDateMenu = false"></v-date-picker>
                  </v-menu>
                  <v-menu v-if="editSemenCollection.type === 'Import'" v-model="productionDateMenu" :close-on-content-click="false"  transition="scale-transition" offset-y min-width="290px">
                    <template v-slot:activator="{ on }">
                      <v-text-field v-model="computedProductionDateFormatted" label="Datum productie sperma" v-on="on" readonly outlined></v-text-field>
                    </template>
                    <v-date-picker v-model="editSemenCollection.production_date" no-title @input="productionDateMenu = false"></v-date-picker>
                  </v-menu>
                  <v-select v-if="editSemenCollection.location" v-model="editSemenCollection.location.container" :items="nitrogenContainers" item-text="name" item-value="_id" label="Locatie - stikstof vat" outlined return-object required :rules="[(v) => !!v || 'Dit veld is verplicht']"></v-select>
                  <v-select v-if="editSemenCollection.location.container" v-model="editSemenCollection.location.tube" :items="tubesAvailable(editSemenCollection.location.container)" label="Locatie - stikstof vat - koker" outlined required :rules="[(v) => !!v || 'Dit veld is verplicht']"></v-select>
                  <v-select v-if="editSemenCollection.location.container" v-model="editSemenCollection.location.position" :items="nitrogenContainerPosition" label="Locatie - stikstof vat - koker - positie" outlined required :rules="[(v) => !!v || 'Dit veld is verplicht']"></v-select>
                  <v-text-field v-model="editSemenCollection.initial_inventory" :rules="required" type="number" label="Aantal rietjes" outlined :disabled="!!editSemenCollection._id"></v-text-field>
                  <v-select v-model="editSemenCollection.color" :items="semenCollectionColor" label="Kleur rietjes" outlined></v-select>
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
          <v-btn color="blue darken-1" text @click="closeDialog">Annuleren</v-btn>
          <v-btn v-if="!editSemenCollection._id" color="blue darken-1" text :disabled="!valid" @click="createSemenCollection">Opslaan</v-btn>
          <v-btn v-if="editSemenCollection._id" color="blue darken-1" text :disabled="!valid" @click="updateSemenCollection">Bijwerken</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import selectCustomer from "@/components/customer/SelectCustomer";
import semenAPI from "@/services/SemenAPI.js";
import nitrogenContainerAPI from "@/services/NitrogenContainerAPI.js";
import {colors} from '@/consts';

export default {
  props: {
    createDialog: Boolean,
    horse: Object,
    semenCollection: Object
  },
  data() {
    return {
      valid: false,
      required: [
        v => !!v || 'Dit veld is verplicht'
      ],
      editSemenCollection: {
        location: {
          container: null
        }
      },
      productionDateMenu: false,
      nitrogenContainers: [],
      semenCollectionType: ['Productie', 'Import'],
      semenCollectionColor: colors,
      nitrogenContainerPosition: ['Boven', 'Onder'],
      errored: false,
      errorMessage: ''
    }
  },
  computed: {
    computedProductionDateFormatted () {
      return this.formatDate(this.editSemenCollection.production_date)
    },
  },
  methods: {
    closeDialog() {
      this.$emit('close-dialog',false)
    },
    async createSemenCollection() {
      if(!this.editSemenCollection.owner) this.editSemenCollection.owner = this.horse.owner._id;
      if(!this.editSemenCollection.stallion) this.editSemenCollection.stallion = this.horse._id;
      try {
        const response = await semenAPI.postSemenCollection(this.editSemenCollection);
        this.$emit('created-semen-collection', response.data);
        this.closeDialog();
      } catch (err) {
        this.errored = true;
        this.errorMessage = err.response.data.message;
      }
    },
    async updateSemenCollection() {
      try {
        const response = await semenAPI.putSemenCollection(this.editSemenCollection);
        this.$emit('update-semen-collection', response.data);
        this.closeDialog();
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
    updateCustomer(customer) {
      this.editSemenCollection.owner = customer._id;
    },
    formatDate (date) {
      if (!date) return null
      date = new Date(date).toISOString().substr(0, 10)
      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },
    tubesAvailable(container) {
      if(container) {
        let tubesAvailable = [];
        for (let i = 1; i <= container.available_places; i++) {
          tubesAvailable.push({
            text: `koker ${i}`,
            value: i
          })
        }
        return tubesAvailable;
      }
    },
  },
  components: {
    selectCustomer
  },
  created () {
    if (this.semenCollection) {
      this.editSemenCollection = this.semenCollection;
    }
    this.getNitrogenContainers();
  }
}
</script>
