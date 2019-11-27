<template>
  <div>
    <v-autocomplete v-model="selectedCustomer" :items="customers" label="Eigenaar" :placeholder="fullName | capitalize" return-object outlined>
      <template slot="selection" slot-scope="data">
        {{ data.item.first_name | capitalize }} {{ data.item.last_name | capitalize}}
      </template>
      <template v-slot:item="data">
        <v-list-item-avatar color="primary">
          <span class="white--text">{{ (data.item.first_name[0] + data.item.last_name[0]) || '?' }}</span>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>{{ data.item.first_name | capitalize}} {{ data.item.last_name | capitalize}}</v-list-item-title>
          <v-list-item-subtitle>{{ data.item.email }}</v-list-item-subtitle>
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
      customers: [],
      selectedCustomer: this.owner
    };
  },
  computed: {
    fullName () {
      return this.owner.first_name + ' ' + this.owner.last_name;
    }
  },
  mounted() {
    this.loadCustomers();
  },
  watch: {
    selectedCustomer(value) {
      this.$emit('update-owner', value);
    }
  },
  methods: {
    async loadCustomers() {
      try {
        const response = await customerAPI.getCustomers();
        this.customers= response.data;
      } catch (e) {
        this.errored = true;
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>
