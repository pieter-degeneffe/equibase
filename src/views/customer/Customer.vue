<template>
  <v-card class="ma-5" outlined>
    <v-toolbar flat color="primary" dark>
      <v-toolbar-title>{{ customer.first_name | capitalize }} {{ customer.last_name | capitalize }}</v-toolbar-title>
    </v-toolbar>
    <v-tabs>
      <v-tab>
        <v-icon left>mdi-account</v-icon>
        Persoonlijke gegevens
      </v-tab>
      <v-tab>
        <v-icon left>mdi-horseshoe</v-icon>
        Paarden
      </v-tab>
      <v-tab-item class="ma-5">
        <v-card flat>
          <v-form>
            <v-container fluid>
              <v-row>
                <v-col cols="12" md="4" sm="6">
                  <v-text-field v-model="customer.first_name" :counter="128" label="Voornaam" required outlined></v-text-field>
                </v-col>
                <v-col cols="12" md="4" sm="6">
                  <v-text-field v-model="customer.last_name" :counter="128" label="Achternaam" required outlined></v-text-field>
                </v-col>
                <v-col cols="12" md="4" sm="6">
                  <v-select v-model="customer.language" :items="languages" label="Taal" outlined></v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="4" sm="6">
                  <v-text-field v-model="customer.email" :counter="128" label="E-mail adres" required outlined></v-text-field>
                </v-col>
                <v-col cols="12" md="4" sm="6">
                  <v-text-field v-model="customer.telehpone" :counter="64" label="Telefoonnummer" outlined></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="4" sm="6">
                  <v-text-field v-model="customer.straatnaam" :counter="128" label="Straatnaam" outlined></v-text-field>
                </v-col>
                <v-col cols="12" md="4" sm="6">
                  <v-text-field v-model="customer.house_number" :counter="16" label="Huisnummer" outlined></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="4" sm="6">
                  <v-text-field v-model="customer.zip" :counter="64" label="Postcode" outlined></v-text-field>
                </v-col>
                <v-col cols="12" md="4" sm="6">
                  <v-text-field v-model="customer.city" :counter="16" label="Gemeente" outlined></v-text-field>
                </v-col>
                <v-col cols="12" md="4" sm="6">
                  <v-select v-model="customer.country" :items="countries" label="Land" outlined></v-select>
                </v-col>
              </v-row>
              <v-row justify="end">
                  <v-btn color="success" depressed class="mr-4" @click="saveCustomer()">
                    Klant opslaan
                  </v-btn>
                  <v-btn color="warning" depressed @click="deleteDialog = true">
                    Klant verwijderen
                  </v-btn>
                  <v-dialog v-model="deleteDialog" persistent max-width="350">
                    <v-card>
                      <v-card-title class="headline">Klant verwijderen?</v-card-title>
                      <v-card-text>Ben je zeker dat je de klant {{ customer.first_name }} {{ customer.last_name }} wilt verwijderen? Dit kan niet meer ongedaan gemaakt worden</v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="success" depressed @click="deleteDialog = false">Annuleren</v-btn>
                        <v-btn color="error" depressed @click="deleteCustomer()">Verwijderen</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
              </v-row>
            </v-container>
          </v-form>
        </v-card>
      </v-tab-item>
      <v-tab-item class="ma-5">
        <v-card flat>
          <v-card-text>
            <p>Hier komt een overzicht van de paarden</p>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>

<script>
import customerAPI from "@/services/CustomerAPI.js";
export default {
  props: ["id"],
  data() {
    return {
      customer: "",
      languages: ["NL", "FR", "EN"],
      countries: ["Afghanistan","Albanië","Algerije","Andorra","Angola","Antigua-Barbuda","Argentinië","Armenië","Aruba","Australië","Azerbaijan","Bahamas","Bahrein","Belize","België","Bermuda","Bolivia","Bosnië-Herzegovina","Botswana","Brazilië","Brunei Darussalam","Bulgarije","Burundi","Cambodja",
      "Cameroen","Canada","Cayman Eilanden","Centraal-Afrikaanse Republiek","Chili","China","Ciprus","Colombia","Congo","Cook Eilanden","Costa Rica","Groatië","Cuba","Cyprus","Denemarken","Dominica","Dominicaanse Republiek","DR Congo","Duitsland","Ecuador","Egypte","El Salvador","Eritrea","Estland","Ethiopië","Fiji","Filipijnen","Finland","Frankrijk","Frans Polynesië","Gabon","Gambia","Georgië","Ghana","Griekenland","Groenland","Guam","Guatemala","Guinee-Bissau","Guyana","Haïti","Honduras","Hongarije","Ierland","IJsland","India","Indonesië","Irak","Iran","Israël","Italië","Ivoorkust","Jamaica","Japan","Jemen","Joegoslavië","Jordanië","Kameroen","Kazachstan","Kenya","Kirgizstan","Koeweit","Korea","Kroatië","Laos","Lesotho","Letland","Libanon","Liberia","Libië","Liechtenstein","Litouwen","Luxemburg","Macedonië","Maleisië","Mali","Malta","Marokko","Mauritanië","Mauritius","Mexico","Moldova","Monaco","Mozambique","Namibië","Nederland","Nepal","Nicaragua","Nieuw Zeeland","Niger","Nigeria","Noorwegen","Oezbekistan","Oman","Oostenrijk","Pakistan","Papoea-Nieuw-Guinea","Paraguay","Peru","Polen","Portugal","Puerto Rico","Quatar","Roemenië","Rusland","Rwanda","Saint Lucia","Salomonseilanden","San Marino","Saudi-Arabië","Schotland","Senegal","Sierra Leone","Singapore","Slovenië","Slowakije","Somalië","Spanje","Sri Lanka","Sudan","Syrie","Tadzjikistan","Taiwan","Thailand","Tobago","Tsjechië","Tsjaad","Tunesië","Turkije","Turkmenistan","Trinidad","Uganda","Ukraine","Uruguay","Venezuela","Verenigd Koninkrijk","Verenigde Staten","Vietnam","Zaïre","Zambia","Zimbabwe","Zuid-Afrika","Zweden","Zwitserland"],
      deleteDialog: false
    };
  },
  mounted() {
    this.loadCustomer(this.id);
  },
  methods: {
    async loadCustomer(id) {
      const response = await customerAPI.getCustomer(id);
      this.customer = response.data;
    },
    async saveCustomer() {
      console.log(this.customer);
      await customerAPI.putCustomer(this.customer);
    },
    async deleteCustomer() {
      await customerAPI.deleteCustomer(this.customer._id);
      this.$router.push({ path: '/customer' });
      this.dialog = false;
    }
  }
};
</script>

<style lang="css"></style>
