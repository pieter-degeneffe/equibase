<template>
  <v-card class="ma-5" outlined>
    <v-toolbar flat color="primary" dark>
      <v-toolbar-title>{{ horse.name }} <v-icon v-if="horse.death">mdi-christianity</v-icon></v-toolbar-title>
    </v-toolbar>
    <v-tabs>
      <v-tab>
        <v-icon left>mdi-alpha-a-circle</v-icon>
        Algemene gegevens
      </v-tab>
      <v-tab v-if="horse._id">
        <v-icon left>mdi-alpha-p-circle</v-icon>
        Paspoort
      </v-tab>
      <v-tab v-if="horse._id && horse.stud_horse">
        <v-icon left>mdi-alpha-s-circle</v-icon>
        Sperma
      </v-tab>
      <v-tab-item class="ma-5">
        <horse-form :horse="horse" :loading="loading" @update-horse="updateHorse"></horse-form>
      </v-tab-item>
      <v-tab-item class="ma-5">
        <v-card flat>
          <horse-passport :horse="horse"></horse-passport>
        </v-card>
      </v-tab-item>
      <v-tab-item v-if="horse.stud_horse" class="ma-5">
        <v-card flat>
          <semen-collection :horse="horse"></semen-collection>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>
<script>
import horseAPI from "@/services/HorseAPI.js";
//import customerAPI from "@/services/CustomerAPI.js";
import horseForm from "@/components/horse/Form";
import horsePassport from "@/components/horse/Passport";
import semenCollection from "@/components/horse/semenCollection/SemenCollection";
export default {
  props: ["id"],
  data () {
    return {
      horse: {},
      loading: null
    }
  },
  watch: {
    date() {
      this.dateFormatted = this.formatDate(this.horse.date_of_birth)
    },
    '$route.params.id'(newId) {
        this.getHorses(newId);
    }
  },
  mounted() {
    if (this.id !== "undefined") this.getHorses(this.id);
    //if (this.id === "undefined" && this.$route.query.type) this.horse.type = this.$route.query.type;
    //if (this.id === "undefined" && this.$route.query.surrogate) this.horse.surrogate = this.$route.query.surrogate
    //this.loadLocations();
  },
  methods: {
    async getHorses(id) {
      this.loading = true;
      try {
        const horse = await horseAPI.getHorse(id);
        this.horse = horse.data;
        // if (this.horse.owner) {
        //   const owner = await customerAPI.getCustomer(this.horse.owner);
        //   this.owner = owner.data;
        // }
      } catch (err) {
        this.errored = true;
        this.errorMessage = err.response.data.message;
      } finally {
        this.loading = false;
      }
    },
    updateHorse(horse) {
      this.horse = horse;
    },
  },
  components: {
    horseForm,
    horsePassport,
    semenCollection
  },
};
</script>

<style lang="css"></style>
