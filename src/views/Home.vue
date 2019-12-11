<template>
  <v-container>
    <v-card outlined color="red" dark flat tile v-show="!isLoggedIn()" class="mb-2">
      <v-card-title>
        <v-icon large left>mdi-alert-box</v-icon>
        <span class="title font-weight-light">Login om toegang te krijgen</span>
      </v-card-title>
      <v-card-text>
        Om toegang te krijgen tot {{ this.$appName }} moet je eerst ingelogd zijn
      </v-card-text>
      <v-card-actions>
        <v-btn depressed  @click="handleLogin()">Inloggen</v-btn>
      </v-card-actions>
    </v-card>
    <div v-show="isLoggedIn()">
      <v-card outlined flat tile class="mb-2">
        <v-card-title>
          <span class="title font-weight-light">Welkom in de {{ this.$appName }} applicatie</span>
        </v-card-title>
        <v-card-text>
          Gebruik het menu om doorheen de verschillende opties te navigeren
        </v-card-text>
      </v-card>
      <!-- <v-row>
        <v-col cols="12" md="6">
          <v-card class="pa-2" outlined flat tile>
            <v-card-title>
              <span class="title font-weight-light">Klanten</span>
            </v-card-title>
            <v-list dense>
              <v-list-item-group>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-check</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>{{ customerCount }} Klant<span v-if="customerCount > 1">en</span> in de database</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
            <v-card-actions>
              <v-btn depressed to="/customer">Naar klanten</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card class="pa-2" outlined flat tile>
            <v-card-title>
              <span class="title font-weight-light">Paarden</span>
            </v-card-title>
            <v-list dense>
              <v-list-item-group>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-check</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>{{ horseCount }} Paard<span v-if="horseCount > 1">en</span> in de database</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
            <v-card-actions>
              <v-btn depressed to="/horse">Naar paarden</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row> -->
    </div>
  </v-container>
</template>
<script>
  import { isLoggedIn, login, logout } from '@/services/auth';
  import customerAPI from "@/services/CustomerAPI.js";
  import horseAPI from "@/services/HorseAPI.js";
  export default {
    data() {
      return {
        customerCount: "",
        horseCount: ""
      };
    },
    mounted() {
      this.getCustomerCount();
      this.getHorseCount();
    },
    methods: {
      handleLogin() {
        login();
      },
      handleLogout() {
        logout();
      },
      isLoggedIn() {
        return isLoggedIn();
      },
      async getCustomerCount() {
        const response = await customerAPI.getCustomerCount();
        this.customerCount = response.data;
      },
      async getHorseCount() {
        const response = await horseAPI.getHorseCount();
        this.horseCount = response.data;
      },
    }
  }
</script>
