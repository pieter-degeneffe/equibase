<template>
  <v-card flat>
    <v-toolbar flat>
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
        v-if="refresh===true?refresher:refresher"
    >
      <template v-slot:no-data>
        Geen stock modificaties voor product {{ product.name }} gevonden.
      </template>
      <template v-slot:item='props'>
        <tr>
          <td v-if="showColumn('type')">{{ props.item.type }}</td>
          <td v-if="showColumn('product')">{{ props.item.product.name }}</td>
          <td v-if="showColumn('batch')">{{ props.item.batch ? props.item.batch.lotNumber : '-' }}</td>
          <td v-if="showColumn('client')">{{ props.item.client ? `${props.item.client.last_name} ${props.item.client.first_name}` : '-' }}</td>
          <td v-if="showColumn('horse')">{{ props.item.horse ? props.item.horse.name : '-' }}</td>
          <td v-if="showColumn('amount')">{{ props.item.amount }}</td>
          <td v-if="showColumn('createdAt')" align="end">{{ new Date(props.item.createdAt) | dateFormat('DD/MM/YYYY - hh:mm') }}</td>
        </tr>
      </template>
    </v-data-table>
    <v-alert type='error' v-if='errored'>
      {{ errorMessage }}
    </v-alert>
  </v-card>
</template>

<script>
import { stockAPI } from '@/services'
import FilterButton from "@/components/FilterButton";

export default {
  name: "BatchModsTable",
  components: {
    FilterButton,
  },
  props: ['id', 'product', 'refresh'],
  data() {
    return {
      totalMods : 0,
      mods: [],
      loading: false,
      errored: false,
      errorMessage: '',
      sortBy: 'createdAt',
      sortDesc: true,
      options: {},
      headers: [
        {text: 'Type', value: 'type', selected: true, sortable: true},
        {text: 'Product', value: 'product', selected: true},
        {text: 'Lot nummer', value: 'batch', selected: true},
        {text: 'Klant', value: 'client', selected: true},
        {text: 'Paard', value: 'horse', selected: true},
        {text: 'Aantal', value: 'amount', selected: true},
        {text: 'Datum', align: 'end', value: 'createdAt', selected: true},
      ],
      toFilter: ['modTypes'],
      filters: {},
      filteredHeaders: [],
      filteredMods: []
    };
  },
  watch: {
    options: {
      handler() {
        this.getStockProductMods(this.id);
      },
      deep: true
    },
    filters: {
      handler() {
        this.getStockProductMods(this.id);
      },
      deep: true
    },
    refresh: {
      handler() {
        this.getStockProductMods(this.id);
        this.refresher();
      }
    }
  },
  computed: {
    URLParameters() {
      return {
        'page': this.options.page,
        'limit': this.options.itemsPerPage,
        'sortBy': this.options.sortBy,
        'sortDesc': this.options.sortDesc,
        type: this.filters.type !== null ? this.filters.type : undefined,
      };
    }
  },
  methods: {
    updateFilteredHeaders(headers) {
      this.filteredHeaders = headers;
    },
    showColumn(col) {
      return this.headers.find(header => header.value === col).selected;
    },
    refresher() {
      this.$emit('update-refresh', false);
    },
    generateCustomerName(item) {
      return (`${item.last_name} ${item.first_name}`);
    },
    async getStockProductMods(id) {
      this.loading = true;
      try {
        const { data: { mods, total } } = await stockAPI.getStockProductMods(id, false, this.URLParameters);
        this.mods = mods;
        this.totalMods = total;
        this.errored = false;
      } catch (err) {
        this.errored = true;
        this.errorMessage = err.response.data.message;
      } finally {
        this.loading = false;
      }
    }
  },
}
</script>

<style scoped>

</style>