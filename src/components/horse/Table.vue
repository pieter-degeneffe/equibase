<template>
  <v-card class="mx-5 mt-5 mb-12" outlined>
    <v-data-table :headers="filteredHeaders" :items="filteredHorses" :options.sync="options" :server-items-length="totalHorses" :loading="loading" :sortBy="sortBy" :sortDesc="sortDesc" loading-text="Bezig met laden..." class="ma-5">
      <template v-slot:top>
       <v-row dense class="mx-1">
         <v-col cols="8" sm="6">
           <v-toolbar-title class="float-left">{{ title }}</v-toolbar-title>
         </v-col>
         <v-col cols="4" sm="6">
           <div fixed right>
             <div class="float-right">
               <v-btn color="primary" dark @click="openFilterDialog" class="mr-2 d-print-none"><v-icon left>mdi-filter</v-icon>Filters</v-btn>
               <v-btn color="primary" dark @click.stop="columnDialog = true" class="d-print-none"><v-icon left>mdi-settings</v-icon>Kolommen</v-btn>
            </div>
          </DIV>
         </v-col>
       </v-row>
    </template>
      <template v-slot:no-data>
          Geen paarden gevonden
      </template>
      <template v-slot:item="props">
        <tr @click="openHorsePage(props.item._id)" @mouseover="mouseOver(true)" @mouseleave="mouseOver(false)">
          <td v-if="showColumn('name')">{{ props.item.name }} <v-icon v-if="filters.death" class="grey--text" small>mdi-christianity</v-icon></td>
          <td v-if="showColumn('type')">{{ props.item.type }}</td>
          <td v-if="showColumn('surrogate_uid')">{{ props.item.surrogate_uid }}</td>
          <td v-if="showColumn('microchip')">{{ props.item.microchip }}</td>
          <td v-if="showColumn('location')"><span v-if="props.item.location">{{ props.item.location.name }}</span></td>
          <td v-if="showColumn('owner')"><span v-if="props.item.owner">{{ ownerName(props.item.owner) }}</span></td>
          <td v-if="showColumn('surrogate')"><v-icon v-if="props.item.surrogate" class="green--text">mdi-check</v-icon></td>
          <td v-if="showColumn('createdAt')">{{ new Date(props.item.createdAt) | dateFormat('DD/MM/YY')}}</td>
          <td v-if="showColumn('updatedAt')">{{ new Date(props.item.updatedAt) | dateFormat('DD/MM/YY')}}</td>
          <td v-if="showColumn('date_of_birth')"><span v-if="props.item.date_of_birth">{{ new Date(props.item.date_of_birth) | dateFormat('DD/MM/YY')}}</span></td>
        </tr>
      </template>
    </v-data-table>
    <v-dialog v-model="filterDialog" max-width="490">
      <v-card>
        <v-card-text class="pt-5">
          <v-row dense>
            <v-col cols="12">
              <v-select v-model="filters.type.value" outlined label="Filter op type paard" :items="filters.type.options" hide-details></v-select>
              <v-checkbox v-if="filters.type.value === 'merrie'" label="Toon enkel draagmoeders" v-model="filters.surrogate.value" class="mb-O"></v-checkbox>
              <v-checkbox v-if="filters.type.value === 'hengst'" label="Toon enkel dekhengsten" v-model="filters.stud_horse.value" class="mb-O"></v-checkbox>
            </v-col>
            <v-col cols="12">
              <v-select v-model="filters.location.options" outlined label="Filter op locatie" :items="locations" :item-text="item => item.stable +' - '+ item.name" return-object item-value="_id" multiple :loading="loadingLocations" hide-details></v-select>
            </v-col>
            <v-col cols="12">
              <v-autocomplete v-model="filters.owner" outlined label="Filter op eigenaar" :items="owners" :item-text="ownerName" return-object item-value="_id" multiple hide-details></v-autocomplete>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="filterDialog = false">Sluiten</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="columnDialog" max-width="690">
      <v-card>
        <v-card-text>
          <v-list>
            <v-row dense>
              <v-col cols="12" sm="6" md="4" v-for="header in headers" :key="header.text">
                <v-list-item>
                  <v-checkbox :label="header.text" v-model="header.selected" :value="header.selected" ></v-checkbox>
                </v-list-item>
              </v-col>
            </v-row>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="columnDialog = false">Sluiten</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-alert type="error" v-if="errored" >
      {{ errorMessage }}
    </v-alert>
  </v-card>
