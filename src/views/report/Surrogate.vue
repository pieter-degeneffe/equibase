<template>
  <v-card class="ma-5" outlined>
    <v-data-table :headers="headers" :items="horses" :loading="loading" class="ma-4" :sort-by="['name']">
      <template v-slot:no-data>
          Geen paarden gevonden
      </template>
      <template v-slot:top>
        <v-toolbar-title class="mb-4">Alle draagmoeders</v-toolbar-title>
      </template>
      <template v-slot:item="props">
        <tr @click="openHorsePage(props.item._id)" @mouseover="mouseOver(true)" @mouseleave="mouseOver(false)">
          <td>{{ props.item.name }}</td>
          <td align="right">{{ props.item.surrogate_uid }}</td>
          <td align="right">{{ props.item.microchip }}</td>
          <td align="right"><span v-if="props.item.location">{{ props.item.location.name }}</span></td>
          <td align="right"><span v-if="props.item.date_of_birth">{{ new Date(props.item.date_of_birth) | dateFormat('DD/MM/YY') }}</span></td>
          <td align="right">{{ new Date(props.item.createdAt) | dateFormat('DD/MM/YY') }}</td>
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
        { text: 'Naam Paard', align: 'left', sortable: true, value: 'name' },
        { text: 'Brandnummer', align: 'right', sortable: true, value: 'surrogate_uid' },
        { text: 'Chipnummer', align: 'right', sortable: true, value: 'microchip' },
        { text: 'Locatie', align: 'right', sortable: false, value: 'location.name' },
        { text: 'Geboortedatum', align: 'right', sortable: true, value: 'date_of_birth' },
        { text: 'Aangemaakt op', align: 'right', value: 'create_date', sortable: false },
      ],
      URLParameters: {
        'type': 'merrie',
        'surrogate': true,
        'death': false
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
