<template>
  <v-card class="ma-5" outlined>
    <v-toolbar flat color="blue-grey" dark>
      <v-toolbar-title>{{ horse.name }}</v-toolbar-title>
    </v-toolbar>
    <!-- <v-layout>
      <v-flex
        xs12
        md6
        pa-5
      >
        <h1></h1>
      </v-flex>
      <v-form>
        <v-text-field v-model="horse.name" label="Naam paard" :placeholder="horse.name" outlined></v-text-field>
      </v-form>
      <div class="my-2">
        <v-btn depressed color="primary" @click="saveHorse(horse)">Opslaan</v-btn>
      </div>
    </v-layout> -->
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
        <v-row>
          <v-col cols="12" md="4">
            <v-btn :disabled="!valid" color="success" class="mr-4" @click="saveHorse()" depressed>
              Opslaan
            </v-btn>
            <v-btn color="warning" @click="deleteHorse()" depressed>
              Verwijderen
            </v-btn>
          </v-col>
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
      ]
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
      this.owner = owner.data
    },
    async saveHorse() {
      await horseAPI.putHorse(this.horse);
    },
    async deleteHorse() {
      await horseAPI.deleteHorse(this.horse._id);
      this.$router.push({ path: '/horse' })
    },
    updateOwner(newOwner) {
      //console.log(newOwner._id);
      this.horse.owner = newOwner._id;
    }
  },
  components: {
    autocomplete
  },
};
</script>

<style lang="css"></style>
