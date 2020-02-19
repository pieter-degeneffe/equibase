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
          Gebruik het menu om doorheen de verschillende opties te navigeren.
        </v-card-text>
      </v-card>
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
      }
    }
  }
</script>
