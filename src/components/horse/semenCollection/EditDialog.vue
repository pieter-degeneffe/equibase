<template>
  <div>
    <v-dialog v-model="editDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Details van het lot</span>
        </v-card-title>
        <v-card-text>
          {{ semenCollection }}
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: ['semenCollection','editDialog']
}
</script>
