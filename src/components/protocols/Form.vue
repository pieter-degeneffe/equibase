<template>
  <v-card flat>
    <v-form ref="form" v-model="valid">
      <v-card outlined class="ma-5">
        <v-toolbar flat dense light>
          <v-toolbar-title>Protocol informatie</v-toolbar-title>
        </v-toolbar>
        <v-divider/>
        <v-row class="ma-5">
          <v-col cols="12" md="4">
            <v-text-field
                :rules="required"
                v-model="protocol.name"
                label="Protocolnaam *"
                :loading="loading"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
                :rules="required"
                v-model="protocol.account"
                label="Protocol account *"
                :loading="loading"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-select
                :rules="required"
                :items="taxes"
                v-model="protocol.tax"
                label="Protocol tax *"
                :loading="loading"
                @click="getConfig"
            />
          </v-col>
        </v-row>
        <v-row class="ma-5">
          <v-col cols="12" md="4">
            <v-text-field
                :rules="required"
                type="number"
                v-model="protocol.price"
                label="Prijs *"
                :loading="loading"
                prefix="€" placeholder="0.00"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-switch
                :rules="required"
                v-model="protocol.fixedPrice"
                label="Vaste prijs *"
                :loading="loading"
            />
          </v-col>
        </v-row>
      </v-card>
      <v-card outlined class="ma-5">
        <v-toolbar flat dense light>
          <v-toolbar-title>Producten toevoegen</v-toolbar-title>
        </v-toolbar>
        <v-divider/>
        <v-row class="ma-5">
          <v-col cols="12">
            <SearchProduct
                @emit-product="addProduct"
            />
          </v-col>
        </v-row>
      </v-card>
    </v-form>
    <div class="mr-2">
      <v-row justify="end" dense>
        <v-btn depressed color="gray" class="mr-4" @click="back()">
          <v-icon left>mdi-arrow-left</v-icon>
          terug
        </v-btn>
        <v-btn v-if="!protocol._id" :disabled="!valid" color="success" class="mr-4" @click="createProtocol()" depressed>
          <v-icon left>mdi-content-save-outline</v-icon>
          Protocol opslaan
        </v-btn>
        <v-btn v-if="protocol._id" :disabled="!valid" color="success" class="mr-4" @click="editProtocol()" depressed>
          <v-icon left>mdi-content-save-outline</v-icon>
          Protocol aanpassen
        </v-btn>
      </v-row>
    </div>
    <v-alert type="error" v-if="errored">
      {{ errorMessage }}
    </v-alert>
    <v-snackbar v-model="snackbar">
      Protocol is succesvol opgeslagen
      <v-btn color="pink" text @click="snackbar = false">
        sluiten
      </v-btn>
    </v-snackbar>
  </v-card>
</template>

<script>
import {protocolAPI, configAPI} from '@/services';
import SearchProduct from "@/components/SearchProduct";

export default {
  components: {SearchProduct},
  props: ['protocol', 'loading', 'callbackURL', 'disabled'],
  data() {
    return {
      errored: false,
      errorMessage: '',
      valid: false,
      snackbar: false,
      required: [v => !!v || 'Dit veld is verplicht'],
      taxes: [],
    }
  },
  mounted() {
    console.log(this.protocol);
  },
  methods: {
    addProduct(item) {
      this.protocol.products.product.push(item);
      console.log(this.protocol.products);
    },
    async protocolHandler(data) {
      this.$emit('update-protocol', data);
      this.snackbar = true;
      await this.$router.push(this.callbackURL);
      this.errored = false;
    },
    async createProtocol() {
      this.errored = false;
      try {
        const {data} = await protocolAPI.postProtocol(this.protocol);
        await this.protocolHandler(data);
      } catch (err) {
        this.errored = true;
        this.errorMessage = err.response.data.message;
      }
    },
    back() {
      this.$router.push(this.callbackURL);
    },
    async editProtocol() {
      this.errored = false;
      try {
        const {data} = await protocolAPI.putProtocol(this.protocol);
        await this.protocolHandler(data);
      } catch (err) {
        this.errored = true;
        this.errorMessage = err.response.data.message;
      }
    },
    async getConfig() {
      this.errored = false;
      try {
        const {data: {tax}} = await configAPI.getProductConfig();
        this.taxes = tax;
      } catch (err) {
        this.errored = true;
        this.errorMessage = err.response.data.message;
      }
    }
  }
}
</script>
