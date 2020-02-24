<template>
  <div>
    <v-card flat>
      <v-form ref="form" v-model="valid">
        <v-container>
          <v-row dense>
            <v-col cols="12" md="4">
              <v-text-field v-model="horse.name" :counter="64" :rules="nameRules" label="Naam paard*" :disabled="horse.death" :loading="loading" outlined></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-select v-model="horse.type" :rules="required" :items="horseType" label="Geslacht*" :disabled="horse.death" :loading="loading" outlined value="merrie"></v-select>
            </v-col>
            <v-col cols="12" md="4">
              <v-select v-model="horse.location" :items="locations" item-value="_id" item-text="name" label="Locatie" :disabled="horse.death" :loading="loading" outlined clearable></v-select>
            </v-col>
            <v-slide-x-transition>
              <v-col cols="12" md="4" v-if="horse.type === 'hengst'">
                <v-switch outlined v-model="horse.stud_horse" label="Dekhengst" flat></v-switch>
              </v-col>
            </v-slide-x-transition>
            <v-slide-x-transition>
              <v-col cols="12" md="4" v-if="horse.stud_horse">
                <v-text-field v-model="horse.stud_fee" label="Dekgeld" :disabled="horse.death" :loading="loading" outlined></v-text-field>
              </v-col>
            </v-slide-x-transition>
            <v-slide-x-transition>
              <v-col cols="12" md="4" v-if="horse.type === 'merrie'">
                <v-switch outlined v-model="horse.surrogate" label="Draagmoeder" flat></v-switch>
              </v-col>
            </v-slide-x-transition>
            <v-slide-x-transition>
              <v-col v-if="horse.surrogate" cols="12" md="4">
                <v-text-field v-model="horse.surrogate_uid" :counter="64" :rules="length64" label="Draagmoeder brandnummer" :disabled="horse.death" outlined></v-text-field>
              </v-col>
            </v-slide-x-transition>
            <v-col cols="12" md="4">
              <select-customer :owner="horse.owner" @update-customer="updateCustomer" :disabled="horse.death" :loading="loading" label="Eigenaar"></select-customer>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field v-model="horse.ueln" :counter="15" label="UELN" :disabled="horse.death" outlined :loading="loading"></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field v-model="horse.microchip" :counter="15" type="number" label="Microchip" :disabled="horse.death" outlined :loading="loading"></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-menu v-model="birthDateMenu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px">
                <template v-slot:activator="{ on }">
                  <v-text-field v-model="computedBirthDateFormatted" label="Geboortedatum" v-on="on" readonly :disabled="horse.death" outlined :loading="loading"></v-text-field>
                </template>
                <v-date-picker v-model="horse.date_of_birth" no-title @input="birthDateMenu = false"></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="12" md="4">
              <v-select v-model="horse.studbook" :items="horseStudbook" label="Stamboek" :disabled="horse.death" outlined :loading="loading"></v-select>
            </v-col>
            <v-col cols="12" md="4">
              <v-select v-model="horse.coat_color" :items="horseCoatColor" label="Vachtkleur" :disabled="horse.death" outlined :loading="loading"></v-select>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field v-model="horse.father" :counter="64" :rules="length64" label="Vader" :disabled="horse.death" outlined :loading="loading"></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field v-model="horse.mother" :counter="64" :rules="length64" label="Moeder" :disabled="horse.death" outlined :loading="loading"></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field v-model="horse.grandfather" :counter="64" :rules="length64" label="Grootvader" :disabled="horse.death" outlined :loading="loading"></v-text-field>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" md="4">
              <v-switch dense v-model="horse.keep_for_food_chain" label="Houden voor voedselketen" :disabled="horse.death" flat></v-switch>
            </v-col>
            <v-col cols="12" md="4">
              <v-switch color="red" dense v-model="horse.death" :label="horseLiving" flat></v-switch>
            </v-col>
            <v-slide-x-transition>
              <v-col cols="12" md="4" v-if="horse.death">
                <v-menu v-model="deathDateMenu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px">
                  <template v-slot:activator="{ on }">
                    <v-text-field v-model="computedDeathDateFormatted" label="Overlijdensdatum" v-on="on" readonly outlined></v-text-field>
                  </template>
                  <v-date-picker v-model="horse.date_of_death" no-title @input="deathDateMenu = false"></v-date-picker>
                </v-menu>
              </v-col>
            </v-slide-x-transition>
          </v-row>
          <v-alert type="error" v-if="errored" >
            {{ errorMessage }}
          </v-alert>
          <v-row justify="end" dense>
            <v-btn v-if="!horse._id" :disabled="!valid" color="success" class="mr-4" @click="createHorse()" depressed>
              Paard opslaan
            </v-btn>
            <v-btn v-if="horse._id" :disabled="!valid" color="success" depressed class="mr-4" @click="updateHorse()">
              {{ horse.type }} bijwerken
            </v-btn>
            <v-btn v-if="horse._id" color="warning" depressed @click="deleteDialog = true">
              {{ horse.type }} verwijderen
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
              sluiten
            </v-btn>
          </v-snackbar>
        </v-container>
      </v-form>
    </v-card>
  </div>