</template>
<script>
  import horseAPI from "@/services/HorseAPI.js";
  import locationAPI from "@/services/LocationAPI.js";
  import customerAPI from "@/services/CustomerAPI.js";
  export default {
    props: ['headers', 'filters', 'sortBy'],
    data () {
      return {
        sortDesc: true,
        filterDialog: false,
        columnDialog: false,
        totalHorses: 0,
        horses: [],
        locations: [],
        owners: [],
        loading: true,
        loadingLocations: false,
        options: {},
        errored: false,
        errorMessage: '',
      }
    },
    watch: {
      options: {
        handler () {
          this.getHorses()
        }
      },
      filters: {
        handler() {
          this.getHorses()
        },
        deep: true
      }
    },
    mounted () {
      this.getHorses()
    },
    computed: {
      title() {
        let title = '';
        if(this.filters.type.value) {
          if (this.filters.type.value === 'merrie') {
            if (this.filters.surrogate.value) {
              title += 'Draagmoeders'
            } else {
              title += 'Merries'
            }
          } else if (this.filters.type.value === 'hengst') {
            if (this.filters.stud_horse.value) {
              title += 'Dekhengsten'
            } else {
              title += 'Hengsten'
            }
          }
        } else {
          title += 'Paarden'
        }
        if(this.filters.owner) {
          let ownerNames = this.filters.owner.map(owner => this.ownerName(owner));
          title += ' van ' + ownerNames.join(' en ');
        }
        // if(this.filters.location && this.filters.location[0] !== true) {
        //   let locationNames = this.filters.location.map(location => location.stable + " - " + location.name);
        //   title += ' op locatie ' + locationNames.join(' en ');
        // }
        return (title);
      },
      filteredHeaders(){
        return this.headers.filter(header => header.selected)
      },
      filteredHorses(){
        return this.horses.map(horse => {
          let filtered = Object.assign({}, horse)
          this.headers.forEach(header => {
            if (!header.selected) delete filtered[header.value]
          })
          return filtered
        })
      },
      URLParameters () {
        const URLParameters = {
          'page': this.options.page,
          'limit': this.options.itemsPerPage,
          'sortBy': this.options.sortBy,
          'sortDesc': this.options.sortDesc
        }
        if (this.filters.death !== null) URLParameters.death = this.filters.death;
        if (this.filters.type.value) URLParameters.type = this.filters.type.value;
        if (this.filters.location.value) URLParameters.location = this.filters.location.value;
        if (this.filters.location.options) URLParameters.location = this.filters.location.options.map(location => location._id);
        if (this.filters.owner) URLParameters.owner = this.filters.owner.map(owner => owner._id);
        if (this.filters.surrogate.value !== null) URLParameters.surrogate = this.filters.surrogate.value;
        if (this.filters.stud_horse.value !== null) URLParameters.stud_horse = this.filters.stud_horse.value;
        return (URLParameters)
      }
    },
    methods: {
      openHorsePage(id){
        this.$router.push("/horse/" + id);
      },
      mouseOver(hoverState) {
        hoverState ? document.body.style.cursor = "pointer" : document.body.style.cursor = "default";
      },
      openFilterDialog() {
        this.filterDialog = true;
        this.getLocations();
        this.getOwners();
      },
      showColumn(col){
        return this.headers.find(header => header.value === col).selected
      },
      ownerName(owner){
        return owner.type === "particulier" ? `${owner.first_name} ${owner.last_name}` : `${owner.company}`
      },
      async getHorses() {
        this.loading = true;
        try {
          const response = await horseAPI.getHorses(this.URLParameters);
          this.horses = response.data.horses;
          this.totalHorses = response.data.total
        } catch (e) {
          this.errored = true;
          this.errorMessage = e.response.data.message;
        } finally {
          this.loading = false;
        }
      },
      async getLocations() {
        this.loadingLocations = true;
        try {
          const response = await locationAPI.getLocations();
          this.locations = response.data;
        } catch (e) {
          this.errored = true;
          this.errorMessage = e.response.data.message;
        } finally {
          this.loadingLocations = false;
        }
      },
      async getOwners() {
        try {
          const response = await customerAPI.getCustomers();
          this.owners = response.data;
        } catch (e) {
          this.errored = true;
          this.errorMessage = e.response.data.message;
        }
      },
    },
  }
</script>
