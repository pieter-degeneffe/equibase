<template>
  <div>
    <v-data-table :headers="headers" :items="horses" :loading="loading" loading-text="Bezig met laden...">
      <template v-slot:item="props">
        <tr @click="openHorsePage(props.item._id)" @mouseover="mouseOver(true)" @mouseleave="mouseOver(false)">
          <td>{{ props.item.name }}</td>
          <td>{{ props.item.father }} & {{ props.item.grandfather }}</td>
          <td>{{ props.item.type }}</td>
        </tr>
      </template>
      <template v-slot:no-data>
        Deze klant heeft nog geen paarden
      </template>
    </v-data-table>
  </div>
</template>
<script>
import customerAPI from "@/services/CustomerAPI.js";
export default {
  props: ['customer'],
  data() {
    return {
      loading: false,
      horses: [],
      headers: [
        {
          text: 'Naam paard',
          value: 'name',
          align: 'left',
          sortable: true
        },
        {
          text: 'Stamboom',
          align: 'left',
          sortable: false
        },
        {
          text: 'Type paard',
          sortable: false
        },
      ],
    };
  },
  mounted() {
    this.getCustomerHorses(this.customer._id);
  },
  methods: {
    async getCustomerHorses(id) {
      try {
        const response = await customerAPI.getCustomerHorses(id);
        this.horses = response.data;
      } catch (e) {
        this.errored = true;
      } finally {
        this.loading = false;
      }
    },
    openHorsePage(id) {
      this.$router.push("/horse/" + id);
    },
    mouseOver(hoverState) {
      hoverState ? document.body.style.cursor = "pointer" : document.body.style.cursor = "default";
    }
  }
}
</script>
