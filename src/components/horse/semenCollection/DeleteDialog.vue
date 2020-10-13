<template>
  <div>
    <v-dialog v-model="deleteDialog" persistent max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Lot verwijderen</span>
        </v-card-title>
        <v-card-text>
            <v-form ref="form" v-model="valid">
              <p color="red">Vul de naam in van de hengst (<b>{{ semenCollection.stallion.name }}</b>) om te bevestigen dat je dit sperma lot wilt verwijderen.</p>
              <v-text-field label="Naam hengst" outlined :rules="[(v) => v === this.semenCollection.stallion.name || 'Dit veld is verplicht']"/>
              <v-alert type="error" v-if="errored" >
                {{ errorMessage }}
              </v-alert>
            </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="blue darken-1" text @click="closeDialog">Annuleren</v-btn>
          <v-btn color="error" text :disabled="!valid" @click="deleteSemenCollection">Verwijderen</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import semenAPI from "@/services/SemenAPI.js";
export default {
  props: {
    deleteDialog: Boolean,
    semenCollection: Object
  },
  data() {
    return {
      valid: false,
      errored: false,
      errorMessage: ''
    }
  },
  methods: {
    closeDialog() {
      this.$emit('close-dialog',false)
    },
    async deleteSemenCollection(){
      try {
        await semenAPI.deleteSemenCollection(this.semenCollection);
        this.$emit('delete-semen-collection', this.semenCollection);
        this.closeDialog();
      } catch (err) {
        this.errored = true;
        this.errorMessage = err.response.data.message;
      }
    }
  }
}
</script>
