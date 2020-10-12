<template>
  <v-card class="mx-5 mt-5 mb-12" outlined>
    <v-toolbar flat>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer/>
      <FilterButton
        :columns=true
        :headers="headers"
        @emit-headers="updateFilteredHeaders"
        :products="icsis"
        :filters="filters"
        :toFilter="toFilter"
      />
    </v-toolbar>
    <v-data-table :headers="filteredHeaders" :items="icsis" :options.sync="options"
                  :server-items-length="totalICSIs" :loading="loading" :sortBy="sortBy" :sortDesc="sortDesc"
                  loading-text="Bezig met laden..." class="ma-5">
      <template v-slot:no-data>
        Geen ICSI loten gevonden
      </template>
      <template v-slot:item="props">
        <tr @click="openICSIPage(props.item.code)" @mouseover="mouseOver(true)" @mouseleave="mouseOver(false)">
          <td v-if="showColumn('code')">{{ props.item.code }}</td>
          <td v-if="showColumn('donor_mare')">{{ props.item.donor_mare.name||'' }}</td>
          <td v-if="showColumn('donor_stallion')">{{ props.item.donor_stallion.name||'' }}</td>
          <td v-if="showColumn('amount')">{{ props.item.embryos.filter(el=>el.active).length}}</td>
          <td v-if="showColumn('createdAt')">{{ formatDate(props.item.createdAt) }}</td>
          <td v-if="showColumn('updatedAt')">{{ formatDate(props.item.updatedAt) }}</td>
        </tr>
      </template>
    </v-data-table>
    <v-alert type="error" v-if="errored">
      {{ errorMessage }}
    </v-alert>
  </v-card>
</template>
<script>
  import { mouseOver, formatDate } from "@/Helpers";
  import { icsiAPI } from '../../services';
  import FilterButton from "@/components/FilterButton";

  export default {
    components: {
      FilterButton,
    },
    props: ['title', 'headers', 'filters', 'sortBy'],
    data() {
      return {
        sortDesc: true,
        totalICSIs: 0,
        icsis: [],
        loading: true,
        options: {},
        errored: false,
        errorMessage: '',
        filteredHeaders: [],
        toFilter: ['donor_mare', 'donor_stallion', 'nitrogen'],
      };
    },
    watch: {
      options: {
        handler() {
          this.getICSIs();
        },
        deep: true
      },
      filters: {
        handler() {
          this.getICSIs();
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
          donor_stallion: this.filters.donor_stallion !== null ? this.filters.donor_stallion.map(el => el._id) : undefined,
          donor_mare: this.filters.donor_mare !== null ? this.filters.donor_mare.map(el => el._id) : undefined,
          owner: this.filters.owner !== null ? this.filters.owner.map(el => el._id) : undefined,
          container: this.filters.location.container !== null ? this.filters.location.container._id : undefined,
          tube: this.filters.location.tube !== null ? this.filters.location.tube.value : undefined,
        };
      }
    },
    methods: {
      formatDate,
      mouseOver,
      updateFilteredHeaders(headers) {
        this.filteredHeaders = headers;
      },
      openICSIPage(id) {
        document.body.style.cursor = 'default';
        this.$router.push('/icsi/' + id);
      },
      showColumn(col) {
        return this.headers.find(header => header.value === col).selected;
      },
      async getICSIs() {
        this.loading = true;
        try {
          const response = await icsiAPI.getAllICSI(this.URLParameters);
          this.icsis = response.data.icsis;
          this.totalICSIs = response.data.total;
        } catch (e) {
          this.errored = true;
          console.log('Arne: e= ', e);
          // this.errorMessage = e.response.data.message;
        } finally {
          this.loading = false;
        }
      },
    },
  };
</script>
