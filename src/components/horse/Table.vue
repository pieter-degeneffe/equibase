<template>
  <v-card class="mx-5 mt-5 mb-12" outlined>
    <v-toolbar flat>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer/>
      <FilterButton
          :toFilter="toFilter"
          :filters="filters"
          :columns=true
          :headers="headers"
          :products="horses"
          @emit-headers="updateFilteredHeaders"
      />
    </v-toolbar>
    <v-data-table
        :headers="filteredHeaders"
        :items="horses"
        :options.sync="options"
        :server-items-length="totalHorses"
        :loading="loading"
        :sortBy="sortBy"
        :sortDesc="sortDesc"
        loading-text="Bezig met laden..."
        class="ma-5"
    >
      <template v-slot:no-data>
        Geen paarden gevonden
      </template>
      <template v-slot:item="props">
        <tr @click="openHorsePage(props.item._id)" @mouseover="mouseOver(true)" @mouseleave="mouseOver(false)">
          <td v-if="showColumn('name')">{{ props.item.name }}
            <v-icon v-if="props.item.stud_horse === true" small>mdi-arm-flex</v-icon>
            <v-icon v-if="props.item.death" class="grey--text" small>mdi-christianity</v-icon>
          </td>
          <td v-if="showColumn('type')">{{ props.item.type }}</td>
          <td v-if="showColumn('surrogate_uid')">{{ props.item.surrogate_uid }}</td>
          <td v-if="showColumn('microchip')">{{ props.item.microchip }}</td>
          <td v-if="showColumn('location')">{{ props.item.location ? props.item.location.name : '-' }}</td>
          <td v-if="showColumn('owner')">{{ props.item.owner ? ownerName(props.item.owner) : '-'}}</td>
          <td v-if="showColumn('surrogate')">
            <v-icon v-if="props.item.surrogate" class="green--text">mdi-check</v-icon>
          </td>
          <td v-if="showColumn('createdAt')">{{ formatDate(props.item.createdAt) }}</td>
          <td v-if="showColumn('updatedAt')">{{ formatDate(props.item.updatedAt) }}</td>
          <td v-if="showColumn('date_of_birth')">{{ props.item.date_of_birth ? formatDate(props.item.date_of_birth) : '-' }}</td>
        </tr>
      </template>
    </v-data-table>
    <v-alert type="error" v-if="errored">
      {{ errorMessage }}
    </v-alert>
  </v-card>
</template>
<script>
import {ownerName, mouseOver, formatDate} from '@/Helpers';
import {horseAPI} from '@/services';
import FilterButton from "@/components/FilterButton";

export default {
  components: {FilterButton},
  props: ['headers', 'filters', 'toFilter', 'sortBy'],
  data() {
    return {
      sortDesc: true,
      filterDialog: false,
      columnDialog: false,
      totalHorses: 0,
      horses: [],
      locations: [],
      owners: [],
      totalOwners: 0,
      loading: true,
      loadingLocations: false,
      options: {},
      errored: false,
      errorMessage: '',
      filteredHeaders: [],
    }
  },
  watch: {
    options: {
      handler() {
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
  computed: {
    title() {
      let title = '';
      if (this.filters.death) {
        title += 'Overleden '
      }
      if (this.filters.type) {
        if (this.filters.type.value === 'merrie') {
          if (this.filters.surrogate) {
            title += 'Draagmoeders'
          } else {
            title += 'Merries'
          }
        } else if (this.filters.type.value === 'hengst') {
          if (this.filters.stud_horse) {
            title += 'Dekhengsten'
          } else {
            title += 'Hengsten'
          }
        }
      } else {
        title += 'Paarden'
      }
      if (this.filters.owner) {
        let ownerNames = this.filters.owner.map(owner => this.ownerName(owner));
        title += ` van ${ownerNames.join(' en ')}`;
      }
      return (title);
    },
    URLParameters() {
      return {
        'page': this.options.page,
        'limit': this.options.itemsPerPage,
        'sortBy': this.options.sortBy,
        'sortDesc': this.options.sortDesc,
        death: this.filters.death !== null ? this.filters.death : undefined,
        type: this.filters.type.value !== null ? this.filters.type.value : undefined,
        location: this.filters.location !== null ? this.filters.location : undefined,
        owner: this.filters.owner !== null ? this.filters.owner : undefined,
        surrogate: this.filters.surrogate === true ? this.filters.surrogate : undefined,
        stud_horse: this.filters.stud_horse === true ? this.filters.stud_horse : undefined,
      }
    }
  },
  methods: {
    formatDate,
    ownerName,
    mouseOver,
    openHorsePage(id) {
      this.$router.push(`/horse/${id}`);
    },
    updateFilteredHeaders(headers) {
      this.filteredHeaders = headers;
    },
    showColumn(col) {
      return this.headers.find(header => header.value === col).selected
    },
    async getHorses() {
      this.loading = true;
      try {
        const {data: {horses, total}} = await horseAPI.getHorses(this.URLParameters);
        this.horses = horses;
        this.totalHorses = total
      } catch (err) {
        this.errored = true;
        this.errorMessage = err.response.data.message;
      } finally {
        this.loading = false;
      }
    },
  },
}
</script>
