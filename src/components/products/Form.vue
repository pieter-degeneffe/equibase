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
              :loading="loading" outlined></v-select>
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              :rules="required" :items="taxes"
              v-model="product.tax" label="Product tax"
              :loading="loading" outlined></v-select>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12" md="4">
            <v-text-field
              :rules="required" type="number"
              v-model="product.CNK" label="CNK"
              :loading="loading" outlined/>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              :rules="required" type="number"
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
    <v-container v-if="valid">
      <v-row justify="end" dense>
        <v-btn v-if="!product._id" :disabled="!valid" color="success" class="mr-4" @click="createProduct()" depressed>
          Product opslaan
        </v-btn>
        <v-btn v-if="product.id" :disabled="!valid" color="success" class="mr-4" @click="editProduct()" depressed>
          Product aanpassen
        </v-btn>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
  import productsAPI from '@/services/ProductsAPI';
  //import product from "@/views/settings/products/product";

  export default {
    props: ['product', 'loading'],
    data() {
      return {
        errored: false,
        errorMessage: '',
        valid: false,
        snackbar: false,
        required: [v => !!v || 'Dit veld is verplicht'],
        types: [],
        taxes: []
      }
    },
    mounted() {
      this.getConfig();
    },
    methods: {
      async createProduct() {
        this.errored = false;
        try {
          await productsAPI.postProduct(this.product);
          this.snackbar = true;
          await this.$router.push(`/settings/products`);
          this.errored = false;
        } catch (err) {
          this.errored = true;
          this.errorMessage = err.response.data.message;
        }
      },
      async editProduct() {
        this.errored = false;
        try {
          const response = await productsAPI.putProduct(this.product);
          this.$emit('update-product', response.data);
          await this.$router.push(`/settings/products`);
          this.errored = false;
        } catch (err) {
          this.errored = true;
          this.errorMessage = err.response.data.message;
        }
      },
      async getConfig() {
        this.errored = false;
        try {
          const { data: { types, tax } } = await productsAPI.getConfig();
          this.types = types;
          this.taxes = tax;
        } catch (err) {
          this.errored = true;
          this.errorMessage = err.response.data.message;
        }
      }
    }
  }
</script>