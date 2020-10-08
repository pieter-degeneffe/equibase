<template>
  <v-col cols="4">
    <v-autocomplete
        v-model="select"
        :items="items"
        :search-input.sync="search"
        prepend-inner-icon="mdi-magnify"
        dense
        :no-data-text="noDataText"
        hide-details
        hide-selected
        item-text="Description"
        item-value="_id"
        :placeholder="selectedHorse.Description !== 'Alle paarden' ? selectedHorse.Description : ''"
        label="Paard zoeken"
        autocomplete="off"
        outlined
        return-object
        no-filter
        single-line
    >
      <template v-slot:prepend-item>
        <v-list-item @click="emitHorse(clearAll)">
          <v-list-item-action>
            <v-icon>{{ clearAll.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ clearAll.Description }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
      <template v-slot:item="{ item }">
        <v-list-item @click="emitHorse(item)">
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.Description }}</v-list-item-title>
            <v-list-item-subtitle>{{ item.type }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-autocomplete>
  </v-col>
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
      selectedHorse: {},
      clearAll: {
        Description: 'Alle paarden',
        icon: 'mdi-playlist-star',
        id: undefined
      }
    };
  },
  watch: {
    search(val) {
      val && val !== this.select && this.querySelections(val)
    },
  },
  computed: {
    noDataText() {
      if (!this.search) {
        return "Type om te zoeken";
      }
      if (this.search.length < 4) {
        return "Probeer specifieker te zijn";
      }
      return "Geen paarden gevonden";
    },
    items() {
      return this.entries.map(entry => {
        const Description = entry.name
        const id = entry._id
        const icon = "mdi-horseshoe";
        return Object.assign({}, entry, {Description, icon, id})
      })
    }
  },
  methods: {
    async querySelections(v) {
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
    emitHorse(item) {
      !item ? this.$emit('emit-horse', item) : this.$emit('emit-horse', item.id);
      this.selectedHorse = item;
    },
    openPage(url) {
      this.$router.push(url);
    },
  },
}
</script>
