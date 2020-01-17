<template>
  <div>
    <horse-table :headers="headers" :filters="filters"></horse-table>
    <v-btn bottom color="primary" class="ma-2 white--text" depressed dark @click="openHorsePage()" fixed right>
      {{ $route.name }} toevoegen
      <v-icon right dark>mdi-plus</v-icon>
    </v-btn>
  </div>
</template>
<script>
import horseTable from "@/components/horse/Table";
export default {
  data () {
    return {
      headers: [
        { text: 'Naam', value: 'name', align: 'left', sortable: true, selected: true },
        { text: 'Brandnummer', value: 'surrogate_uid', align: 'left', sortable: false, selected: false },
        { text: 'Type', value: 'type', align: 'left', sortable: false, selected: true},
        { text: 'Locatie', value: 'location', align: 'left', sortable: true, selected: true},
        { text: 'Eigenaar', value: 'owner', align: 'left', sortable: true, selected: true},
        { text: 'Draagmoeder', value: 'surrogate', align: 'left', selected: false},
        { text: 'Microchip', value: 'microchip', align: 'left', selected: false},
        { text: 'Aangemaakt op', value: 'createdAt', selected: false },
        { text: 'Gewijzigd op', value: 'updatedAt', sortable: true, selected: true },
        { text: 'Geboortedatum', value: 'date_of_birth', selected: false}
      ],
      filters: {
        type: {
          options: ["hengst", "merrie"],
          value: "hengst"
        },
        surrogate: {
          value: false,
          label: null
        },
        stud_horse: {
          value: false,
          label: null
        },
        location: {
          options: null,
          value: null
        },
        owner: null,
        death: false
      },
      sortBy: 'updatedAt'
    }
  },
  methods: {
    openHorsePage(id){
      this.$router.push({ path: `/horse/${id}`, query: { type: "hengst"  } })
    },
  },
  components: {
    horseTable
  }
};
</script>
