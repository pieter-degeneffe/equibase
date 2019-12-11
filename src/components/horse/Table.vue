<template>
  <div>
    <v-data-table :headers="headers" :items="horses" :loading="loading" loading-text="Bezig met laden..." class="ma-4">
      <template v-slot:top>
        <v-toolbar-title>{{ tableName }}</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
      </template>
      <template v-slot:item="props">
        <tr @click="openHorsePage(props.item._id)" @mouseover="mouseOver(true)" @mouseleave="mouseOver(false)">
          <td>{{ props.item.name }}</td>
          <td>{{ props.item.father }} & {{ props.item.grandfather }}</td>
          <td>{{ props.item.type }}</td>
          <td>{{ new Date(props.item.createdAt) | dateFormat('DD/MM/YY')}}</td>
        </tr>
      </template>
    </v-data-table>
    <v-btn bottom color="primary" class="ma-2 white--text" depressed dark @click="openHorsePage()" fixed right>
      {{ $route.name }} toevoegen
      <v-icon right dark>mdi-plus</v-icon>
    </v-btn>
  </div>
</template>
<script>
export default {
  props: ['horses', 'loading', 'tableName'],
  data() {
    return {
      errored: false,
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
  methods: {
    openHorsePage(id){
      if (id) {
        this.$router.push({ name: 'horse', params: { id: id }})
      } else {
        this.$router.push({ name: 'horse', query: { type: this.$route.name } })
      }
    },
    mouseOver(hoverState) {
      hoverState ? document.body.style.cursor = "pointer" : document.body.style.cursor = "default";
    }
  },
}
</script>
