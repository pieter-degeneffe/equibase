<template>
  <v-card flat>
    <v-form ref="form" v-model="valid">
      <v-card outlined class="ma-5">
        <v-toolbar flat dense light>
          <v-toolbar-title>Product informatie</v-toolbar-title>
        </v-toolbar>
        <v-divider/>
        <v-row class="ma-5">
          <v-col cols="12" md="4">
            <v-text-field
                :rules="required"
                v-model="product.name" label="Productnaam *"
                :loading="loading"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-select
                :rules="required" :items="types"
                v-model="product.type" label="Product type *"
                :loading="loading"/>
          </v-col>
          <v-col cols="12" md="4">
            <v-select
                :rules="required" :items="taxes"
                v-model="product.tax" label="Product tax *"
                :loading="loading"/>
          </v-col>
        </v-row>
        <v-row class="ma-5">
          <v-col cols="12" md="4">
            <v-text-field
                :rules="required" type="text"
                v-model="product.CNK" label="CNK *"
                :loading="loading"/>
          </v-col>
          <v-col cols="12" md="4">
            <v-select
                :rules="required" :items="units"
                v-model="product.outgoingUnit" label="Eenheid *"
                :loading="loading"/>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
                :rules="required" type="number" hint="dagen"
                v-model="product.waitingTime" label="Wachttijd *"
                :loading="loading"/>
          </v-col>
        </v-row>
        <v-row class="ma-5">
          <v-col cols="12" md="4">
            <v-text-field
                type="number" hint="prijs per manuele toediening" :rules="required"
                v-model="product.supplementAdministration" label="Supplement toediening"
                :loading="loading" prefix="€" placeholder="0.00"/>
          </v-col>
        </v-row>
      </v-card>
    </v-form>
    <v-alert type="error" v-if="errored">
      {{ errorMessage }}
    </v-alert>
    <v-snackbar v-model="snackbar">
      Product is succesvol opgeslagen
      <v-btn color="pink" text @click="snackbar = false">
        sluiten
      </v-btn>
    </v-snackbar>
    <div class="mr-2">
      <v-row justify="end" dense>
        <v-btn depressed color="gray" class="mr-4" @click="back()">
          <v-icon left>mdi-arrow-left</v-icon>
          terug
        </v-btn>
        <v-btn v-if="!product._id" :disabled="!valid" color="success" class="mr-4" @click="createProduct()" depressed>
          <v-icon left>mdi-content-save-outline</v-icon>
          Product opslaan
        </v-btn>
        <v-btn v-if="product._id" :disabled="!valid" color="success" class="mr-4" @click="editProduct()" depressed>
          <v-icon left>mdi-content-save-outline</v-icon>
          Product aanpassen
        </v-btn>
      </v-row>
    </div>
  </v-card>
</template>

<script>
  import { productsAPI, configAPI } from '@/services';

  export default {
    props: ['product', 'loading', 'callbackURL', 'disabled'],
    data() {
      return {
        errored: false,
        errorMessage: '',
        valid: false,
        snackbar: false,
        required: [v => !!v || 'Dit veld is verplicht'],
        types: [],
        taxes: [],
        units: []
      }
    },
    mounted() {
      this.getConfig();
    },
    methods: {
      async productHandler(data) {
        this.$emit('update-product', data);
        this.snackbar = true;
        await this.$router.push(this.callbackURL);
        this.errored = false;
      },
      async createProduct() {
        this.errored = false;
        try {
          const { data } = await productsAPI.postProduct(this.product);
          await this.productHandler(data);
        } catch (err) {
          this.errored = true;
          this.errorMessage = err.response.data.message;
        }
      },
      back() {
        this.$router.push(this.callbackURL);
      },
      async editProduct() {
        this.errored = false;
        try {
          const { data } = await productsAPI.putProduct(this.product);
          await this.productHandler(data);
        } catch (err) {
          this.errored = true;
          this.errorMessage = err.response.data.message;
        }
      },
      async getConfig() {
        this.errored = false;
        try {
          const { data: { types, tax, units } } = await configAPI.getProductConfig();
          this.types = types;
          this.taxes = tax;
          this.units = units;
        } catch (err) {
          this.errored = true;
          this.errorMessage = err.response.data.message;
        }
      }
    }
  }
</script>
<style>

</style>
