<template>
  <div>
    <v-autocomplete v-model="selectedCustomer" :items="customers" label="Eigenaar" item-text="first_name" :placeholder="this.owner.fullName" return-object outlined>
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
        console.log(this.customers);
      }
    }
  }
}
</script>
