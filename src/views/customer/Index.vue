<template>
  <v-card class="ma-5" outlined>
    <v-data-table :headers="headers" :items="customers" multi-sort class="elevation-1" :loading="loading" loading-text="Bezig met laden...">
      <template v-slot:item="props">
        <tr @click="openCustomerPage(props.item._id)" @mouseover="mouseOver(true)" @mouseleave="mouseOver(false)">
          <td>{{ props.item.first_name | capitalize}} {{ props.item.last_name | capitalize}}</td>
          <td>{{ props.item.horses.length}}</td>
        </tr>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import customerAPI from "@/services/CustomerAPI.js";
export default {
  data() {
    return {
      errored: false,
      loading: true,
      customers: [],
      headers: [
        {
          text: 'Naam klant',
          align: 'left',
          sortable: true
        },
        {
          text: 'Paarden',
          align: 'left',
        }
      ],
    };
  },
  mounted() {
    this.loadCustomers();
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
    },
    openCustomerPage(id) {
      this.$router.push("/customer/" + id);
    },
    mouseOver(hoverState) {
      hoverState ? document.body.style.cursor = "pointer" : document.body.style.cursor = "default";
    }
  }
}
</script>

<style lang="css" scoped>
</style>
