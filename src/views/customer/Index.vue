<template>
  <v-card class="ma-5" outlined>
    <v-data-table
        :headers="headers"
        :items="customers"
        :server-items-length="totalCustomers"
        :options.sync="options"
        :loading="loading"
        :sort-by="sortBy"
        :sort-desc="sortDesc"
        loading-text="Bezig met laden..."
        class="ma-5"
    >
      <template v-slot:top>
        <v-toolbar-title>Klanten</v-toolbar-title>
        <v-divider class="mx-4" inset vertical />
      </template>
      <template v-slot:no-data>
        Geen klanten in de database
      </template>
      <template v-slot:item="props">
        <tr @click="openCustomerPage(props.item._id)" @mouseover="mouseOver(true)" @mouseleave="mouseOver(false)">
          <td>{{ props.item.first_name | capitalize }}</td>
          <td>{{ props.item.last_name | capitalize }}</td>
          <td>
            <span v-if="props.item.company">{{ props.item.company | capitalize }}</span>
            <span v-else class="grey--text"><em>particulier</em></span>
          </td>
          <td class="text-right">{{ formatDate(props.item.createdAt) }}</td>
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
import { formatDate } from "@/Helpers";
import customerAPI from "@/services/CustomerAPI.js";

export default {
  data() {
    return {
      errored: false,
      loading: true,
      customers: [],
      totalCustomers: 0,
      headers: [
        {text: 'Voornaam', value: 'first_name', align: 'left', sortable: true},
        {text: 'Achternaam', value: 'last_name', align: 'left', sortable: true},
        {text: 'Bedrijf', value: 'company', align: 'left', sortable: true},
        {text: 'Aangemaakt op', value: 'company', align: 'right', sortable: false}
      ],
      filteredHeaders: [],
      sortBy: 'last_name',
      sortDesc: false,
      options: {}
    };
  },
  created() {
    this.loadCustomers();
  },
  watch: {
    options: {
      handler() {
        this.loadCustomers();
      },
      deep: true
    }
  },
  computed: {
    URLParameters() {
      return {
        'page': this.options.page,
        'limit': this.options.itemsPerPage,
        'sortBy': this.options.sortBy,
        'sortDesc': this.options.sortDesc,
      };
    },
  },
  methods: {
    formatDate,
    async loadCustomers() {
      try {
        const {data: {customers, total}} = await customerAPI.getCustomers(this.URLParameters);
        this.customers = customers;
        this.totalCustomers = total;
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
