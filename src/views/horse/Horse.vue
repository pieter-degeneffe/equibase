<template>
  <v-card class="ma-5" outlined>
    <v-toolbar flat dark>
      <v-toolbar-title>{{ horse.name }}</v-toolbar-title>
    </v-toolbar>
    <v-form ref="form" v-model="valid">
      <v-container>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field v-model="horse.name" :counter="64" :rules="nameRules" label="Naam paard" outlined></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-select v-model="horse.type" :items="horseType" :rules="required" label="Geslacht" outlined></v-select>
          </v-col>
          <v-col cols="12" md="4">
            <select-owner :owner="owner" @update-owner="updateOwner"></select-owner>
          </v-col>
        </v-row>
        <v-row>
          <!-- <v-col cols="12" md="4">
            <autocomplete-old :owner="owner" @update-owner="updateOwner"></autocomplete-old>
          </v-col> -->
          <v-col cols="12" md="4">
            <v-text-field v-model="horse.ueln" type="number" :counter="15" label="UELN" required outlined></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field v-model="horse.father" :counter="64" :rules="length64" label="Vader" required outlined></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field v-model="horse.mother" :counter="64" :rules="length64" label="Moeder" required outlined></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field v-model="horse.grandfather" :counter="64" :rules="length64" label="Grootvader" required outlined></v-text-field>
          </v-col>
        </v-row>
        <v-row justify="end">
          <v-btn v-if="!horse._id" :disabled="!valid" color="success" class="mr-4" @click="createHorse()" depressed>
            Paard opslaan
          </v-btn>
          <v-btn v-if="horse._id" :disabled="!valid" color="success" depressed class="mr-4" @click="updateHorse()">
            Paard bijwerken
          </v-btn>
          <v-btn v-if="horse._id" color="warning" depressed @click="deleteDialog = true">
            Paard verwijderen
          </v-btn>
          <v-dialog v-model="deleteDialog" persistent max-width="350">
            <v-card>
              <v-card-title class="headline">Paard verwijderen?</v-card-title>
              <v-card-text>Ben je zeker dat je het paard {{ horse.name }} wilt verwijderen? Dit kan niet meer ongedaan gemaakt worden</v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="success" depressed @click="deleteDialog = false">Annuleren</v-btn>
                <v-btn color="error" depressed @click="deleteHorse()">Verwijderen</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
        <v-snackbar v-model="snackbar">
          Paard is succesvol opgeslaan
          <v-btn color="pink" text @click="snackbar = false">
            Close
          </v-btn>
        </v-snackbar>
      </v-container>
    </v-form>
  </v-card>
</template>

<script>
import horseAPI from "@/services/HorseAPI.js";
import customerAPI from "@/services/CustomerAPI.js";
import selectOwner from "@/components/SelectOwner";
export default {
  props: ["id"],
  data() {
    return {
      horse: "",
      owner: "",
      horseType: ['hengst', 'merrie'],
      valid: false,
      snackbar: false,
      nameRules: [
        v => !!v || 'Dit veld is verplicht',
        v => (v && v.length <= 64) || 'Mag maximum 64 tekens bevatten',
      ],
      length64: [
        v => (v || '').length <= 64 || 'Mag maximum 8 tekens bevatten',
      ],
      required: [
        v => !!v || 'Dit veld is verplicht'
      ],
      deleteDialog: false
    };
  },
  computed: {
    fullName () {
      return this.owner.first_name + ' ' + this.owner.last_name;
    }
  },
  mounted() {
    if (this.id !== "undefined") this.loadHorse(this.id);
    else this.horse = {};
  },
  methods: {
    async loadHorse(id) {
      const horse = await horseAPI.getHorse(id);
      this.horse = horse.data;
      const owner = await customerAPI.getCustomer(this.horse.owner);
      this.owner = owner.data;
    },
    async createHorse() {
      try {
        await horseAPI.postHorse(this.horse);
      } catch (e) {
        this.errored = true;
      } finally {
        this.loading = false;
        this.snackbar = true
      }
    },
    async updateHorse() {
      try {
        await horseAPI.putHorse(this.horse);
      } catch (e) {
        this.errored = true;
      } finally {
        this.loading = false;
        this.snackbar = true
      }
    },
    async deleteHorse() {
      try {
        await horseAPI.deleteHorse(this.horse._id);
      } catch (e) {
        this.errored = true;
      } finally {
        this.$router.push({ path: '/horse' });
        this.dialog = false;
      }
    },
    updateOwner(newOwner) {
      this.horse.owner = newOwner._id;
    },
    validate () {
      if (this.$refs.form.validate()) {
        this.snackbar = true
      }
    },
  },
  components: {
    selectOwner
  },
};
</script>

<style lang="css"></style>
