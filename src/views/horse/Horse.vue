<template>
  <v-card class="ma-5" outlined>
    <v-toolbar flat dark>
      <v-toolbar-title>{{ horse.name }}</v-toolbar-title>
    </v-toolbar>
    <v-form v-model="valid">
      <v-container>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field v-model="horse.name" :counter="128" :rules="nameRules" label="Naam paard" required outlined></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-select :items="horseType" v-model="horse.type" label="Geslacht" outlined></v-select>
          </v-col>
          <v-col cols="12" md="4">
            <autocomplete :owner="owner" @update-owner="updateOwner"></autocomplete>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field v-model="horse.ueln" type="number" :counter="15" label="UELN" required outlined></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field v-model="horse.father" :counter="128" label="Vader" required outlined></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field v-model="horse.mother" :counter="128" label="Moeder" required outlined></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field v-model="horse.grandfather" :counter="128" label="Grootvader" required outlined></v-text-field>
          </v-col>
        </v-row>
        <v-row justify="end">
          <v-btn :disabled="!valid" color="success" class="mr-4" @click="saveHorse()" depressed>
            Opslaan
          </v-btn>
          <v-btn color="warning" depressed @click="deleteDialog = true">
            Verwijderen
          </v-btn>
          <v-dialog v-model="deleteDialog" persistent max-width="350">
            <v-card>
              <v-card-title class="headline">{{ horse.name }} verwijderen?</v-card-title>
              <v-card-text>Ben je zeker dat je het paard {{ horse.name }} wilt verwijderen? Dit kan niet meer ongedaan gemaakt worden</v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="success" depressed @click="deleteDialog = false">Annuleren</v-btn>
                <v-btn color="error" depressed @click="deleteHorse()">Verwijderen</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
        {{ horse.owner }}
      </v-container>
    </v-form>
  </v-card>
</template>

<script>
import horseAPI from "@/services/HorseAPI.js";
import customerAPI from "@/services/CustomerAPI.js";
import autocomplete from "@/components/Autocomplete";
export default {
  props: ["id"],
  data() {
    return {
      horse: "",
      owner: "",
      horseType: ['stallion', 'mare'],
      valid: true,
      nameRules: [
        v => !!v || 'Naam is verplicht',
        v => (v && v.length <= 128) || 'Moet minder dan 128 tekens bevatten'
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
    this.loadHorse(this.id);
  },
  methods: {
    async loadHorse(id) {
      const horse = await horseAPI.getHorse(id);
      this.horse = horse.data;
      const owner = await customerAPI.getCustomer(this.horse.owner);
      this.owner = owner.data;
    },
    async saveHorse() {
      await horseAPI.putHorse(this.horse);
    },
    async deleteHorse() {
      await horseAPI.deleteHorse(this.horse._id);
      this.$router.push({ path: '/horse' });
      this.dialog = false;
    },
    updateOwner(newOwner) {
      console.log(newOwner);
      this.horse.owner = newOwner._id;
    }
  },
  components: {
    autocomplete
  },
};
</script>

<style lang="css"></style>
