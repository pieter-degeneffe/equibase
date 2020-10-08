<template>
  <div>
    <v-autocomplete
        v-model="select"
        :loading="loading"
        :items="items"
        :search-input.sync="search"
        prepend-inner-icon="mdi-magnify"
        flat
        dense
        hide-no-data
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
      selectedHorse: {},
      clearAll: {
        Description: 'Alle paarden',
        icon: 'mdi-horse-variant',
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
