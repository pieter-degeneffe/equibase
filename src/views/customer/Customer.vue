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
          <customerForm :customer="customer"></customerForm>
          <!-- <v-form ref="form" v-model="valid">
            <v-container fluid>
              <v-row>
                <v-col cols="12" md="4" sm="6">
                  <v-text-field v-model="customer.first_name" :counter="64" :rules="nameRules" label="Voornaam" required outlined></v-text-field>
                </v-col>
                <v-col cols="12" md="4" sm="6">
                  <v-text-field v-model="customer.last_name" :counter="64" :rules="nameRules" label="Achternaam" required outlined></v-text-field>
                </v-col>
                <v-col cols="12" md="4" sm="6">
                  <v-select v-model="customer.language" :rules="required" :items="languages" label="Taal" outlined></v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="4" sm="6">
                  <v-text-field v-model="customer.email" :counter="64" :rules="emailRules" label="E-mail adres" required outlined></v-text-field>
                </v-col>
                <v-col cols="12" md="4" sm="6">
                  <v-text-field v-model="customer.telehpone" :counter="16" :rules="phoneRules" label="Telefoonnummer" persistent-hint hint="voorbeeld: +32486688502" outlined></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="4" sm="6">
                  <v-text-field v-model="customer.straatnaam" :counter="32" :rules="length32" label="Straatnaam" outlined></v-text-field>
                </v-col>
                <v-col cols="12" md="4" sm="6">
                  <v-text-field v-model="customer.house_number" :counter="16" :rules="length16" label="Huisnummer" outlined></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="4" sm="6">
                  <v-text-field v-model="customer.zip" :counter="8" :rules="length8" label="Postcode" outlined></v-text-field>
                </v-col>
                <v-col cols="12" md="4" sm="6">
                  <v-text-field v-model="customer.city" :counter="32" :rules="length32" label="Gemeente" outlined></v-text-field>
                </v-col>
                <v-col cols="12" md="4" sm="6">
                  <v-select v-model="customer.country" :items="countries" :rules="required" label="Land" outlined></v-select>
                </v-col>
              </v-row>
              <v-row justify="end">
                  <v-btn v-if="!customer._id" :disabled="!valid" color="success" depressed class="mr-4" @click="createCustomer()">
                    Klant opslaan
                  </v-btn>
                  <v-btn v-if="customer._id" color="success" depressed class="mr-4" @click="updateCustomer()">
                    Klant bijwerken
                  </v-btn>
                  <v-btn v-if="customer._id" color="warning" depressed @click="deleteDialog = true">
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
          </v-form> -->
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
import customerForm from "@/components/CustomerForm";
export default {
  props: ["id"],
  data() {
    return {
      customer: "",
    };
  },
  mounted() {
    if (this.id !== "undefined") this.loadCustomer(this.id);
    else this.customer = {};
  },
  methods: {
    async loadCustomer(id) {
      const response = await customerAPI.getCustomer(id);
      this.customer = response.data;
    },
  },
  components: {
    customerForm
  },
};
</script>

<style lang="css"></style>
