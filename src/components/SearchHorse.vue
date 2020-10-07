<template>
  <div>
    <v-autocomplete
      v-model="select"
      :loading="loading"
      :items="items"
      :search-input.sync="search"
      prepend-inner-icon="mdi-magnify"
      flat
      hide-no-data
      hide-details
      hide-selected
      item-text="Description"
      item-value="_id"
      label="Paard zoeken"
      autocomplete="off"
      outlined
      return-object
      no-filter
    >
    <template v-slot:item="{ item }">
      <v-list-item @click="emitHorse(item.id)">
        <v-list-item-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{ item.Description }}</v-list-item-title>
          <v-list-item-subtitle>{{ item.company }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </template>
    </v-autocomplete>
  </div>
</template>
<script>
import searchAPI from "@/services/SearchAPI.js";

export default {
  data() {
    return {
      loading: false,
      entries: [],
      search: null,
      select: null,
    };
  },
  watch: {
    search (val) {
      val && val !== this.select && this.querySelections(val)
    },
  },
  computed: {
    items () {
      return this.entries.map(entry => {
          const Description = entry.name
          const id = entry._id
          const icon = "mdi-horseshoe";
          return Object.assign({}, entry, { Description, icon, id })
      })
    }
  },
  methods: {
    async querySelections (v) {
      this.loading = true
      try {
        const respons = await searchAPI.getSearchHorse(v);
        const filteredRespons = respons.data.filter(e => e.confidenceScore > 6)
        this.entries = filteredRespons;
      } catch (err) {
        console.log(err);
      } finally {
        this.loading = false;
      }
    },
    emitHorse(id) {
      console.log('Search emitted id: ', id);
      this.$emit('emit-horse', id);
    },
    openPage(url){
      this.$router.push(url);
    },
  },
}
</script>
