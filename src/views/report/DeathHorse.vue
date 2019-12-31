<template>
  <v-card class="ma-5" outlined>
    <v-data-table :headers="headers" :items="horses" :loading="loading" class="ma-4">
      <template v-slot:no-data>
          Geen paarden gevonden
      </template>
      <template v-slot:top>
        <v-toolbar-title class="mb-4">Overleden paarden</v-toolbar-title>
      </template>
      <template v-slot:item="props">
        <tr @click="openHorsePage(props.item._id)" @mouseover="mouseOver(true)" @mouseleave="mouseOver(false)">
          <td>{{ props.item.name }}</td>
          <td>{{ props.item.ueln }}</td>
          <td align="right">{{ new Date(props.item.date_of_death) | dateFormat('DD/MM/YY')}}</td>
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
      death: true,
      horses: [],
      headers: [
        { text: 'Naam Paard', align: 'left', sortable: false, value: 'name' },
        { text: 'UELN', align: 'left', sortable: false, value: 'ueln' },
        { text: 'overlijdensdatum', align: 'right', sortable: false, value: 'date_of_death' }
      ],
      URLParameters: {
        'death': true
      }
    };
  },
  created() {
    this.loadHorses();
  },
  methods: {
    async loadHorses() {
      try {
        const response = await horseAPI.getHorses(this.URLParameters);
        this.horses = response.data;
      } catch (e) {
        this.errored = true;
      } finally {
        this.loading = false;
      }
    },
    openHorsePage(id){
      this.$router.push("/horse/" + id);
    },
    mouseOver(hoverState) {
      hoverState ? document.body.style.cursor = "pointer" : document.body.style.cursor = "default";
    }
  }
};
</script>
