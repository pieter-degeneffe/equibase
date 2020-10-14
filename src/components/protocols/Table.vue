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
          <td>{{ props.item.name.nl }}</td>
          <td>{{ props.item.account }}</td>
          <td>{{ props.item.price }}</td>
          <td><v-icon v-if="props.item.fixedPrice" class="green--text">mdi-check</v-icon></td>
          <td>{{ props.item.tax }}</td>
          <td class="text-right d-print-none">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon dark color="primary" class="mr-2" @click="openProtocolPage(props.item._id)" v-on="on">
                  mdi-pencil
                </v-icon>
              </template>
              <span>Product bewerken</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon dark color="primary" @click="openDeleteDialog(props.item)" v-on="on">
                  mdi-delete
                </v-icon>
              </template>
              <span>Product verwijderen</span>
            </v-tooltip>
          </td>
        </tr>
      </template>
    </v-data-table>
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

export default {
  components: { FilterButton },
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
      deleteQueue: {},
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
    openProtocolPage() {
      console.log('todo')
    },
    openDeleteDialog() {
      console.log('todo')
    },
    async getAllProtocols() {
      try {
        const { data: {protocols, total}} = await protocolAPI.getAllProtocols(this.URLParameters);
        this.protocols = protocols;
        this.totalProtocols = total;
      } catch (err) {
        this.errored = true;
        this.errorMessage = err.response.data.message;
      }
    }
  }
}
</script>
