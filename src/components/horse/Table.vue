<template>
  <div>
    <v-data-table :headers="tableHeader" :items="horses" :loading="loading" loading-text="Bezig met laden..." class="ma-4">
      <template v-slot:no-data>
          Geen {{ tableName }} in de database
      </template>
      <template v-slot:top>
        <v-toolbar-title>{{ tableName }}</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
      </template>
      <template v-slot:item="props">
        <tr @click="openHorsePage(props.item._id)" @mouseover="mouseOver(true)" @mouseleave="mouseOver(false)">
          <td>{{ props.item.name }}</td>
          <td v-if="props.item.type === 'merrie'">
            <v-icon v-if="props.item.surrogate" class="green--text">mdi-check</v-icon>
          </td>
          <td>{{ familyTree(props.item) }}</td>
          <td>{{ props.item.ueln }}</td>
          <td align="right">{{ new Date(props.item.createdAt) | dateFormat('DD/MM/YY')}}</td>
        </tr>
      </template>
    </v-data-table>
    <v-btn bottom color="primary" class="ma-2 white--text" depressed dark @click="openHorsePage()" fixed right>
      {{ $route.name }} toevoegen
      <v-icon right dark>mdi-plus</v-icon>
    </v-btn>
    {{ horses }}
  </div>
</template>
<script>
export default {
  props: ['horses', 'loading', 'tableName'],
  data() {
    return {
      errored: false,
    };
  },
  methods: {
    openHorsePage(id){
      this.$router.push("/horse/" + id);
    },
    mouseOver(hoverState) {
      hoverState ? document.body.style.cursor = "pointer" : document.body.style.cursor = "default";
    },
    familyTree(horse) {
      if (horse.father && horse.grandfather) return (horse.father + " & " + horse.grandfather);
    }
  },
  computed: {
    tableHeader() {
      if (this.$route.name === "hengst") {
        return (
          [
            {
              text: 'Naam hengst',
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
              text: 'UELN',
              sortable: false
            },
            {
              text: 'Aangemaakt op',
              align: 'right',
              value: 'create_date',
              sortable: false
            },
          ]
        )
      } else if (this.$route.name === "merrie") {
        return (
          [
            {
              text: 'Naam merrie',
              value: 'name',
              align: 'left',
              sortable: true
            },
            {
              text: 'Draagmoeder',
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
              text: 'UELN',
              sortable: false
            },
            {
              text: 'Aangemaakt op',
              align: 'right',
              value: 'create_date',
              sortable: false
            },
          ]
        )
      }
      return "problem"
    }
  }
}
</script>
