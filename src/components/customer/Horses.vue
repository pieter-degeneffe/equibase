<template>
  <div>
    <v-row class="ml-3 mr-3">
      <v-select
          class="d-print-none"
          v-model="filters.type"
          dense
          outlined
          label="Filter op type paard"
          :items="horseTypes"
          item-text="name"
          :item-value="this.filters.value"
      />
      <v-switch
          class="mt-1 ml-4"
          inset
          label="Draagmoeders"
          v-model="filters.surrogate"
          :disabled="this.filters.type === 'hengst'"
      />
    </v-row>
    <v-data-table
        :headers="headers"
        :items="horses"
        :loading="loading"
        :server-items-length="totalHorses"
        :sort-by="sortBy"
        :sort-desc="sortDesc"
        :options.sync="options"
        loading-text="Bezig met laden..."
    >
      <template v-slot:item="props">
        <tr @click="openHorsePage(props.item._id)" @mouseover="mouseOver(true)" @mouseleave="mouseOver(false)">
          <td>{{ props.item.name }}</td>
          <td>{{ props.item.father }} & {{ props.item.grandfather }}</td>
          <td>{{ props.item.type }}</td>
        </tr>
      </template>
      <template v-slot:no-data>
        Geen paarden gevonden
      </template>
    </v-data-table>
    <v-row v-if="errored">
      <v-col cols="12">
        <v-alert type="error" v-if="errored" class="mx-5">
          {{ errorMessage }}
        </v-alert>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import { mouseOver } from "@/Helpers";
import customerAPI from "@/services/CustomerAPI.js";
export default {
  props: ['customer'],
  data() {
    return {
      loading: false,
      errored: false,
      errorMessage: '',
      horseFilter: '',
      horseTypes: [
        {name: 'Alle paarden', value: null},
        {name: 'Hengsten', value: 'hengst'},
        {name: 'Merries', value: 'merrie'},
      ],
      horses: [],
      totalHorses: 0,
      sortBy: 'name',
      sortDesc: false,
      options: {},
      filters: {},
      headers: [
        { text: 'Naam paard', value: 'name', align: 'left', sortable: true },
        { text: 'Stamboom', align: 'left', sortable: false },
        { text: 'Type paard', sortable: false },
      ],
    };
  },
  mounted() {
    this.getCustomerHorses(this.customer._id);
  },
  watch: {
    options: {
      handler() {
        this.getCustomerHorses(this.customer._id);
      },
      deep: true
    },
    filters: {
      handler() {
        this.filters.type === 'hengst' ? this.filters.surrogate = false : '';
        this.getCustomerHorses(this.customer._id);
      },
      deep: true
    },
  },
  computed: {
    URLParameters() {
      return {
        'page': this.options.page,
        'limit': this.options.itemsPerPage,
        'sortBy': this.options.sortBy,
        'sortDesc': this.options.sortDesc,
        type: this.filters.type !== null ? this.filters.type : undefined,
        surrogate: this.filters.surrogate === true && this.filters.type !== 'hengst' ? this.filters.surrogate : undefined,
      };
    }
  },
  methods: {
    mouseOver,
    async getCustomerHorses(id) {
      try {
        const { data: { horses, total }} = await customerAPI.getCustomerHorses(id, this.URLParameters);
        this.horses = horses;
        this.totalHorses = total;
      } catch (e) {
        this.errored = true;
        this.errorMessage = e.response.data.message;
      } finally {
        this.loading = false;
      }
    },
    openHorsePage(id) {
      this.$router.push("/horse/" + id);
    },
  }
}
</script>
