<template>
  <v-card class="ma-5" outlined>
    <v-data-table :headers="headers" :items="customers" :loading="loading" loading-text="Bezig met laden..." class="ma-5">
      <template v-slot:top>
        <v-toolbar-title>Klanten</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
      </template>
      <template v-slot:no-data>
        Geen klanten in de database
      </template>
      <template v-slot:item="props">
        <tr @click="openCustomerPage(props.item._id)" @mouseover="mouseOver(true)" @mouseleave="mouseOver(false)">
          <td>{{ props.item.first_name | capitalize}} </td>
          <td>{{ props.item.last_name | capitalize}} </td>
          <td><span v-if="props.item.company">{{ props.item.company | capitalize}}</span> <span v-else class="grey--text"><em>particulier</em></span></td>
          <td align="right">{{ new Date(props.item.createdAt) | dateFormat('DD/MM/YY')}}</td>
        </tr>
      </template>
    </v-data-table>
    <v-btn bottom color="primary" class="ma-2 white--text" dark depressed @click="openCustomerPage()" fixed right>
      Klant toevoegen
      <v-icon right dark>mdi-plus</v-icon>
    </v-btn>
  </v-card>
</template>

<script>
import customerAPI from "@/services/CustomerAPI.js";
export default {
  data() {
    return {
      errored: false,
      loading: true,
      customers: [],
      headers: [
        { text: 'Voornaam', value: 'first_name', align: 'left', sortable: true },
        { text: 'Achternaam', value: 'last_name', align: 'left', sortable: true },
        { text: 'Bedrijf', value: 'company', align: 'left', sortable: true },
        { text: 'Aangemaakt op', value: 'company', align: 'right', sortable: false }
      ],
    };
  },
  mounted() {
    this.loadCustomers();
  },
  methods: {
    async loadCustomers() {
      try {
        const response = await customerAPI.getCustomers();
        this.customers= response.data;
      } catch (e) {
        this.errored = true;
      } finally {
        this.loading = false;
      }
    },
    openCustomerPage(id) {
      this.$router.push("/customer/" + id);
    },
    mouseOver(hoverState) {
      hoverState ? document.body.style.cursor = "pointer" : document.body.style.cursor = "default";
    }
  }
}
</script>
