<template>
  <v-container>
    <v-layout column>
      <v-flex class="display-2 text-xs-center my-5">Homepagina</v-flex>
      <v-flex>
        <p class="subheading mt-3">
          Dit is de homepagina van Equibase
        </p>
      </v-flex>
    </v-layout>
  </v-container>
  <!-- <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <div v-if="!$auth.loading">
      <button v-if="!$auth.isAuthenticated" @click="login">Log in</button>
      <button v-if="$auth.isAuthenticated" @click="logout">Log out</button>
      <br>
      <div>
        <button @click="callApi">Call</button>
        <p>Repons: {{ apiMessage }}</p>
      </div>
    </div>
  </div> -->
</template>

<script>
import axios from "axios";

export default {
  name: 'home',
  data() {
    return {
      apiMessage: ""
    };
  },
  methods: {
    login() {
      this.$auth.loginWithRedirect();
    },
    logout() {
      this.$auth.logout();
      this.$router.push({ path: "/" });
    },
    async callApi() {
      // Get the access token from the auth wrapper
      const token = await this.$auth.getTokenSilently();

      // Use Axios to make a call to the API
      const { data } = await axios.get("http://localhost:3001/api", {
        headers: {
          Authorization: `Bearer ${token}`    // send the access token through the 'Authorization' header
        }
      });

      this.apiMessage = data;
    }
  }
}
</script>
