<template>
  <horse-table :headers="headers" :filters="filters"></horse-table>
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
          value: null
        },
        surrogate: {
          value: null,
          label: null
        },
        stud_horse: {
          value: false,
          label: null
        },
        location: null,
        owner: null,
        death: true
      },
      sortBy: 'updatedAt'
    }
  },
  components: {
    horseTable
  }
};
</script>