</template>
<script>
import horseAPI from "@/services/HorseAPI.js";
import selectCustomer from "@/components/customer/SelectCustomer";
import locationAPI from "@/services/LocationAPI.js";
export default {
  props: ['horse', 'loading'],
  data () {
    return {
      errored: false,
      deleteDialog: false,
      snackbar: false,
      errorMessage: '',
      valid: false,
      locations: null,
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
      horseType: ['hengst', 'merrie'],
      search: null,
      owner: "",
      birthDateMenu: false,
      horseStudbook: ['Arabische volbloed (Arab)','American Quarter Horse (AQH)','Belgisch Warmbloedpaard (BWP)','SBS','SF','Trotteur Francais (TF)','Belgische Draver','Studbook Zangersheide (Z)','Studbook Du Cheval de Selle Luxembourgeois (SCSL)','Westfalen','Hannover','Oldenburg (OLD)','Anglo European Studbook (AES)','Koninklijk Nederlands Warmbloedpaard (KWPN)','Lusitana','Equipas','Andere'],
      horseCoatColor: ['Bruin','Donkerbruin','Vos','Donkervos','Zwart','Schimmel','Wit','Bont','Palomino'],
      deathDateMenu: false,
    }
  },
  mounted () {
    this.getLocations();
  },
  methods: {
    async getLocations() {
      try {
        const response = await locationAPI.getLocations();
        this.locations = response.data;
      } catch (e) {
        this.errored = true;
      }
    },
    async createHorse() {
      this.errored = false;
      try {
        const response = await horseAPI.postHorse(this.horse);
        this.$emit('update-horse', response.data);
        this.snackbar = true;
        this.$router.push("/horse/" + this.horse._id);
        this.errored = false;
      } catch (err) {
        this.errored = true;
        this.errorMessage = err.response.data.message;
      }
    },
    async updateHorse() {
      this.errored = false;
      try {
        if(this.horse.date_of_birth) this.horse.date_of_birth = new Date(this.horse.date_of_birth).toISOString();
        const response = await horseAPI.putHorse(this.horse);
        this.$emit('update-horse', response.data);
        this.snackbar = true;
        this.errored = false;
      } catch (e) {
        this.errored = true;
        this.errorMessage = e.response.data.message;
      }
    },
    async deleteHorse() {
      try {
        await horseAPI.deleteHorse(this.horse._id);
      } catch (e) {
        this.errored = true;
        this.errorMessage = e.response.data.message;
      } finally {
        this.$router.go(-1);
        this.dialog = false;
      }
    },
    updateCustomer(customer) {
      this.horse.owner = customer._id;
    },
    formatDate (date) {
      if (!date) return null
      date = new Date(date).toISOString().substr(0, 10)
      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },
    validate() {
      if (this.$refs.form.validate()) {
        this.snackbar = true
      }
    }
  },
  computed: {
    computedBirthDateFormatted () {
      return this.formatDate(this.horse.date_of_birth)
    },
    computedDeathDateFormatted () {
      return this.formatDate(this.horse.date_of_death)
    },
    horseLiving() {
      if (this.horse.death) return "Paard is gestorven";
      return "Paard gestorven";
    }
  },
  components: {
    selectCustomer
  },
}
</script>
