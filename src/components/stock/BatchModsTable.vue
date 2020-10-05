<template>
  <v-card flat>
    <v-toolbar flat></v-toolbar>
    <v-data-table
        :headers="headers"
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
          <td>{{ props.item.type }}</td>
          <td>{{ props.item.product.name }}</td>
          <td>{{ props.item.batch ? props.item.batch.lotNumber : '-' }}</td>
          <td>{{ props.item.client ? `${props.item.client.last_name} ${props.item.client.first_name}` : '-' }}</td>
          <td>{{ props.item.horse ? props.item.horse.name : '-' }}</td>
          <td>{{ props.item.amount }}</td>
          <td align="end">{{ new Date(props.item.createdAt) | dateFormat('DD/MM/YYYY - hh:mm') }}</td>
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

export default {
  name: "BatchModsTable",
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
        {text: 'Type', value: 'type', selected: true},
        {text: 'Product', value: 'product', selected: true},
        {text: 'Lot nummer', value: 'batch', selected: true},
        {text: 'Klant', value: 'client', selected: true},
        {text: 'Paard', value: 'horse', selected: true},
        {text: 'Aantal', value: 'amount', selected: true},
        {text: '', align: 'end', value: 'createdAt', selected: true},
      ],
    };
  },
  activated() {
      this.getStockProductMods(this.id);
  },
  watch: {
    options: {
      handler() {
        this.getStockProductMods(this.id);
      },
      deep: true
    },
    refresh: {
      handler() {
        this.getStockProductMods(this.id);
      },
      deep: true
    }
  },
  computed: {
    URLParameters() {
      return {
        'page': this.options.page,
        'limit': this.options.itemsPerPage,
        'sortBy': this.options.sortBy,
        'sortDesc': this.options.sortDesc,
      };
    }
  },
  methods: {
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
        this.refresher();
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