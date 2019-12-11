<template>
  <div>
    <v-navigation-drawer v-if="isLoggedIn()" v-model="drawer" :clipped="$vuetify.breakpoint.lgAndUp" app>
      <v-list dense>
        <template v-for="item in menu">
          <v-list-group v-if="item.submenu" :key="item.text" :prepend-icon="item.icon" v-model="item.model">
            <template v-slot:activator>
              <v-list-item class="pl-0">
                <v-list-item-content>
                  <v-list-item-title>
                    {{ item.text }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
            <v-list-item v-for="(child, i) in item.submenu" :key="i" :to="child.url">
              <v-list-item-action v-if="child.icon">
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  {{ child.text }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
          <v-list-item v-else :key="item.text" :to="item.url">
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>
    <!-- <v-navigation-drawer v-if="isLoggedIn()" v-model="drawer" :clipped="$vuetify.breakpoint.lgAndUp" app>
      <template v-for="(item, i) in menu">
        <v-list-item v-if="!item.submenu" :key="i" :to="item.url">
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              {{ item.text }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
      <template v-slot:append>
        <div class="pa-2">
          <v-btn block v-show="isLoggedIn()" @click="handleLogout()">Logout</v-btn>
          <v-btn block v-show="!isLoggedIn()" @click="handleLogin()">Login</v-btn>
        </div>
      </template>
    </v-navigation-drawer> -->
    <v-app-bar :clipped-left="$vuetify.breakpoint.lgAndUp" app color="blue darken-3" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" v-show="isLoggedIn()"></v-app-bar-nav-icon>
      <v-toolbar-title style="width: 300px" class="ml-0 pl-3">
        <router-link to="/" id="homelink">
          {{ this.$appName }}
        </router-link>
      </v-toolbar-title>
      <!-- <v-text-field flat solo-inverted hide-details prepend-inner-icon="mdi-magnify" label="Search" class="hidden-sm-and-down"></v-text-field> -->
      <!-- <v-spacer></v-spacer> -->
    </v-app-bar>
  </div>
</template>

<script>
import { isLoggedIn, login, logout } from '@/services/auth';
export default {
  name: "Navigation",
  data() {
    return {
      drawer: true,
      menu: [
        {
          text: "Klanten",
          url: "/customer",
          icon: "mdi-contacts",
        },
        {
          text: "Paarden",
          icon: "mdi-horseshoe",
          submenu: [
            {
              text: "Hengsten",
              url: "/horse/stallion",
              icon: "mdi-gender-male"
            },
            {
              text: "Merries",
              url: "/horse/mare",
              icon: "mdi-gender-female"
            }
          ]
        },
        // { text: 'Instellingen', url: "/settings", icon: 'mdi-settings'},
      ],
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
a#homelink {
  color: #FFF;
  text-decoration: none;
}
</style>
