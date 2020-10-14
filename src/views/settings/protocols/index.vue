<template>
  <div>
    <protocolsTable :headers="headers" :title="title"/>
    <v-btn button color="primary" class="ma-2" depressed dark @click="openProtocolPage()" fixed bottom right>
      protocol toevoegen
      <v-icon right dark>mdi-plus</v-icon>
    </v-btn>
  </div>
</template>

<script>
import protocolsTable from '@/components/protocols/Table';

export default {
  components: { protocolsTable },
  data() {
    return {
      title: 'Protocolen',
      headers: [
        {text: 'Protocolnaam', value: 'name', selected: true},
        {text: 'Account', value: 'account', selected: true},
        {text: 'Prijs', value: 'price', selected: true},
        {text: 'Vaste prijs', value: 'fixedPrice', selected: true},
        {text: 'BTW', value: 'tax', align: 'left', selected: true},
        {text: '', value: 'action', align: 'end', sortable: false, selected: true},
      ],
    };
  },
  methods: {
    openProtocolPage() {
      console.log('todo');
    }
  }
}
</script>
