<template>
  <div>
    <v-dialog v-model="editDialog" persistent max-width="600px">
      <v-card>
        <v-card-title class="mb-4">
          <span class="headline">Stockwijziging aan dit lot toevoegen</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-select v-model="semenCollectionModification.type" :items="semenCollectionModificationType" label="Type" outlined :rules="required"></v-select>
            <select-customer v-if="semenCollectionModification.type === 'Export'" @update-customer="updateCustomer" label="Export naar"></select-customer>
            <v-text-field v-model="semenCollectionModification.amount" type="number" label="Aantal rietjes" outlined :hint="controleHint" :rules="required"></v-text-field>
            <v-alert type="error" v-if="errored" >
              {{ errorMessage }}
            </v-alert>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDetailDialog">Annuleer</v-btn>
          <v-btn :disabled="!valid" color="success" class="mr-4" @click="createSemenCollectionModification()" depressed>
            Opslaan
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import selectCustomer from "@/components/customer/SelectCustomer";
import semenAPI from "@/services/SemenAPI.js";
export default {
  props: ['semenCollection','editDialog'],
  data() {
    return {
      semenCollectionModification: {
        owner: null,
        type: null,
        amount: 0
      },
      semenCollectionModificationType: ['Export','Controle'],
      valid: false,
      required: [
        v => !!v || 'Dit veld is verplicht'
      ],
      errored: false,
      errorMessage: ''
    }
  },
  methods: {
    closeDetailDialog() {
      this.$emit('close-edit-dialog', false);
    },
    updateCustomer(customer) {
      this.semenCollectionModification.owner = customer._id;
    },
    async createSemenCollectionModification() {
      try {
        const response = await semenAPI.postSemenCollectionModification(this.semenCollection, this.semenCollectionModification);
        //console.log(response);
        this.$emit('update-semen-collection', response.data);
        this.$emit('close-edit-dialog', false);
      //   //this.semenCollections.push(response.data);
      //   this.createDialog = false;
      // } catch (err) {
      //   this.errored = true;
      //   this.errorMessage = err.response.data.message;
      // }
      } catch (err) {
          this.errored = true;
          this.errorMessage = err.response.data.message;
        }
    },
  },
  computed: {
    controleHint() {
      if(this.semenCollectionModification.type === "Controle") {
        return "Na controle 1 rietje te kort vuld dan -1 in / Na controle 1 rietje te veel vuld dan 1 in"
      } else {
        return null
      }
    }
  },
  components: {
    selectCustomer
  },
}
</script>
