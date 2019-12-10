<template>
  <div>
    <v-form ref="form">
      <v-container>
        <v-row>
          <v-col cols="12" md="4">
            <v-file-input v-model="file" show-size label="Paspoort"></v-file-input>
          </v-col>
        </v-row>
        <v-row justify="end">
          <v-btn color="success" class="mr-4" @click="submitPassport" depressed>
            Passpoort uploaden
          </v-btn>
        </v-row>
      </v-container>
    </v-form>
    {{ horse._id }}
  </div>
</template>
<script>
import horseAPI from "@/services/HorseAPI.js";
export default {
  props: ['horse'],
  data() {
    return {
      file: null
    };
  },
  methods: {
    async submitPassport() {
      try {
        let formData = new FormData();
        formData.append('file', this.file);
        //console.log(formData.file);
        await horseAPI.postPassport(this.horse._id, formData);
      } catch (e) {
        console.log(e);
      }
    }
  }
}
</script>
