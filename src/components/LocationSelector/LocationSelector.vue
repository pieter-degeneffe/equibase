<template>
  <v-row>
    <v-col cols="12" md="4">
      <v-select v-if="icsi.location" v-model="icsi.location.container"
                :items="nitrogenContainers" item-text="name" item-value="_id" label="Locatie - stikstof vat"
                outlined return-object required :rules="[(v) => !!v || 'Dit veld is verplicht']"></v-select>
    </v-col>
    <v-col cols="12" md="4">
      <v-select v-if="icsi.location.container" v-model="icsi.location.tube"
                :items="tubesAvailable(icsi.location.container)"
                label="Locatie - stikstof vat - koker" outlined required
                :rules="[(v) => !!v || 'Dit veld is verplicht']"></v-select>
    </v-col>
    <v-col cols="12" md="4">
      <v-select v-if="icsi.location.container" v-model="icsi.location.position"
                :items="nitrogenContainerPosition" label="Locatie - stikstof vat - koker - positie" outlined
                required :rules="[(v) => !!v || 'Dit veld is verplicht']"></v-select>
    </v-col>
  </v-row>
</template>

<script>
  export default {
    name: 'LocationSelector'
  };
</script>

<style scoped>

</style>
