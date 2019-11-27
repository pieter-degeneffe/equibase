<template>
  <!-- <v-card class="ma-5" outlined>
    <v-tabs>
      <v-tab key="i" href="`#tab-${i}`">
        Persoonlijke gegevens
      </v-tab>
      <v-tab>
        Paarden
      </v-tab>
      <v-tab-item>
        <v-toolbar flat color="blue-grey" dark>
          <v-toolbar-title>{{ customer.first_name | capitalize }} {{ customer.last_name | capitalize }}</v-toolbar-title>
        </v-toolbar>
        <v-form>
          <v-container fluid>
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field v-model="customer.first_name" :counter="128" label="Voornaam" required outlined></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-model="customer.last_name" :counter="128" label="Achternaam" required outlined></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="4">
                <v-btn color="success" class="mr-4" @click="saveCustomer()" depressed>
                  Opslaan
                </v-btn>
              </v-col>
            </v-row>
            {{ customer.first_name }}
          </v-container>
        </v-form>
        <v-divider></v-divider>
        <v-card-actions dense>
          <v-list-item class="grow">
            <v-row align="center" justify="end">
              <v-icon class="mr-1">mdi-calendar-month</v-icon>
              <span class="subheading mr-2">{{ new Date(customer.createdAt) | dateFormat('DD/MM/YY') }}</span>
            </v-row>
          </v-list-item>
        </v-card-actions>
      </v-tab-item>
      <v-tab-item>
        <p>Tab persoonlijke gegevens</p>
      </v-tab-item>
      <v-tab-item>
        <p>Tab paarden</p>
      </v-tab-item>
    </v-tabs>
  </v-card> -->
  <v-card class="ma-5" outlined>
      <v-toolbar flat color="primary" dark>
        <v-toolbar-title>{{ customer.first_name }} {{ customer.last_name }}</v-toolbar-title>
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
        <v-tab-item>
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
                <v-divider></v-divider>
                <v-row>
                  <v-col cols="12" md="3" sm="6">
                    <v-text-field v-model="customer.straatnaam" :counter="128" label="Straatnaam" outlined></v-text-field>
                  </v-col>
                  <v-col cols="12" md="3" sm="6">
                    <v-text-field v-model="customer.house_number" :counter="16" label="Huisnummer" outlined></v-text-field>
                  </v-col>
                  <v-col cols="12" md="3" sm="6">
                    <v-text-field v-model="customer.straatnaam" :counter="64" label="Postcode" outlined></v-text-field>
                  </v-col>
                  <v-col cols="12" md="3" sm="6">
                    <v-text-field v-model="customer.house_number" :counter="16" label="Gemeente" outlined></v-text-field>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row>
                  <v-col cols="12" md="4">
                    <v-btn color="success" class="mr-4" @click="saveCustomer()" depressed>
                      Klant Opslaan
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-card>
        </v-tab-item>
        <v-tab-item>
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
      languages: ["NL", "FR", "EN"]
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
      this.$router.push({ path: '/customer' })
    },
    onEnlargeText: function (enlargeAmount) {
      this.postFontSize += enlargeAmount
    }
  }
};
</script>

<style lang="css"></style>
