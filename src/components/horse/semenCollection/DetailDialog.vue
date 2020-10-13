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
                <td>{{ formatDate(props.item.createdAt) }}</td>
                <td class="d-print-none text-right">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon dark color="primary" @click="deleteModification(props.item)" v-on="on">mdi-delete</v-icon>
                    </template>
                    <span>Stockwijziging verwijderen</span>
                  </v-tooltip>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDialog">Sluiten</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import semenAPI from "@/services/SemenAPI.js";
import { formatDate } from "@/Helpers";

export default {
  props: ['semenCollection','detailDialog'],
  data() {
    return {
      headers: [
        { text: 'Type'},
        { text: 'Aantal rietjes'},
        { text: 'Datum'},
        { text: '', align: 'right', value: 'action', sortable: false, class: "d-print-none"}
      ],
      deleteSnackbar: false
    }
  },
  methods: {
    formatDate,
    closeDialog() {
      this.$emit('close-dialog',false)
    },
    async deleteModification(modification) {
      try {
        const { data } = await semenAPI.deleteSemenCollectionModification(this.semenCollection, modification);
        this.$emit('update-semen-collection', data);
      } catch (err) {
          this.errored = true;
          this.errorMessage = err.response.data.message;
        }
    }
  },
}
</script>
