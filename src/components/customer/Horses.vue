<template>
  <div>
    <v-select class="d-print-none" v-model="horseFilter" outlined label="Filter op type paard" :items="horseTypes"></v-select>
    <v-data-table :headers="headers" :items="filteredHorses" :loading="loading" loading-text="Bezig met laden...">
      <template v-slot:item="props">
        <tr @click="openHorsePage(props.item._id)" @mouseover="mouseOver(true)" @mouseleave="mouseOver(false)">
          <td>{{ props.item.name }}</td>
          <td>{{ props.item.father }} & {{ props.item.grandfather }}</td>
          <td>{{ props.item.type }}</td>
        </tr>
      </template>
      <template v-slot:no-data>
        Geen paarden gevonden
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
      horseFilter: '',
      horseTypes: ['Alle paarden','Hengsten','Merries','Draagmoeders'],
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
  computed: {
    filteredHorses () {
      if (!this.horseFilter || this.horseFilter === 'Alle paarden') return this.horses;
      return this.horses.filter((horse) => {
        if (this.horseFilter === "Hengsten") {
            return horse.type === "hengst";
        } else if (this.horseFilter === "Merries") {
          if (horse.type === "merrie" && horse.surrogate !== true) {
            return horse
          }
        } else if (this.horseFilter === "Draagmoeders") {
          if (horse.type === "merrie" && horse.surrogate === true) {
            return horse
          }
        }
      })
    }
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
    },
  }
}
</script>
