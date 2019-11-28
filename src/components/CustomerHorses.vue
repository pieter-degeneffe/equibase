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
    </v-data-table>

    aantal paarden: {{ horses.length }}
    <br/><br/>
    {{ customer }}
  </div>
</template>
<script>
import customerAPI from "@/services/CustomerAPI.js";
export default {
  props: ['customer'],
  data() {
    return {
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
    }
  }
}
</script>
