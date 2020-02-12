<template>
  <div>
    <v-data-table :headers="headers" :items="semenCollections" :loading="loading" loading-text="Bezig met laden..." class="ma-5">
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-spacer></v-spacer>
          <v-btn color="primary" dark  @click="openCreateDialog()" class="d-print-none">Sperma lot toevoegen</v-btn>
        </v-toolbar>
      </template>
      <template v-slot:no-data>
          Geen sperma loten gevonden
      </template>
      <template v-slot:item="props">
        <tr>
          <td>{{ props.item.stallion.name }}</td>
          <td>{{ ownerName(props.item.owner) }}</td>
          <td>{{ props.item.initial_inventory }}</td>
          <td>{{ props.item.current_inventory }}</td>
          <td>{{ new Date(props.item.production_date) | dateFormat('DD/MM/YY')}}</td>
          <td>
            <v-icon v-if="props.item.color" small class="mr-2" :class="strawColor(props.item.color)">mdi-checkbox-blank-circle</v-icon>
            {{ props.item.location.container.name }} - Koker {{ props.item.location.tube }} - {{ props.item.location.position }}
          </td>
          <td align='right' class="d-print-none">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon dark color="primary" @click="openDialog('create', props.item)" v-on="on" class="mr-2">mdi-pencil</v-icon>
              </template>
              <span>Lot bewerken</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon dark color="primary" @click="openDialog('edit', props.item)" v-on="on" class="mr-2">mdi-plus</v-icon>
              </template>
              <span>Stockwijzigingen toevoegen</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon dark color="primary" @click="openDialog('detail', props.item)" v-on="on" class="mr-2">mdi-magnify</v-icon>
              </template>
              <span>Bekijk stockwijzigingen</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon dark color="primary" @click="openDialog('delete', props.item)" v-on="on">mdi-delete</v-icon>
              </template>
              <span>Lot verwijderen</span>
            </v-tooltip>
          </td>
        </tr>
      </template>
    </v-data-table>
    <create-dialog v-if="dialogs.create" :horse="horse" :semenCollection="semenCollection" :createDialog="dialogs.create" @created-semen-collection="addSemenCollection" @update-semen-collection="updateSemenCollection" @close-dialog="dialogs.create = false"></create-dialog>
    <edit-dialog v-if="semenCollection" @update-semen-collection="updateSemenCollection" :semenCollection="semenCollection" :editDialog="dialogs.edit" @close-dialog="dialogs.edit = false"></edit-dialog>
    <detail-dialog v-if="semenCollection" :semenCollection="semenCollection" :detailDialog="dialogs.detail" @close-dialog="dialogs.detail = false"></detail-dialog>
    <delete-dialog v-if="semenCollection" @delete-semen-collection="deleteSemenCollection" :semenCollection="semenCollection" :deleteDialog="dialogs.delete" @close-dialog="dialogs.delete = false"></delete-dialog>
    <v-alert type="error" v-if="errored" >
      {{ errorMessage }}
    </v-alert>
  </div>
</template>
<script>
import semenAPI from "@/services/SemenAPI.js";
import editDialog from "@/components/horse/semenCollection/EditDialog";
import createDialog from "@/components/horse/semenCollection/CreateDialog";
import detailDialog from "@/components/horse/semenCollection/DetailDialog";
import deleteDialog from "@/components/horse/semenCollection/DeleteDialog";
export default {
  props: ['horse'],
  data() {
    return {
      dialogs: { create: false, edit: false, detail: false, delete: false },
      headers: [
        { text: 'Hengst', align: 'left', sortable: false},
        { text: 'Eigenaar sperma lot'},
        { text: 'Start stock'},
        { text: 'Eind stock'},
        { text: 'Productiedatum'},
        { text: 'locatie & kleur'},
        { text: '', align: 'right', value: 'action', sortable: false, class: "d-print-none"}
      ],
      loading: false,
      semenCollections: [],
      semenCollection: null,
      errored: false,
      errorMessage: '',
    };
  },
  beforeMount() {
    this.getSemenCollections();
  },
  computed: {
    URLParameters () {
      const URLParameters = {};
      if (this.horse._id) URLParameters.stallion = this.horse.id;
      return (URLParameters)
    },
  },
  methods: {
    async getSemenCollections() {
      this.loading = true;
      try {
        const response = await semenAPI.getSemenCollection(this.URLParameters);
        this.semenCollections = response.data;
      } catch (err) {
        this.errored = true;
        this.errorMessage = err.response.data.message;
      } finally {
        this.loading = false;
      }
    },
    addSemenCollection(semenCollection) {
      this.semenCollections.push(semenCollection);
    },
    updateSemenCollection(semenCollection) {
      const index = this.semenCollections.findIndex(x => x._id === semenCollection._id);
      this.semenCollections.splice(index, 1, semenCollection);
    },
    deleteSemenCollection(semenCollection) {
      const index = this.semenCollections.findIndex(x => x._id === semenCollection._id);
      this.semenCollections.splice(index, 1);
    },
    openDialog(dialogType, semenCollection) {
      this.dialogs[dialogType] = true;
      this.semenCollection = semenCollection;
    },
    ownerName(owner){
      return owner.type === "particulier" ? `${owner.first_name} ${owner.last_name}` : `${owner.company}`
    },
    strawColor(color) {
      switch(color) {
        case 'Rood': return "red--text";
        case 'Oranje': return "orange--text";
        case 'Geel': return "yellow--text";
        case 'Groen': return "green--text";
        case 'Blauw': return "blue--text";
        case 'Indigo': return "indigo--text";
        case 'Violet': return "purple-color";
      }
    }
  },
  components: {
    editDialog,
    createDialog,
    detailDialog,
    deleteDialog
  }
}
</script>
