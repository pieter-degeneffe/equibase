<template>
  <div>
    <v-dialog v-model="detailDialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Details van de stockwijzigingen aan dit lot</span>
        </v-card-title>
        <v-card-text>
          <v-data-table :headers="headers" :items="semenCollection.modifications">
            <template v-slot:no-data>
                Nog geen wijzigingen aan dit lot gevonden
            </template>
            <template v-slot:item="props">
              <tr>
                <td>{{ props.item.type }}</td>
                <td>{{ props.item.amount }}</td>
                <td>{{ new Date(props.item.createdAt) | dateFormat('DD/MM/YY')}}</td>
              </tr>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDialog">Annuleer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: ['semenCollection','detailDialog'],
  data() {
    return {
      headers: [
        { text: 'Type'},
        { text: 'Aantal rietjes'},
        { text: 'Datum'},
      ],
    }
  },
  methods: {
    closeDialog() {
      this.$emit('close-dialog',false)
    }
  },
}
</script>
