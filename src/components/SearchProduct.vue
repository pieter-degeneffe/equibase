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
        :placeholder="selected.Description !== 'Alle producten' ? selected.Description : ''"
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
            <v-list-item-title>{{ clearAll.Description }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
      <template v-slot:item="{ item }">
        <v-list-item @click="emitProduct(item)">
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.Description }}</v-list-item-title>
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
        Description: 'Alle producten',
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
      return this.entries.map(entry => {
        const Description = entry.name
        const id = entry._id
        const icon = "mdi-pill";
        return Object.assign({}, entry, {Description, icon, id})
      })
    }
  },
  methods: {
    async querySelections(v) {
      this.loading = true
      try {
        const respons = await searchAPI.getSearchProduct(v);
        const filteredRespons = respons.data.filter(e => e.confidenceScore > 6)
        this.entries = filteredRespons;
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
