<template>
  <v-card flat>
    <v-toolbar flat>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer/>
      <SearchHorse
          v-if="toFilter && toFilter.includes('horse')"
          @emit-horse="updateFilters"
      />
      <v-btn v-if="rangeSelector.filteredValue" text color="error" @click="clear">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-menu
          v-if="datePicker"
          ref='fromDateMenu'
          v-model='fromDateMenu'
          :close-on-content-click='false'
          transition='scale-transition'
          offset-y
          min-width="200"
      >
        <template v-slot:activator='{ on }'>
          <v-btn
              v-on='on'
              readonly
              text
              color="primary"
          >
            {{ computedDateFormatted }}
          </v-btn>
        </template>
        <v-date-picker
            v-model='rangeSelector.value'
            @change="formatDateRange(rangeSelector.value[0], rangeSelector.value[1])"
            locale="nl"
            range
            no-title
            first-day-of-week='1'
        />
      </v-menu>
      <FilterButton
          :toFilter="toFilter"
          :filters="filters"
          :columns=true
          :headers="headers"
          :products="mods"
          :horses="Object.values(horses)"
          @emit-headers="updateFilteredHeaders"
          @emit-horse-parent="updateFilters"
      />
    </v-toolbar>
    <v-data-table
        :headers="filteredHeaders"
        :items="mods"
        :server-items-length="totalMods"
        :options.sync="options"
        :sort-by="sortBy"
        :sort-desc="sortDesc"
        :loading="loading"
        loading-text="Bezig met laden..."
        class="ma-5"
    >
      <template v-slot:no-data>
        Geen stock modificaties voor product gevonden.
      </template>
      <template v-slot:item='props'>
        <tr>
          <td v-if="showColumn('type')">{{ props.item.type }}</td>
          <td v-if="showColumn('product')">{{ props.item.product ? props.item.product.name : '-' }}</td>
          <td v-if="showColumn('batch')">{{ props.item.batch ? props.item.batch.lotNumber : '-' }}</td>
          <td v-if="(preFilter === 'Aankoop') && showColumn('batch.supplier')">{{ props.item.batch && props.item.batch.supplier ? props.item.batch.supplier : '-' }}</td>
          <td v-if="outgoing && showColumn('client')">{{ props.item.client ? `${props.item.client.last_name} ${props.item.client.first_name}` : '-' }}</td>
          <td v-if="(preFilter === 'Toediening') || outgoing && showColumn('horse')">{{ props.item.horse ? props.item.horse.name : '-' }}</td>
          <td v-if="showColumn('amount')">{{ props.item.amount }}</td>
          <td v-if="showColumn('createdAt')" class="text-right">{{ formatDate(props.item.createdAt) }}</td>
        </tr>
      </template>
    </v-data-table>
    <v-alert type='error' v-if='errored'>
      {{ errorMessage }}
    </v-alert>
  </v-card>
</template>

<script>
import { formatDate, formatDateMDY } from "@/Helpers";
import {stockAPI} from '@/services'
import FilterButton from "@/components/FilterButton";
import SearchHorse from "@/components/SearchHorse";

export default {
  name: "Mods",
  components: {
    FilterButton,
    SearchHorse
  },
  props: ['outgoing', 'datePicker', 'delivered', 'filters', 'toFilter', 'preFilter', 'headers', 'title'],
  data() {
    return {
      mods: [],
      horses: {},
      uniqueHorses: [],
      totalMods: 0,
      filteredHeaders: [],
      sortBy: 'createdAt',
      sortDesc: true,
      fromDateMenu: false,
      toDateMenu: false,
      loading: false,
      errored: false,
      errorMessage: '',
      rangeSelector: {
        value: [null, null],
        filteredValue: null
      },
      from: new Date('09/1/2020').toISOString().substr(0, 10),
      to: new Date().toISOString().substr(0, 10),
      options: {},
    };
  },
  watch: {
    rangeSelector: {
      handler() {
        this.getMods(this.outgoing);
      },
      deep: true
    },
    options: {
      handler() {
        this.getMods(this.outgoing);
      },
      deep: true
    },
    filters: {
      handler() {
        this.getMods(this.outgoing);
      },
      deep: true
    }
  },
  computed: {
    computedDateFormatted() {
      if (this.rangeSelector.filteredValue) {
        const fromDate = formatDate(this.rangeSelector.filteredValue[0]);
        const toDate = formatDate(this.rangeSelector.filteredValue[1]);
        return `van: ${fromDate} - tot: ${toDate}`;
      }
      return 'Kies een datum bereik';
    },
    URLParameters() {
      return {
        'page': this.options.page,
        'limit': this.options.itemsPerPage,
        'sortBy': this.options.sortBy,
        'sortDesc': this.options.sortDesc,
        from: !this.datePicker ? undefined : this.rangeSelector.filteredValue ? this.formatDateMDY(this.rangeSelector.filteredValue[0]) : undefined,
        to: !this.datePicker ? undefined : this.rangeSelector.filteredValue ? this.formatDateMDY(this.rangeSelector.filteredValue[1]) : undefined,
        type: this.preFilter ? this.preFilter : this.filters.type !== null ? this.filters.type : undefined,
        horse: !this.toFilter ? undefined : this.filters.horse !== null ? this.filters.horse : undefined,
      };
    },
  },
  methods: {
    clear(){
      this.rangeSelector.filteredValue = null;
      this.rangeSelector.value = [null, null];
    },
    updateFilters(id) {
      if (this.toFilter && this.toFilter.includes('horseSearch')) {
        this.URLParameters.horse = id;
        this.getMods(this.outgoing);
      }
    },
    updateFilteredHeaders(headers) {
      this.filteredHeaders = headers;
    },
    showColumn(col) {
      return this.headers.find(header => header.value === col).selected;
    },
    async getMods(outgoing) {
      this.loading = true;
      try {
        const {data: {mods, total}} = await stockAPI.getStockMods(outgoing, this.URLParameters);
        this.mods = mods;
        this.errored = false;
        this.totalMods = total;
      } catch (err) {
        this.errored = true;
        this.errorMessage = err.response.data.message;
      } finally {
        this.loading = false;
      }
    },
    formatDate,
    formatDateMDY,
    formatDateRange(...dates) {
      this.rangeSelector.filteredValue = dates.sort().map(date => formatDateMDY(date));
      this.from = this.rangeSelector.filteredValue[0];
      this.to = this.rangeSelector.filteredValue[1];
    },
  }
}
</script>
