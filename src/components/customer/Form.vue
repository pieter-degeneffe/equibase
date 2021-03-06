<template>
  <v-form ref="form" v-model="valid">
    <v-container fluid>
      <v-row dense>
        <v-col cols="12" md="12" sm="12">
          <v-radio-group row v-model="customer.type" :rules="required" required>
            <v-radio label="Particulier" value="particulier"></v-radio>
            <v-radio label="Bedrijf" value="bedrijf"></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12" md="4" sm="6" v-if="customer.type === 'bedrijf'">
          <v-text-field v-model="customer.company" :counter="64" :rules="nameRules" label="Naam bedrijf*" required outlined :loading="loading"></v-text-field>
        </v-col>
        <v-col cols="12" md="4" sm="6">
          <v-text-field v-model="customer.last_name" :counter="64" :rules="nameRules" label="Achternaam klant" outlined :loading="loading"></v-text-field>
        </v-col>
        <v-col cols="12" md="4" sm="6">
          <v-text-field v-model="customer.first_name" :counter="64" :rules="nameRules" label="Voornaam klant" outlined :loading="loading"></v-text-field>
        </v-col>
        <v-col cols="12" md="4" sm="6" v-if="customer.type === 'bedrijf'">
          <v-text-field v-model="customer.tva" :counter="14" :rules="tvaRules" validate-on-blur label="BTW-nummer" persistent-hint hint="voorbeeld: BE0123456789" required outlined :loading="loading"></v-text-field>
        </v-col>
        <v-col cols="12" md="4" sm="6">
          <v-select v-model="customer.language" :rules="required" :items="languages" label="Taal klant*" outlined :loading="loading"></v-select>
        </v-col>
        <v-col cols="12" md="4" sm="6">
          <v-text-field v-model="customer.email" :counter="64" :rules="emailRules" label="E-mail adres" required outlined :loading="loading"></v-text-field>
        </v-col>
        <v-col cols="12" md="4" sm="6">
          <v-text-field v-model="customer.telephone_mobile" :counter="16" label="Telefoonnummer - mobiel" persistent-hint hint="voorbeeld: +32486688502" outlined :loading="loading"></v-text-field>
        </v-col>
        <v-col cols="12" md="4" sm="6">
          <v-text-field v-model="customer.telephone_fixed" :counter="16" label="Telefoonnummer - vast" persistent-hint hint="voorbeeld: +3211781113" outlined :loading="loading"></v-text-field>
        </v-col>
        <v-col cols="12" md="4" sm="6">
          <v-text-field v-model="customer.street" :counter="32" :rules="length32" label="Straatnaam*" outlined :loading="loading"></v-text-field>
        </v-col>
        <v-col cols="12" md="4" sm="6">
          <v-text-field v-model="customer.house_number" :counter="16" :rules="length16" label="Huisnummer*" outlined :loading="loading"></v-text-field>
        </v-col>
        <v-col cols="12" md="4" sm="6">
          <v-text-field v-model="customer.zip" :counter="8" :rules="length8" label="Postcode*" outlined :loading="loading"></v-text-field>
        </v-col>
        <v-col cols="12" md="4" sm="6">
          <v-text-field v-model="customer.city" :counter="32" :rules="length32" label="Gemeente*" outlined :loading="loading"></v-text-field>
        </v-col>
        <v-col cols="12" md="4" sm="6">
          <v-select v-model="customer.country" :items="countries" :rules="required" label="Land*" outlined :loading="loading"></v-select>
        </v-col>
      </v-row>
      <v-alert type="error" v-if="errored" >
        {{ errorMessage }}
      </v-alert>
      <v-row justify="end">
          <v-btn v-if="!customer._id" :disabled="!valid" color="success" depressed class="mr-4" @click="createCustomer()">
            Klant opslaan
          </v-btn>
          <v-btn v-if="customer._id" :disabled="!valid" color="success" depressed class="mr-4" @click="updateCustomer()">
            Klant bijwerken
          </v-btn>
          <v-btn v-if="customer._id" color="warning" depressed @click="deleteDialog = true">
            Klant verwijderen
          </v-btn>
      </v-row>
      <v-dialog v-model="deleteDialog" persistent max-width="350">
        <v-card>
          <v-card-title class="headline">Klant verwijderen?</v-card-title>
          <v-card-text>Ben je zeker dat je de klant <b>{{ customer.first_name }} {{ customer.last_name }}</b> wilt verwijderen? Dit kan niet meer ongedaan gemaakt worden</v-card-text>
          <v-card-actions>
            <v-spacer/>
            <v-btn color="success" depressed @click="deleteDialog = false">Annuleren</v-btn>
            <v-btn color="error" depressed @click="deleteCustomer()">Verwijderen</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-snackbar v-model="snackbar">
        Klant is succesvol opgeslaan
        <v-btn color="pink" text @click="snackbar = false">
          Close
        </v-btn>
      </v-snackbar>
    </v-container>
  </v-form>
