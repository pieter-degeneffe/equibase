<template>
  <v-card class="ma-5" outlined>
    <v-toolbar flat color="primary" dark>
      <v-toolbar-title>{{ customer.first_name | capitalize }} {{ customer.last_name | capitalize }}</v-toolbar-title>
    </v-toolbar>
    <v-tabs>
      <v-tab class="d-print-none">
        <v-icon left>mdi-book-open-variant</v-icon>
        Algemene gegevens
      </v-tab>
      <v-tab v-if="customer.type === 'bedrijf'" class="d-print-none">
        <v-icon left>mdi-account-box</v-icon>
        Contacten
      </v-tab>
      <v-tab class="d-print-none">
        <v-icon left>mdi-horseshoe</v-icon>
        Paarden
      </v-tab>
      <v-tab class="d-print-none">
        <v-icon left>mdi-sprout</v-icon>
        Embryos
      </v-tab>
      <v-tab-item class="ma-5">
        <v-card flat>
          <customer-form :customer="customer" :loading="loading" @update-customer="updateCustomer"/>
        </v-card>
      </v-tab-item>
      <v-tab-item class="ma-5" v-if="customer.type === 'bedrijf'">
        <v-card flat>
          <customer-contacts :customer="customer"/>
        </v-card>
      </v-tab-item>
      <v-tab-item class="ma-5">
        <v-card flat>
          <customer-horses :customer="customer"/>
        </v-card>
      </v-tab-item>
      <v-tab-item class="ma-5">
      <v-card flat>
        <embryo-table :customer-id="$route.params.id" showDonors="true" show-inactive="true" :action="exportEmbryo" actionLabel="Export"/>
      </v-card>
    </v-tab-item>
    </v-tabs>
  </v-card>
</template>

<script>
import customerAPI from "@/services/CustomerAPI.js";
import CustomerForm from "@/components/customer/Form";
import CustomerHorses from "@/components/customer/Horses";
import CustomerContacts from "@/components/customer/Contacts";
import EmbryoTable from '../../components/icsi/EmbryoTable';
import { icsiAPI } from '../../services';
export default {
  props: ["id"],
  data() {
    return {
      customer: "",
      loading: null
    };
  },
  watch: {
    '$route.params.id'(newId) {
        this.loadCustomer(newId);
    }
  },
  mounted() {
    if (this.id !== "undefined") this.loadCustomer(this.id);
    else this.customer = {};
  },
  methods: {
    async loadCustomer(id) {
      try {
        this.loading = true;
        const { data } = await customerAPI.getCustomer(id);
        this.customer = data;
      } catch(e) {
        console.log(e);
      } finally {
        this.loading = false;
      }
    },
    updateCustomer(customer) {
      this.customer = customer;
    },
    async exportEmbryo(embryoId, inHouse,exportDate) {
      await icsiAPI.exportEmbryo({
        embryoId,
        inHouse,
        customerId: this.id,
        exportDate,
      });
    },
  },
  components: {
    EmbryoTable,
    CustomerForm,
    CustomerHorses,
    CustomerContacts
  },
};
</script>

<style lang="css">
@media print {
  .v-tabs-bar {
    display: none !important;
    height: 0px !important;
  }
}
</style>
