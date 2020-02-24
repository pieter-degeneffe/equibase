<template>
  <div>
    <v-form ref="form">
      <v-container>
        <template v-if="!horse.passport">
          <v-row>
            <v-col cols="12" md="4">
              <v-file-input v-model="file" show-size label="Paspoort"></v-file-input>
            </v-col>
          </v-row>
          <v-row justify="end" v-if="file">
            <v-btn color="success" class="mr-4" @click="createPassport" depressed>
              Passpoort uploaden
            </v-btn>
          </v-row>
        </template>
        <template v-else>
          <v-row>
            <v-btn color="primary" class="ma-2 white--text" :href="passportLink" target="_blank">
              Passpoort bekijken
              <v-icon right dark>mdi-passport</v-icon>
            </v-btn>
            <v-btn color="warning" class="ma-2 white--text" @click="deletePassport()" target="_blank">
              Passpoort verwijderen
            </v-btn>
          </v-row>
        </template>
      </v-container>
    </v-form>
  </div>
</template>
<script>
import horseAPI from "@/services/HorseAPI.js";
export default {
  props: ['horse'],
  data() {
    return {
      file: null,
      baseURL: process.env.VUE_APP_API_BASE_URL
    };
  },
  methods: {
    async createPassport() {
      try {
        let formData = new FormData();
        formData.append('file', this.file);
        const response = await horseAPI.postPassport(this.horse._id, formData);
        this.horse = response.data;
      } catch (e) {
        console.log(e);
      }
    },
    async deletePassport() {
      try {
        const response = await horseAPI.deletePassport(this.horse);
        this.horse = response.data;
      } catch (e) {
        console.log(e);
      }
    }
  },
  computed: {
    passportLink () {
      return `${this.baseURL}/public/${this.horse.passport}`;
    },
  }
}
</script>
