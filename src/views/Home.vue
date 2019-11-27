<template>
  <v-container>
    <v-card outlined color="red" dark flat tile v-show="!isLoggedIn()" class="mb-2">
      <v-card-title>
        <v-icon large left>mdi-alert-box</v-icon>
        <span class="title font-weight-light">Login om toegang te krijgen tot {{ this.$appName }}</span>
      </v-card-title>
      <v-card-text>
        Om toegang te krijgen tot de {{ this.$appName }} applicatie moet je eerst ingelogd zijn
      </v-card-text>
      <v-card-actions>
        <v-btn depressed color="error" @click="handleLogin()">Inloggen</v-btn>
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
      <v-row>
        <v-col cols="12" md="4">
          <v-card class="pa-2" outlined flat tile>
            <v-card-title>
              <span class="title font-weight-light">Klanten</span>
            </v-card-title>
            <v-card-text>
              One of three columns
            </v-card-text>
            <v-card-actions>
              <v-btn depressed>Naar klanten</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card class="pa-2" outlined flat tile>
            <v-card-title>
              <span class="title font-weight-light">Klanten</span>
            </v-card-title>
            <v-card-text>
              One of three columns
            </v-card-text>
            <v-card-actions>
              <v-btn depressed>Naar klanten</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card class="pa-2" outlined flat tile>
            <v-card-title>
              <span class="title font-weight-light">Klanten</span>
            </v-card-title>
            <v-card-text>
              One of three columns
            </v-card-text>
            <v-card-actions>
              <v-btn depressed>Naar klanten</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>
<script>
  import { isLoggedIn, login, logout } from '@/services/auth';
  export default {
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
    }
  }
</script>
