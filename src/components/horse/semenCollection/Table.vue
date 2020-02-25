<template>
  <div>
    <v-data-table :headers="headers" :items="filteredSemenCollections()" :loading="loading" loading-text="Bezig met laden..." class="ma-5">
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-spacer></v-spacer>
          <v-btn color="primary" dark  @click="openDialog('create')" class="mr-2 d-print-none">Sperma lot toevoegen</v-btn>
          <v-btn color="primary" dark @click="filterDialog = true" class="d-print-none"><v-icon left>mdi-filter</v-icon>Filters</v-btn>
        </v-toolbar>
      </template>
      <template v-slot:no-data>
          Geen sperma loten gevonden
      </template>
      <template v-slot:item="props">
        <tr>
          <td><b>{{ props.item.stallion.name }}</b></td>
          <td>{{ ownerName(props.item.owner) }}</td>
          <td>{{ props.item.initial_inventory }}</td>
          <td>{{ props.item.current_inventory }}</td>
          <td><span v-if="props.item.production_date">{{ new Date(props.item.production_date) | dateFormat('DD/MM/YY')}}</span></td>
          <td>
            <v-icon v-if="props.item.color" small class="mr-2" :class="strawColor(props.item.color)">mdi-checkbox-blank-circle</v-icon>
            {{ props.item.location.container.name }} - Koker {{ props.item.location.tube }} - {{ props.item.location.position }}
          </td>
          <td>{{ props.item.type }}</td>
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
        <template v-if="showModifications">
          <tr class="modification" v-for="modification in props.item.modifications" v-bind:key="modification._id">
            <td colspan="2" class="pl-8">Stockwijziging</td>
            <td>{{ modification.amount }}</td>
            <td>&nbsp;</td>
            <td>{{ new Date(modification.createdAt) | dateFormat('DD/MM/YY')}}</td>
            <td>&nbsp;</td>
            <td>{{ modification.type }}</td>
            <td>&nbsp;</td>
          </tr>
        </template>
      </template>
    </v-data-table>
    <create-dialog v-if="dialogs.create" :horse="horse" :semenCollection="semenCollection" :createDialog="dialogs.create" @created-semen-collection="addSemenCollection" @update-semen-collection="updateSemenCollection" @close-dialog="dialogs.create = false"></create-dialog>
    <edit-dialog v-if="semenCollection" @update-semen-collection="updateSemenCollection" :semenCollection="semenCollection" :editDialog="dialogs.edit" @close-dialog="dialogs.edit = false"></edit-dialog>
    <detail-dialog v-if="semenCollection" @update-semen-collection="updateSemenCollection" :semenCollection="semenCollection" :detailDialog="dialogs.detail" @close-dialog="dialogs.detail = false"></detail-dialog>
    <delete-dialog v-if="semenCollection" @update-semen-collection="updateSemenCollection" @delete-semen-collection="deleteSemenCollection" :semenCollection="semenCollection" :deleteDialog="dialogs.delete" @close-dialog="dialogs.delete = false"></delete-dialog>
    <v-alert type="error" v-if="errored" >
      {{ errorMessage }}
    </v-alert>
    <v-dialog v-model="filterDialog" max-width="490">
      <v-card>
        <v-card-text class="pt-5">
          <v-row dense>
            <v-col cols="12">
              <v-switch v-model="showModifications" label="Toon stockwijzigingen"></v-switch>
            </v-col>
            <v-col cols="12">
              <v-select clearable v-model="filters.type.value" outlined label="Filter op type lot" :items="filters.type.options" hide-details></v-select>
            </v-col>
            <v-col cols="12">
              <v-select clearable v-model="filters.modificationType.value" outlined label="Filter op type stockwijzigingen" :items="filters.modificationType.options" hide-details></v-select>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="filterDialog = false">Sluiten</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
        { text: 'Start'},
        { text: 'Eind'},
        { text: 'Datum'},
        { text: 'Locatie & kleur'},
        { text: 'Type'},
        { text: '', align: 'right', value: 'action', sortable: false, class: "d-print-none"}
      ],
      filters: {
        type: {
          options: ['Productie','Import'],
          value: null
        },
        modificationType: {
          options: ['Export','Controle'],
          value: null
        }
      },
      loading: false,
      semenCollections: [],
      semenCollection: null,
      errored: false,
      errorMessage: '',
      filterDialog: false,
      showModifications: false
    };
  },
  watch: {
    filters: {
      handler() {
        this.getSemenCollections()
      },
      deep: true
    }
  },
  beforeMount() {
    this.getSemenCollections();
  },
  computed: {
    URLParameters () {
      const URLParameters = {};
      if (this.horse._id) URLParameters.stallion = this.horse.id;
      if (this.filters.type.value) URLParameters.type = this.filters.type.value;
      if (this.filters.modificationType.value) URLParameters.modificationType = this.filters.modificationType.value;
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
      this.semenCollection = this.semenCollections[index];
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
    },
    filteredSemenCollections() {
      if(this.filters.modificationType.value) {
        return this.semenCollections.filter(collection => collection.modifications.length > 0)
      }
      return this.semenCollections
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
<style>
tr.collection td {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
tr.modification td {
  border-bottom: 1px dashed #E0E0E0 !important;
  height: 24px !important;
  color: grey;
}
</style>
