<template>
  <v-card class="mx-5 mt-5 mb-12" flat>
    <v-toolbar flat>
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
          <v-text-field
              v-model='computedFromDateFormatted'
              label='van'
              hint="MM/DD/YYYY"
              persistent-hint
              v-on='on'
              readonly
              class="mr-5"
          >
          </v-text-field>
        </template>
        <v-date-picker
            v-model='from'
            no-title
            first-day-of-week='1'
            @input='fromDateMenu = false'
        />
      </v-menu>
      <v-menu
          v-if="datePicker"
          ref='toDateMenu'
          v-model='toDateMenu'
          :close-on-content-click='false'
          transition='scale-transition'
          offset-y
          min-width="290"
      >
        <template v-slot:activator='{ on }'>
          <v-text-field
              v-model='computedToDateFormatted'
              label='tot'
              hint="MM/DD/YYYY"
              persistent-hint
              v-on='on'
              readonly
          >
          </v-text-field>
        </template>
        <v-date-picker
            v-model='to'
            no-title
            first-day-of-week='1'
            @input='toDateMenu = false'
        />
      </v-menu>
      <v-spacer/>
      <FilterButton
          :toFilter="toFilter"
          :filters="filters"
          :columns=true
          :headers="headers"
          :products="mods"
          @emit-headers="updateFilteredHeaders"
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
    >
      <template v-slot:no-data>
        Geen stock modificaties voor product gevonden.
      </template>
      <template v-slot:item='props'>
        <tr>
          <td v-if="showColumn('type')">{{ props.item.type }}</td>
          <td v-if="showColumn('product')">{{ props.item.product ? props.item.product.name : '-' }}</td>
          <td v-if="showColumn('batch')">{{ props.item.batch ? props.item.batch.lotNumber : '-' }}</td>
          <td v-if="showColumn('batch.supplier')">{{ props.item.batch.supplier }}</td>
          <td v-if="showColumn('amount')">{{ props.item.amount }}</td>
          <td v-if="showColumn('createdAt')" align="end">
            {{ new Date(props.item.createdAt) | dateFormat('DD/MM/YYYY - hh:mm') }}
          </td>
        </tr>
      </template>
    </v-data-table>
    <v-alert type='error' v-if='errored'>
      {{ errorMessage }}
    </v-alert>
  </v-card>
</template>

<script>
import {stockAPI} from '@/services'
import FilterButton from "@/components/FilterButton";

export default {
  name: "Mods",
  components: {
    FilterButton,
  },
  props: ['outgoing', 'datePicker', 'delivered', 'filters', 'toFilter'],
  data() {
    return {
      mods: [],
      totalMods: 0,
      filteredHeaders: [],
      headers: [
        {text: 'Type', value: 'type', selected: true},
        {text: 'Product', value: 'product', selected: true},
        {text: 'Lot nummer', value: 'batch', selected: true},
        {text: 'Leverancier', value: 'batch.supplier', selected: true},
        {text: 'Aantal', value: 'amount', selected: true},
        {text: 'Datum', align: 'end', value: 'createdAt', selected: true},
      ],
      sortBy: 'createdAt',
      sortDesc: true,
      fromDateMenu: false,
      toDateMenu: false,
      loading: false,
      errored: false,
      errorMessage: '',
      from: new Date('09/1/2020').toISOString().substr(0, 10),
      to: new Date().toISOString().substr(0, 10),
      options: {},
    };
  },
  mounted() {
    this.getMods(this.outgoing);
  },
  watch: {
    from: {
      handler() {
        this.getMods(this.outgoing);
      },
      deep: true
    },
    to: {
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
    computedFromDateFormatted() {
      return this.formatDate(this.from);
    },
    computedToDateFormatted() {
      return this.formatDate(this.to);
    },
    URLParameters() {
      return {
        'page': this.options.page,
        'limit': this.options.itemsPerPage,
        'sortBy': this.options.sortBy,
        'sortDesc': this.options.sortDesc,
        from: this.datePicker ? this.formatDate(this.from) : undefined,
        to: this.datePicker ? this.formatDate(this.to) : undefined,
        type: this.delivered ? 'Aankoop' : this.filters.type !== null ? this.filters.type : undefined,
      };
    },
  },
  methods: {
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
    formatDate(date) {
      if (!date) return null;
      date = new Date(date).toISOString().substr(0, 10);
      const [year, month, day] = date.split('-');
      return `${month}/${day}/${year}`;
    },
  }
}
</script>

<style scoped>

</style>