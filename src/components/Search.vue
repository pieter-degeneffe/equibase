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
    label="Zoeken"
    autocomplete="off"
    solo-inverted
    return-object
    no-filter
  >
  <template v-slot:item="{ item }">
    <v-list-item @click="openPage(item.url)">
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
        if(entry.microchip) {
          const Description = entry.name
          const url = "/horse/" + entry._id
          const icon = "mdi-horseshoe";
          return Object.assign({}, entry, { Description, icon, url })
        } else if(entry.type === "bedrijf"){
          const Description = entry.first_name + " " + entry.last_name
          const url = "/customer/" + entry._id
          const icon = "mdi-factory";
          return Object.assign({}, entry, { Description, icon, url  })
        } else {
          const Description = entry.first_name + " " + entry.last_name
          const url = "/customer/" + entry._id
          const icon = "mdi-account";
          return Object.assign({}, entry, { Description, icon, url  })
        }
      })
    }
  },
  methods: {
    async querySelections (v) {
      this.loading = true
      try {
        const respons = await searchAPI.getSearch(v);
        const filteredRespons = respons.data.filter(e => e.confidenceScore > 30)
        this.entries = filteredRespons;
      } catch (err) {
        console.log(err);
      } finally {
        this.loading = false;
        console.log(this.entries);
      }
    },
    openPage(url){
      this.$router.push(url);
    },
  },
}
</script>
