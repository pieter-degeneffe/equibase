<template>
  <v-card class="ma-5" outlined>
    <v-toolbar flat color="blue-grey" dark>
      <v-toolbar-title>Klanten</v-toolbar-title>
    </v-toolbar>
    <v-simple-table fixed-header>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Naam</th>
            <th class="text-left">Paarden</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="customer in customers" :key="customer ._id" @click="openCustomerPage(customer._id)">
            <td>{{ customer.first_name }} {{ customer.last_name }}</td>
            <td>{{ customer.horses.length}}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </v-card>
</template>

<script>
import customerAPI from "@/services/CustomerAPI.js";
export default {
  data() {
    return {
      customers: [],
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
    }
  }
}
</script>

<style lang="css" scoped>
</style>
