<template>
  <div>
    <v-data-table :headers="headers" :items="semenCollections" :loading="loading" loading-text="Bezig met laden..." class="ma-5">
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-spacer></v-spacer>
          <create-dialog :horse="horse" @created-semen-collection="addSemenCollection"></create-dialog>
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
            <v-icon small @click="openDetailDialog(props.item)" class="mr-2">mdi-magnify</v-icon>
            <v-icon small @click="openEditDialog(props.item)">mdi-pencil</v-icon>
          </td>
        </tr>
      </template>
    </v-data-table>
    <edit-dialog v-if="semenCollection" @update-semen-collection="updateSemenCollection" :semenCollection="semenCollection" :editDialog="editDialog" @close-edit-dialog="closeEditDialog"></edit-dialog>
    <detail-dialog v-if="semenCollection" :semenCollection="semenCollection" :detailDialog="detailDialog" @close-edit-dialog="closeDetailDialog"></detail-dialog>
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
export default {
  props: ['horse'],
  data() {
    return {
      editDialog: false,
      detailDialog: false,
      headers: [
        { text: 'Hengst', align: 'left', sortable: false},
        { text: 'Eigenaar'},
        { text: 'Beginwaarde'},
        { text: 'Beschikbaar'},
        { text: 'Productiedatum'},
        { text: 'locatie & kleur'},
        { text: 'Bewerken', align: 'right', value: 'action', sortable: false, class: "d-print-none"}
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
      console.log(semenCollection.modifications);
      this.semenCollections[index].modifications = semenCollection.modifications;
      this.semenCollections[index].current_inventory = semenCollection.current_inventory;
    },
    openEditDialog(semenCollection) {
      this.editDialog = true;
      this.semenCollection = semenCollection;
    },
    openDetailDialog(semenCollection) {
      this.detailDialog = true;
      this.semenCollection = semenCollection;
    },
    closeDetailDialog(){
      this.detailDialog = false;
    },
    closeEditDialog(){
      this.editDialog = false;
    },
    ownerName(owner){
      return owner.type === "particulier" ? `${owner.first_name} ${owner.last_name}` : `${owner.company}`
    },
    strawColor(color) {
      //return 'red--text';
      switch(color) {
        case 'Rood':
          return "red--text";
        case 'Oranje':
          return "orange--text";
        case 'Geel':
          return "yellow--text";
        case 'Groen':
          return "green--text";
        case 'Blauw':
          return "blue--text";
        case 'Indigo':
          return "indigo--text";
        case 'Violet':
          return "purple-color";
      }
    }
  },
  components: {
    editDialog,
    createDialog,
    detailDialog
  }
}
</script>
