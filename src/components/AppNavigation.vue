<template>
  <div>
    <v-navigation-drawer app v-model="drawer">
      <v-list-item v-for="menuItem in menu" :key="menuItem.title" :to="menuItem.url">
        <v-list-item-icon>
          <v-icon>{{ menuItem.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>
            <router-link to="home">
              {{ menuItem.title }}
            </router-link>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-navigation-drawer>
    <v-toolbar flat dense color="primary" dark>
      <v-app-bar-nav-icon
        @click.stop="drawer = !drawer"
        class="hidden-md-and-up"
      ></v-app-bar-nav-icon>
      <router-link to="/" id="homelink">
        <v-toolbar-title>{{ this.$appName }}</v-toolbar-title>
      </router-link>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn
          text
          v-for="menuItem in menu"
          :key="menuItem.title"
          :to="menuItem.url"
          class="hidden-sm-and-down"
          v-show="isLoggedIn()"
          >{{ menuItem.title }}</v-btn
        >
        <v-btn text v-show="isLoggedIn()" @click="handleLogout()">Log out </v-btn>
        <v-btn text v-show="!isLoggedIn()" @click="handleLogin()" dark>Log In</v-btn>
      </v-toolbar-items>
    </v-toolbar>
  </div>
</template>

<script>
import { isLoggedIn, login, logout } from '@/services/auth';
export default {
  name: "Navigation",
  data() {
    return {
      drawer: false,
      menu: [
        {
          title: "Paarden",
          url: "/horse",
          icon: "mdi-chess-knight"
        },
        {
          title: "Klanten",
          url: "/customer",
          icon: "mdi-account"
        }
      ]
    };
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
  }
};
</script>
<style lang="css">
header a#homelink {
  color: #FFF;
  text-decoration: none;
}
</style>
