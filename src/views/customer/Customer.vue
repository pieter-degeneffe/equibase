<template>
  <v-card class="ma-5" outlined>
    <v-toolbar flat color="primary" dark>
      <v-toolbar-title>{{ customer.first_name | capitalize }} {{ customer.last_name | capitalize }}</v-toolbar-title>
    </v-toolbar>
    <v-tabs>
      <v-tab>
        <v-icon left>mdi-book-open-variant</v-icon>
        Algemene gegevens
      </v-tab>
      <v-tab>
        <v-icon left>mdi-account-box</v-icon>
        Contacten
      </v-tab>
      <v-tab>
        <v-icon left>mdi-horseshoe</v-icon>
        Paarden
      </v-tab>
      <v-tab-item class="ma-5">
        <v-card flat>
          <customer-form :customer="customer"></customer-form>
        </v-card>
      </v-tab-item>
      <v-tab-item class="ma-5">
        <v-card flat>
          Hier komen de contactpersonen
          <!-- <customer-horses :customer="customer"></customer-horses> -->
        </v-card>
      </v-tab-item>
      <v-tab-item class="ma-5">
        <v-card flat>
          <customer-horses :customer="customer"></customer-horses>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>

<script>
import customerAPI from "@/services/CustomerAPI.js";
import CustomerForm from "@/components/CustomerForm";
import CustomerHorses from "@/components/CustomerHorses";
export default {
  props: ["id"],
  data() {
    return {
      customer: "",
    };
  },
  mounted() {
    if (this.id !== "undefined") this.loadCustomer(this.id);
    else this.customer = {};
  },
  methods: {
    async loadCustomer(id) {
      const response = await customerAPI.getCustomer(id);
      this.customer = response.data;
    },
  },
  components: {
    CustomerForm,
    CustomerHorses
  },
};
</script>

<style lang="css"></style>
