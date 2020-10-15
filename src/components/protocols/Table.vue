<template>
  <v-card class="mx-5 mt-5 mb-5" outlined>
    <v-toolbar flat>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer/>
      <FilterButton
          :toFilter="toFilter"
          :filters="filters"
          :columns=true
          :headers="headers"
          :products="protocols"
          @emit-headers="updateFilteredHeaders"
      />
    </v-toolbar>
    <v-data-table
      class="ma-5"
      :headers="filteredHeaders"
      :items="protocols"
      :loading="loading"
      loading-text="Bezig met laden..."
      :server-items-length="totalProtocols"
      :options.sync="options"
    >
      <template v-slot:no-data>
        Geen {{ title }} gevonden
      </template>
      <template v-slot:item="props">
        <tr>
          <td v-if="showColumn('name')">{{ props.item.name.nl }}</td>
          <td v-if="showColumn('account')">{{ props.item.account }}</td>
          <td v-if="showColumn('price')">{{ props.item.price }}</td>
          <td v-if="showColumn('fixedPrice')"><v-icon v-if="props.item.fixedPrice" class="green--text">mdi-check</v-icon></td>
          <td v-if="showColumn('tax')">{{ props.item.tax }}</td>
          <td v-if="showColumn('action')" class="text-right d-print-none">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon dark color="primary" class="mr-2" @click="openProtocolPage(props.item._id)" v-on="on">
                  mdi-pencil
                </v-icon>
              </template>
              <span>Protocol bewerken</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon dark color="primary" @click="openDeleteDialog(props.item)" v-on="on">
                  mdi-delete
                </v-icon>
              </template>
              <span>Protocol verwijderen</span>
            </v-tooltip>
          </td>
        </tr>
      </template>
    </v-data-table>
    <deleteDialog
        :delete-dialog="deleteDialog"
        item="protocol"
        :delete-queue="deleteQueue"
        @delete="deleteItem"
    />
    <v-row v-if="errored">
      <v-col cols="12">
        <v-alert type="error" v-if="errored" class="mx-5">
          {{ errorMessage }}
        </v-alert>
      </v-col>
    </v-row>
  </v-card>

</template>

<script>
import { protocolAPI } from "@/services";
import FilterButton from "@/components/FilterButton";
import deleteDialog from "@/components/DeleteDialog";

export default {
  components: { FilterButton, deleteDialog },
  props: ['title', 'headers'],
  data() {
    return {
      filteredHeaders: [],
      protocols: [],
      totalProtocols: 0,
      loading: false,
      errored: false,
      errorMessage: '',
      options: {},
      filters: {},
      toFilter: [],
      deleteDialog: false,
      deleteQueue: {}
    }
  },
  created() {
    this.getAllProtocols();
  },
  watch: {
    options: {
      handler() {
        this.getAllProtocols();
      },
      deep: true
    },
    filters: {
      handler() {
        this.getAllProtocols();
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
        name: this.filters.name !== null ? this.filters.name : undefined,
      };
    }
  },
  methods: {
    updateFilteredHeaders(headers) {
      this.filteredHeaders = headers
    },
    showColumn(col) {
      return this.headers.find(header => header.value === col).selected;
    },
    openProtocolPage() {
      console.log('todo');
    },
    openDeleteDialog(item) {
      this.deleteQueue = item;
      this.deleteDialog = true;
    },

    async deleteItem(item) {
      try {
        this.loading = true;
        this.errored = false;
        await protocolAPI.deleteProtocol(item._id);
        this.deleteDialog = false;
        this.deleteQueue = {};
        await this.getAllProtocols();
      } catch (err) {
        this.errored = true;
        this.errorMessage = err.response.data.message;
      } finally {
        this.loading = false;
      }
    },
    async getAllProtocols() {
      try {
        this.loading = true;
        const { data: {protocols, total}} = await protocolAPI.getAllProtocols(this.URLParameters);
        this.protocols = protocols;
        this.totalProtocols = total;
      } catch (err) {
        this.errored = true;
        this.errorMessage = err.response.data.message;
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>
