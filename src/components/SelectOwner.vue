<template>
  <div>
    <v-autocomplete
      v-model="model"
      :items="items"
      :loading="loading"
      :placeholder="fullName"
      :search-input.sync="search"
      hide-no-data
      hide-selected
      item-text="Description"
      item-value="_id"
      label="Eigenaar"
      return-object
      outlined
    >
      <template v-slot:item="{ item }">
        <v-list-item-content>
          <v-list-item-title>{{ item.first_name }} {{ item.last_name }}</v-list-item-title>
          <v-list-item-subtitle>{{ item.company }}</v-list-item-subtitle>
        </v-list-item-content>
      </template>
  </v-autocomplete>
  </div>
</template>
<script>
import customerAPI from "@/services/CustomerAPI.js";
export default {
  props: ['owner'],
  data() {
    return {
      descriptionLimit: 60,
      entries: [],
      loading: false,
      model: null,
      search: null,
    };
  },
  computed: {
    items () {
      return this.entries.map(entry => {
        if(entry.company) {
          const Description = entry.company + " - " + entry.first_name + " " + entry.last_name
          return Object.assign({}, entry, { Description })
        } else {
          const Description = entry.first_name + " " + entry.last_name
          return Object.assign({}, entry, { Description })
        }
      })
    },
    fullName () {
      if (this.owner.company){
        return (this.owner.company);
      } else if (this.owner.first_name && this.owner.last_name){
        return this.owner.first_name + ' ' + this.owner.last_name;
      }
      return "Eigenaar";
    }
  },
  watch: {
    search (val) {
      val && val !== this.select && this.querySelections(val)
    },
  },
  methods: {
    async querySelections (v) {
      this.loading = true
      try {
        const respons = await customerAPI.getCustomerSearch(v);
        const filteredRespons = respons.data.filter(e => e.confidenceScore > 6)
        this.entries = filteredRespons;
      } catch (err) {
        console.log(err);
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>
