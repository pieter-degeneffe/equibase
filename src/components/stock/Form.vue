<template>
  <v-card flat>
    <v-form ref="form" v-model="valid">
      <v-container>
        <v-row dense>
          <v-col cols="12" md="4">
            <v-text-field
                :rules="required"
                v-model="product.name" label="Productnaam"
                :loading="loading" outlined/>
          </v-col>
          <v-col cols="12" md="4">
            <v-select
                :rules="required" :items="types"
                v-model="product.type" label="Product type"
                :loading="loading" outlined/>
          </v-col>
          <v-col cols="12" md="4">
            <v-select
                :rules="required" :items="taxes"
                v-model="product.tax" label="Product tax"
                :loading="loading" outlined/>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12" md="4">
            <v-text-field
                :rules="required" type="text"
                v-model="product.CNK" label="CNK"
                :loading="loading" outlined/>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
                :rules="required" type="text"
                v-model="product.outgoingUnit" label="outgoingUnit"
                :loading="loading" outlined/>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
                :rules="required" type="number"
                v-model="product.sellingPrice" label="sellingPrice"
                :loading="loading" outlined/>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12" md="4">
            <v-text-field
                :rules="required" type="number"
                v-model="product.sellingPricePerUnit" label="sellingPricePerUnit"
                :loading="loading" outlined/>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
                :rules="required" type="number"
                v-model="product.supplementAdministration" label="supplementAdministration"
                :loading="loading" outlined/>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
                :rules="required" type="number"
                v-model="product.waitingTime" label="waitingTime"
                :loading="loading" outlined/>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12" md="4">
            <v-text-field
                :rules="required" type="number"
                v-model="product.unitSellingPrice" label="unitSellingPrice"
                :loading="loading" outlined/>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
                :rules="required" type="number"
                v-model="product.unitAdministrationPrice" label="unitAdministrationPrice"
                :loading="loading" outlined/>
          </v-col>
        </v-row>
        <v-alert type="error" v-if="errored">
          {{ errorMessage }}
        </v-alert>
        <v-snackbar v-model="snackbar">
          Product is succesvol opgeslagen
          <v-btn color="pink" text @click="snackbar = false">
            sluiten
          </v-btn>
        </v-snackbar>
      </v-container>
    </v-form>
  </v-card>
</template>

<script>
import {configAPI} from "@/services";

export default {
  name: "Form",
  props: ['errored', 'errorMessage', 'loading', 'product'],
  data() {
    return {
      valid: false,
      required: [v => !!v || 'Dit veld is verplicht'],
      snackbar: false,
      types: [],
      taxes: [],
    };
  },
  mounted() {
    this.getConfig();
  },
  methods: {
    async getConfig() {
      this.errored = false;
      try {
        const { data: { types, tax } } = await configAPI.getProductConfig();
        this.types = types;
        this.taxes = tax;
      } catch (err) {
        this.errored = true;
        this.errorMessage = err.response.data.message;
      }
    },
  }
}
</script>

<style scoped>

</style>