</template>
<script>
import customerAPI from "@/services/CustomerAPI.js";
export default {
  props: ['customer', 'loading'],
  data() {
    return {
      //loading: true,
      errored: false,
      errorMessage: '',
      languages: ["NL", "FR", "EN"],
      countries: ["Afghanistan","Albanië","Algerije","Andorra","Angola","Antigua-Barbuda","Argentinië","Armenië","Aruba","Australië","Azerbaijan","Bahamas","Bahrein","Belize","België","Bermuda","Bolivia","Bosnië-Herzegovina","Botswana","Brazilië","Brunei Darussalam","Bulgarije","Burundi","Cambodja",
      "Cameroen","Canada","Cayman Eilanden","Centraal-Afrikaanse Republiek","Chili","China","Ciprus","Colombia","Congo","Cook Eilanden","Costa Rica","Groatië","Cuba","Cyprus","Denemarken","Dominica","Dominicaanse Republiek","DR Congo","Duitsland","Ecuador","Egypte","El Salvador","Eritrea","Estland","Ethiopië","Fiji","Filipijnen","Finland","Frankrijk","Frans Polynesië","Gabon","Gambia","Georgië","Ghana","Griekenland","Groenland","Guam","Guatemala","Guinee-Bissau","Guyana","Haïti","Honduras","Hongarije","Ierland","IJsland","India","Indonesië","Irak","Iran","Israël","Italië","Ivoorkust","Jamaica","Japan","Jemen","Joegoslavië","Jordanië","Kameroen","Kazachstan","Kenya","Kirgizstan","Koeweit","Korea","Kroatië","Laos","Lesotho","Letland","Libanon","Liberia","Libië","Liechtenstein","Litouwen","Luxemburg","Macedonië","Maleisië","Mali","Malta","Marokko","Mauritanië","Mauritius","Mexico","Moldova","Monaco","Mozambique","Namibië","Nederland","Nepal","Nicaragua","Nieuw Zeeland","Niger","Nigeria","Noorwegen","Oezbekistan","Oman","Oostenrijk","Pakistan","Papoea-Nieuw-Guinea","Paraguay","Peru","Polen","Portugal","Puerto Rico","Quatar","Roemenië","Rusland","Rwanda","Saint Lucia","Salomonseilanden","San Marino","Saudi-Arabië","Schotland","Senegal","Sierra Leone","Singapore","Slovenië","Slowakije","Somalië","Spanje","Sri Lanka","Sudan","Syrie","Tadzjikistan","Taiwan","Thailand","Tobago","Tsjechië","Tsjaad","Tunesië","Turkije","Turkmenistan","Trinidad","Uganda","Ukraine","Uruguay","Venezuela","Verenigd Koninkrijk","Verenigde Staten","Vietnam","Zaïre","Zambia","Zimbabwe","Zuid-Afrika","Zweden","Zwitserland"],
      deleteDialog: false,
      valid: false,
      snackbar: false,
      nameRules: [
        v => (v || '').length <= 64 || 'Mag maximum 64 tekens bevatten'
      ],
      tvaRules: [
        v => (v || '').length <= 14 || 'Mag maximum 14 tekens bevatten'
      ],
      required: [
        v => !!v || 'Dit veld is verplicht'
      ],
      emailRules: [
        v => (v || '').length <= 64 || 'Mag maximum 64 tekens bevatten'
      ],
      phoneRules: [
        v => !!v || 'Dit veld is verplicht',
        v => (v || '').length <= 16 || 'Mag maximum 16 tekens bevatten',
        v => v || /^\+[1-9]\d{1,14}$/.test(v) || 'Geef een geldig Telefoonnummer'
      ],
      length8: [
        v => !!v || 'Dit veld is verplicht',
        v => (v || '').length <= 16 || 'Mag maximum 8 tekens bevatten',
      ],
      length16: [
        v => !!v || 'Dit veld is verplicht',
        v => (v || '').length <= 16 || 'Mag maximum 16 tekens bevatten',
      ],
      length32: [
        v => !!v || 'Dit veld is verplicht',
        v => (v || '').length <= 32 || 'Mag maximum 32 tekens bevatten',
      ],
    };
  },
  methods: {
    validate () {
      if (this.$refs.form.validate()) {
        this.snackbar = true
      }
    },
    async createCustomer() {
      this.errored = false;
      try {
        const response = await customerAPI.postCustomer(this.customer);
        console.log(response);
        this.$emit('update-horse', response.data);
        this.$router.push(`/customer/${response.data._id}`);
        this.snackbar = true;
      } catch (err) {
        console.log(err);
        this.errored = true;
        this.errorMessage = err.response.data.message;
      }
    },
    async updateCustomer() {
      this.errored = false;
      try {
        const response = await customerAPI.putCustomer(this.customer);
        this.$emit('update-customer', response.data);
        this.snackbar = true;
      } catch (err) {
        this.errored = true;
        this.errorMessage = err.response.data.message;
      }
    },
    async deleteCustomer() {
      this.errored = false;
      try {
        await customerAPI.deleteCustomer(this.customer._id);
        this.$emit('close-dialog',false);
        this.$router.push('/customer/');
      } catch (err) {
        this.errored = true;
        this.errorMessage = err.response.data.message;
      }
    },
  }
}
</script>
