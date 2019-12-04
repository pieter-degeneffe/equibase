<template>
  <div>
    <v-navigation-drawer v-model="drawer" :clipped="$vuetify.breakpoint.lgAndUp" app>
      <v-list dense>
        <template v-for="item in menu">
          <v-list-item :key="item.text">
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
    <v-app-bar :clipped-left="$vuetify.breakpoint.lgAndUp" app color="blue darken-3" dark>
      <!-- <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon> -->
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title style="width: 300px" class="ml-0 pl-3">
        <span class="hidden-sm-and-down">{{ this.$appName }}</span>
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
      drawer: null,
      menu: [
        { text: "Klanten", url: "/customer", icon: "mdi-contacts" },
        { text: "Paarden", url: "/horse", icon: "mdi-chess-knight"},
        { text: 'Instellingen', url: "/settings", icon: 'mdi-settings'},
      ],
      items: [
        { icon: 'mdi-contacts', text: 'Contacts' },
        { icon: 'mdi-history', text: 'Frequently contacted' },
        { icon: 'mdi-content_copy', text: 'Duplicates' },
        {
          icon: 'mdi-keyboard_arrow_up',
          'icon-alt': 'mdi-keyboard_arrow_down',
          text: 'Labels',
          model: true,
          children: [
            { icon: 'mdi-add', text: 'Create label' },
          ],
        },
        {
          icon: 'mdi-keyboard_arrow_up',
          'icon-alt': 'mdi-keyboard_arrow_down',
          text: 'More',
          model: false,
          children: [
            { text: 'Import' },
            { text: 'Export' },
            { text: 'Print' },
            { text: 'Undo changes' },
            { text: 'Other contacts' },
          ],
        },
      { icon: 'mdi-settings', text: 'Settings' },
      { icon: 'mdi-chat_bubble', text: 'Send feedback' },
      { icon: 'mdi-help', text: 'Help' },
      { icon: 'mdi-phonelink', text: 'App downloads' },
      { icon: 'mdi-keyboard', text: 'Go to the old version' },
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
