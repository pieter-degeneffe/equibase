<template>
  <v-card>
    <v-card-title>
      {{ title }}
      <v-spacer></v-spacer>
      <v-btn color="primary" dark @click="openFilterDialog" class="mr-2 d-print-none"><v-icon left>mdi-filter</v-icon>Filters</v-btn>
      <v-btn color="primary" dark @click.stop="columnDialog = true" class="d-print-none"><v-icon left>mdi-settings</v-icon>Kolommen</v-btn>
    </v-card-title>
    <v-data-table :headers="filteredHeaders" :items="filteredHorses" :options.sync="options" :server-items-length="totalHorses" :loading="loading" class="ma-4" :sortBy="sortBy" :sortDesc="sortDesc" loading-text="Bezig met laden...">
      <template v-slot:no-data>
          Geen paarden gevonden
      </template>
      <template v-slot:item="props">
        <tr @click="openHorsePage(props.item._id)" @mouseover="mouseOver(true)" @mouseleave="mouseOver(false)">
          <td v-if="showColumn('name')">{{ props.item.name }}</td>
          <td v-if="showColumn('type')">{{ props.item.type }}</td>
          <td v-if="showColumn('location')"><span v-if="props.item.location">{{ props.item.location.name }}</span></td>
          <td v-if="showColumn('owner')"><span v-if="props.item.owner">{{ ownerName(props.item.owner) }}</span></td>
          <td v-if="showColumn('surrogate')"><v-icon v-if="props.item.surrogate" class="green--text">mdi-check</v-icon></td>
          <td v-if="showColumn('microchip')">{{ props.item.microchip }}</td>
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
            </v-col>
            <v-col cols="12">
              <v-select v-model="filters.location" outlined label="Filter op locatie" :items="locations" :item-text="item => item.stable +' - '+ item.name" return-object item-value="_id" multiple :loading="loadingLocations" hide-details></v-select>
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
    data () {
      return {
        sortDesc: true,
        sortBy: 'updatedAt',
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
        headers: [
          { text: 'Naam', value: 'name', align: 'left', sortable: true, selected: true },
          { text: 'Type', value: 'type', align: 'left', sortable: false, selected: true},
          { text: 'Locatie', value: 'location', align: 'left', sortable: true, selected: true},
          { text: 'Eigenaar', value: 'owner', align: 'left', sortable: true, selected: true},
          { text: 'Draagmoeder', value: 'surrogate', align: 'left', selected: false},
          { text: 'Microchip', value: 'microchip', align: 'left', selected: false},
          { text: 'Aangemaakt op', value: 'createdAt', selected: false },
          { text: 'Gewijzigd op', value: 'updatedAt', sortable: true, selected: true },
          { text: 'Geboortedatum', value: 'date_of_birth', selected: false}
        ],
        filters: {
          type: {
            options: ["hengst", "merrie"],
            value: null
          },
          surrogate: {
            value: null,
            label: null
          },
          location: null,
          owner: null
        }
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
          } else if (this.filters.type.value === 'hengsten') {
            title += 'Hengsten'
          }
        } else {
          title += 'Paarden'
        }
        if(this.filters.owner) {
          let ownerNames = this.filters.owner.map(owner => this.ownerName(owner));
          title += ' van ' + ownerNames.join(' en ');
        }
        if(this.filters.location) {
          let locationNames = this.filters.location.map(location => location.stable + " - " + location.name);
          title += ' op locatie ' + locationNames.join(' en ');
        }
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
        if (this.filters.type.value) URLParameters.type = this.filters.type.value;
        if (this.filters.location) URLParameters.location = this.filters.location.map(location => location._id);
        if (this.filters.owner) URLParameters.owner = this.filters.owner.map(owner => owner._id);
        if (this.filters.surrogate.value) URLParameters.surrogate = this.filters.surrogate.value;
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
        return owner.type === "particulier" ? `${owner.first_name} ${owner.last_name}` : `${owner.copany}`
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
