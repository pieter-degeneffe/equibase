<template>
  <v-card class="ma-5" outlined>
    <v-data-table :headers="headers" :items="horses" :loading="loading" loading-text="Bezig met laden...">
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-layout justify-end>
            <v-btn color="primary" dark class="mb-2" @click="openHorsePage()">Paard toevoegen</v-btn>
          </v-layout>
        </v-toolbar>
      </template>
      <template v-slot:item="props">
        <tr @click="openHorsePage(props.item._id)" @mouseover="mouseOver(true)" @mouseleave="mouseOver(false)">
          <td>{{ props.item.name }}</td>
          <td>{{ props.item.father }} & {{ props.item.grandfather }}</td>
          <td>{{ props.item.type }}</td>
          <td>{{ new Date(props.item.create_date) | dateFormat('DD/MM/YY')}}</td>
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
          text: 'Geslacht',
          sortable: false
        },
        {
          text: 'Aangemaakt op',
          value: 'create_date',
          sortable: true
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
