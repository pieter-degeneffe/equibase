<template>
  <v-card class="ma-5" outlined>
    <v-toolbar flat color="blue-grey" dark>
      <v-toolbar-title>{{ customer.first_name | capitalize }} {{ customer.last_name | capitalize }}</v-toolbar-title>
    </v-toolbar>
    <v-form>
      <v-container>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field v-model="customer.first_name" :counter="128" label="Voornaam" required outlined></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field v-model="customer.last_name" :counter="128" label="Achternaam" required outlined></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
    <v-divider></v-divider>
    <v-card-actions dense>
      <v-list-item class="grow">
        <v-list-item-avatar color="grey darken-3">
          <v-img
            class="elevation-6"
            src="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light"
          ></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>Evan You</v-list-item-title>
        </v-list-item-content>

        <v-row
          align="center"
          justify="end"
        >
          <v-icon class="mr-1">mdi-heart</v-icon>
          <span class="subheading mr-2">256</span>
          <span class="mr-1">·</span>
          <v-icon class="mr-1">mdi-share-variant</v-icon>
          <span class="subheading">45</span>
        </v-row>
      </v-list-item>
    </v-card-actions>
    {{customer}}
  </v-card>
</template>

<script>
import customerAPI from "@/services/CustomerAPI.js";
export default {
  props: ["id"],
  data() {
    return {
      customer: "",
    };
  },
  mounted() {
    console.log(this.id);
    this.loadCustomer(this.id);
  },
  methods: {
    async loadCustomer(id) {
      const response = await customerAPI.getCustomer(id);
      this.customer = response.data;
    },
    async saveCustomer() {
      await customerAPI.putCustomer(this.customer);
    },
    async deleteCustomer() {
      await customerAPI.deleteCustomer(this.customer._id);
      this.$router.push({ path: '/customer' })
    },
  }
};
</script>

<style lang="css"></style>
