<template>
  <v-dialog v-model="deleteDialog" persistent max-width="500px">
    <v-card>
      <v-card-title>{{ item }} verwijderen</v-card-title>
      <v-card-text>
        <p>U staat op het punt om {{ this.deleteQueue.name }} te verwijderen.</p>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn color="blue darken-1" text @click="closeDeleteDialog">Annuleren</v-btn>
        <v-btn color="error" text @click="$emit('delete', deleteQueue)">Verwijderen</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "deleteDialog",
  props: ['deleteDialog', 'deleteQueue', 'item'],
  data() {
    return {

    }
  },
  methods: {
    closeDeleteDialog() {
      this.deleteDialog = false;
    },
  }
}
</script>

<style scoped>

</style>