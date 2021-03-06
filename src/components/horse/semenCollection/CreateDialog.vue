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
                  <v-text-field
                      v-model="horse.name"
                      label="Hengst"
                      outlined disabled
                  />
                  <select-customer
                      @update-customer="updateCustomer"
                      :owner="horse.owner"
                      label="Eigenaar lot"
                      required
                  />
                  <v-select
                      :disabled="!!editSemenCollection._id"
                      v-model="editSemenCollection.type"
                      :items="semenCollectionType"
                      label="Type sperma lot"
                      :rules="required"
                      outlined required
                  />
                  <v-menu
                      v-if="editSemenCollection.type === 'Productie'"
                      v-model="productionDateMenu"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      min-width="290px" offset-y
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                          v-model="computedProductionDateFormatted"
                          label="Datum productie sperma"
                          required :rules="required"
                          v-on="on" readonly outlined
                      />
                    </template>
                    <v-date-picker
                        v-model="editSemenCollection.production_date"
                        @input="productionDateMenu = false"
                        no-title
                    />
                  </v-menu>
                  <v-menu
                      v-if="editSemenCollection.type === 'Import'"
                      v-model="productionDateMenu"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      min-width="290px" offset-y
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                          v-model="computedProductionDateFormatted"
                          label="Datum productie sperma"
                          v-on="on" readonly outlined
                      />
                    </template>
                    <v-date-picker
                        v-model="editSemenCollection.production_date"
                        @input="productionDateMenu = false"
                        no-title
                    />
                  </v-menu>
                  <v-select
                      v-if="editSemenCollection.location"
                      v-model="editSemenCollection.location.container"
                      label="Stikstof vat"
                      :items="nitrogenContainers"
                      :rules="required"
                      item-text="name"
                      item-value="_id"
                      return-object
                      outlined required
                  />
                </v-col>
                <v-col cols="6" v-if="editSemenCollection.location.container">
                  <v-select
                      v-model="editSemenCollection.location.tube"
                      :items="tubesAvailable(editSemenCollection.location.container)"
                      label="Koker"
                      outlined required :rules="required"
                  />
                </v-col>
                <v-col cols="6" v-if="editSemenCollection.location.container">
                  <v-select
                      v-model="editSemenCollection.location.position"
                      :items="nitrogenContainerPosition"
                      label="Positie"
                      outlined required :rules="required"
                  />
                </v-col>
                <v-col cols="6">
                  <v-text-field
                      v-model="editSemenCollection.initial_inventory"
                      :disabled="!!editSemenCollection._id"
                      :rules="required" type="number"
                      label="Aantal rietjes"
                      outlined
                  />
                </v-col>
                <v-col cols="6">
                  <v-select
                      v-model="editSemenCollection.color"
                      :items="semenCollectionColor"
                      label="Kleur rietjes" outlined
                  />
                </v-col>
                <v-col cols="12">
                  <v-alert type="error" v-if="errored">
                    {{ errorMessage }}
                  </v-alert>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="error" text @click="closeDialog">Annuleren</v-btn>
          <v-btn v-if="!editSemenCollection._id" color="success" text :disabled="!valid" @click="createSemenCollection">
            Opslaan
          </v-btn>
          <v-btn v-if="editSemenCollection._id" color="success" text :disabled="!valid" @click="updateSemenCollection">
            Bijwerken
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import selectCustomer from "@/components/customer/SelectCustomer";
import semenAPI from "@/services/SemenAPI.js";
import nitrogenContainerAPI from "@/services/NitrogenContainerAPI.js";
import {formatDate, ownerName} from "@/Helpers";
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
      required: [v => !!v || 'Dit veld is verplicht'],
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
    computedProductionDateFormatted() {
      return this.formatDate(this.editSemenCollection.production_date)
    },
  },
  methods: {
    closeDialog() {
      this.$emit('close-dialog', false)
    },
    async createSemenCollection() {
      if (!this.editSemenCollection.owner) this.editSemenCollection.owner = this.horse.owner._id;
      if (!this.editSemenCollection.stallion) this.editSemenCollection.stallion = this.horse._id;
      try {
        const {data} = await semenAPI.postSemenCollection(this.editSemenCollection);
        this.$emit('created-semen-collection', data);
        this.closeDialog();
      } catch (err) {
        this.errored = true;
        this.errorMessage = err.response.data.message;
      }
    },
    async updateSemenCollection() {
      try {
        const {data} = await semenAPI.putSemenCollection(this.editSemenCollection);
        this.$emit('update-semen-collection', data);
        this.closeDialog();
      } catch (err) {
        this.errored = true;
        this.errorMessage = err.response.data.message;
      }
    },
    async getNitrogenContainers() {
      try {
        const {data} = await nitrogenContainerAPI.getNitrogenContainers();
        this.nitrogenContainers = data;
      } catch (err) {
        this.errored = true;
        this.errorMessage = err.response.data.message;
      }
    },
    updateCustomer(customer) {
      this.editSemenCollection.owner = customer._id;
    },
    ownerName,
    formatDate,
    tubesAvailable(container) {
      if (container) {
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
  created() {
    if (this.semenCollection) {
      this.editSemenCollection = this.semenCollection;
    }
    this.getNitrogenContainers();
  }
}
</script>
