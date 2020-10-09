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
        item-text="description"
        item-value="_id"
        :placeholder="selected.description !== 'Alle producten' ? selected.description : ''"
        label="Product zoeken"
        autocomplete="off"
        outlined
        return-object
        no-filter
        single-line
    >
      <template v-slot:prepend-item>
        <v-list-item @click="emitProduct(clearAll)">
          <v-list-item-action>
            <v-icon>{{ clearAll.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ clearAll.description }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
      <template v-slot:item="{ item }">
        <v-list-item @click="emitProduct(item)">
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.description }}</v-list-item-title>
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
      selected: {},
      clearAll: {
        description: 'Alle producten',
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
      return "Geen producten gevonden";
    },
    items() {
      return this.entries.map(entry => ({
            ...entry,
            description: entry.name,
            icon: "mdi-pill",
            id: entry._id,
          }
      ))
    }
  },
  methods: {
    async querySelections(v) {
      this.loading = true
      try {
        const response = await searchAPI.getSearchProduct(v);
        this.entries = response.data.filter(e => e.confidenceScore > 6)
      } catch (err) {
        console.log(err);
      } finally {
        this.loading = false;
      }
    },
    emitProduct(item) {
      !item ? this.$emit('emit-product', item) : this.$emit('emit-product', item.id);
      this.selected = item;
    },
    openPage(url) {
      this.$router.push(url);
    },
  },
}
</script>
