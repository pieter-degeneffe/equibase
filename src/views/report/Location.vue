<template>
  <horse-table :headers="headers" :filters="filters"></horse-table>
</template>
<script>
import horseTable from "@/components/horse/Table";
export default {
  data () {
    return {
      headers: [
        { text: 'Naam', value: 'name', align: 'left', sortable: false, selected: true },
        { text: 'Brandnummer', value: 'surrogate_uid', align: 'left', sortable: false, selected: true },
        { text: 'Microchip', value: 'microchip', align: 'left', selected: true},
        { text: 'Type', value: 'type', align: 'left', sortable: false, selected: false},
        { text: 'Locatie', value: 'location', align: 'left', sortable: true, selected: true},
        { text: 'Eigenaar', value: 'owner', align: 'left', sortable: false, selected: false},
        { text: 'Draagmoeder', value: 'surrogate', align: 'left', selected: true},

        { text: 'Aangemaakt op', value: 'createdAt', selected: false },
        { text: 'Gewijzigd op', value: 'updatedAt', sortable: false, selected: false },
        { text: 'Geboortedatum', value: 'date_of_birth', selected: false}
      ],
      filters: {
        type: {
          options: ["hengst", "merrie"],
          value: null
        },
        surrogate: {
          value: true,
          label: null
        },
        location: true,
        owner: null,
        death: null
      },
      sortBy: 'location.name'
    }
  },
  components: {
    horseTable
  }
};
</script>
