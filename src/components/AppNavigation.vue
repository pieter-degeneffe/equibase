<template>
  <div class="d-print-none">
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
            <v-list-item v-for="(child, i) in item.submenu" :key="i" :to="child.url" class="pl-8">
              <v-list-item-content>
                <v-list-item-title>
                  {{ child.text }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
          <v-list-item v-else :key="item.text" :to="item.url">
            <v-list-item-content>
              <v-list-item-title>
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
      <template v-slot:append>
        <div class="pa-2">
          <v-btn block v-show="isLoggedIn()" @click="handleLogout()">Logout</v-btn>
        </div>
      </template>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="$vuetify.breakpoint.lgAndUp" app color="primary" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" v-show="isLoggedIn()"></v-app-bar-nav-icon>
      <v-toolbar-title style="width: 170px" class="ml-0 pl-3">
        <router-link to="/" id="homelink">
          {{ this.$appName }}
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <search v-if="isLoggedIn()"></search>
    </v-app-bar>
  </div>
</template>

<script>
import { isLoggedIn, login, logout } from '@/services/auth';
import search from "@/components/Search";
export default {
  name: "Navigation",
  data() {
    return {
      dialog: false,
      drawer: null,
      menu: [
        {
          text: "Klanten",
          url: "/customer",
          //icon: "mdi-alpha-k-circle"
          //icon: "mdi-contacts",
        },
        {
          text: "ICSI",
          url: "/icsi",
        },
        {
          text: "Stock",
          url: "/stock",
        },
        {
          text: "Paarden",
          //icon: "mdi-alpha-p-circle",
          //icon: "mdi-horseshoe",
          submenu: [
            {
              text: "Hengsten",
              url: "/horse/stallion",
            },
            {
              text: "Merries",
              url: "/horse/mare",
            },
            {
              text: "Draagmoeders",
              url: "/horse/surrogate",
            },
            {
              text: "Dekhengsten",
              url: "/horse/studhorse",
            }
          ]
        },
        {
          text: "Rapporten",
          //icon: "mdi-alpha-r-circle",
          //icon: "mdi-google-analytics",
          submenu: [
            {
              text: "Draagmoeders per locatie",
              url: "/report/location",
            },
            {
              text: "Overleden paarden",
              url: "/report/death-horses",
            },
            {
              text: "Stock sperma productie",
              url: "/report/stock-semen-production",
            },
            {
              text: "Stock sperma import",
              url: "/report/stock-semen-import",
            },
            {
              text: "Geleverde producten",
              url: "/report/delivered-products",
            },
            {
              text: "Uitgaande producten",
              url: "/report/outgoing-products",
            },
            {
              text: "Toegediende medicatie",
              url: "/report/applied-medication",
            },
          ]
        },
        {
          text: 'Beheer',
          //icon: "mdi-alpha-i-circle",
          //icon: "mdi-settings",
          submenu: [
            {
              text: "Locaties",
              url: "/settings/location",
            },
            {
              text: "Stikstof vaten",
              url: "/settings/nitrogen-container",
            },
            {
              text: "Onderzoeksfiches downloaden",
              url: "/settings/research-sheets",
            },
            {
              text: "Producten",
              url: "/settings/products",
            },
            {
              text: "Protocols",
              url: "/settings/protocols",
            },
          ]
        }
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
  },
  components: {
    search
  },
};
</script>
<style lang="css">
a#homelink {
  color: #FFF;
  text-decoration: none;
}
</style>
