<template>
  <div>
    <v-autocomplete
      v-model="model"
      :items="items"
      :loading="isLoading"
      :placeholder="fullName | capitalize"
      :search-input.sync="search"
      hide-no-data
      hide-selected
      item-text="Description"
      item-value="_id"
      label="Eigenaar"
      return-object
      outlined
    ></v-autocomplete>
  </div>
</template>
<script>
// import customerAPI from "@/services/CustomerAPI.js";
export default {
  props: ['owner'],
  data() {
    return {
      descriptionLimit: 60,
      entries: [],
      isLoading: false,
      model: null,
      search: null,
    };
  },
  computed: {
    items () {
      return this.entries.map(entry => {
        const Description = entry.first_name + " " + entry.last_name
        return Object.assign({}, entry, { Description })
      })
    },
    fullName () {
      if (this.owner.first_name && this.owner.last_name){
        return this.owner.first_name + ' ' + this.owner.last_name;
      }
      return "Eigenaar";
    }
  },

  watch: {
    search () {
      // Items have already been loaded
      if (this.items.length > 0) return

      // Items have already been requested
      if (this.isLoading) return

      this.isLoading = true

      // Lazily load input items
      fetch('http://localhost:8081/api/customer')
        .then(res => res.json())
        .then(res => {
          this.entries = res
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => (this.isLoading = false))
    },
    model() {
      this.$emit('update-owner', this.model);
    }
  },
}
</script>
