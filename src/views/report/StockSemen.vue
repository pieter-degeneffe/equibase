<template>
  <v-card class="ma-5" outlined>
    <v-data-table  :items="semenCollections" item-key="name" :headers="headers" :items-per-page="10" :loading="loading" loading-text="Bezig met laden..." class="ma-5">
      <template v-slot:top>
        <v-row dense>
          <v-col cols="8" sm="6">
            <v-toolbar-title class="float-left">Rapport sperma dekhengsten</v-toolbar-title>
          </v-col>
          <v-col cols="4" sm="6">
            <div fixed right>
              <div class="float-right">
                <v-btn color="primary" dark @click="openFilterDialog" class="mr-2 d-print-none"><v-icon left>mdi-filter</v-icon>Filters</v-btn>
             </div>
           </div>
          </v-col>
        </v-row>
      </template>
      <template v-slot:no-data>
          Geen paarden gevonden
      </template>
      <template v-slot:item="props">
        <tr @click="openHorsePage(props.item.stallion._id)" @mouseover="mouseOver(true)" @mouseleave="mouseOver(false)">
          <td>{{ props.item.stallion.name }}</td>
          <td>{{ props.item.initial_inventory }}</td>
          <td>{{ props.item.current_inventory }}</td>
          <td>{{ new Date(props.item.createdAt) | dateFormat('DD/MM/YY')}}</td>
          <td>{{ props.item.type }}</td>
          <td>{{ props.item.location.container.name }} - Koker {{ props.item.location.tube }} - {{ props.item.location.position }}</td>
        </tr>
      </template>
    </v-data-table>
    <v-dialog v-model="filterDialog" max-width="490">
      <v-card>
        <v-card-text class="pt-5">
          <v-row dense>
            <v-col cols="12">
              <p>Type:</p>
              <v-checkbox v-model="type" label="Productie" value="Productie"></v-checkbox>
              <v-checkbox v-model="type" label="Import" value="Import"></v-checkbox>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="filterDialog = false">Sluiten</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>
<script>
import semenCollectionAPI from "@/services/SemenCollectionAPI.js";
export default {
  data() {
    return {
      semenCollections: [],
      type: ['Productie','Import'],
      loading: true,
      headers: [
        { text: 'Hengst'},
        { text: 'Initiële stock'},
        { text: 'Beschikbare stock'},
        { text: 'In stock sinds'},
        { text: 'Type'},
        { text: 'Locatie'}
      ],
      filterDialog: false,
    };
  },
  watch: {
    type: {
      handler() {
        this.getSemenCollections()
      },
      deep: true
    }
  },
  mounted() {
    this.getSemenCollections();
  },
  methods: {
    async getSemenCollections() {
      this.loading = true;
      try {
        const response = await semenCollectionAPI.getSemenCollection(this.URLParameters);
        this.semenCollections = response.data;
      } catch (err) {
        this.errored = true;
        this.errorMessage = err.response.data.message;
      } finally {
        this.loading = false;
      }
    },
    // totalIventoryOfStallion(stallion) {
    //   let collectionsOfStallion = this.semenCollections.filter(semenCollection => semenCollection.stallion.id === stallion._id);
    //   return collectionsOfStallion.reduce((acc, semenCollection) => acc + semenCollection.current_inventory, 0);
    // },
    openHorsePage(id){
      this.$router.push("/horse/" + id);
    },
    mouseOver(hoverState) {
      hoverState ? document.body.style.cursor = "pointer" : document.body.style.cursor = "default";
    },
    openFilterDialog() {
      this.filterDialog = true;
    },
  },
  computed: {
    URLParameters () {
      const URLParameters = {};
      if (this.type) URLParameters.type = this.type;
      return (URLParameters)
    }
  //   uniqueStallions() {
  //     return this.semenCollections.filter((semenCollection, index) => {
  //       const _semenCollection = JSON.stringify(semenCollection.stallion);
  //       return index === this.semenCollections.findIndex(semenCollection => {
  //         return JSON.stringify(semenCollection.stallion) === _semenCollection;
  //       })
  //     });
  //   }
  }
};
</script>
