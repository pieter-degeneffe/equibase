<template>
  <v-card class="ma-5" outlined>
    <v-data-table :headers="headers" :items="horses" :loading="loading" loading-text="Bezig met laden...">
      <template v-slot:item="props">
        <tr @click="openHorsePage(props.item._id)" @mouseover="mouseOver(true)" @mouseleave="mouseOver(false)">
          <td>{{ props.item.name }}</td>
          <td>{{ props.item.father }} & {{ props.item.grandfather }}</td>
          <td>{{ props.item.type }}</td>
        </tr>
      </template>
    </v-data-table>
  </v-card>
</template>
<script>
import horseAPI from "@/services/HorseAPI.js";
export default {
  data() {
    return {
      errored: false,
      loading: true,
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
    this.loadHorses();
  },
  methods: {
    async loadHorses() {
      try {
        const response = await horseAPI.getHorses();
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
};
</script>
