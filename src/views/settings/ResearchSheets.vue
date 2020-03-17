<template>
  <div>
    <v-card class="mx-5 mt-5 mb-12" outlined>
      {{ horses }}
      <v-data-table :headers="headers" :items="horses" :loading="loading" loading-text="Bezig met laden..." class="ma-5">
        <template v-slot:item="props">
          <tr>
            <td>{{ props.item.name }}</td>
            <td>{{ props.item.surrogate_uid }}</td>
            <td>{{ props.item.microchip }}</td>
            <td><span v-if="props.item.location">{{ props.item.location.name }}</span></td>
            <td><span v-if="props.item.date_of_birth">{{ new Date(props.item.date_of_birth) | dateFormat('DD/MM/YY')}}</span></td>
          </tr>
        </template>
      </v-data-table>
      <v-btn bottom color="primary" class="ma-2 white--text" depressed dark @click="downloadResearchSheet()" fixed right>
        onderzoeksfiche downloaden
        <v-icon right dark>mdi-arrow-collapse-down</v-icon>
      </v-btn>
    </v-card>
  </div>
</template>
<script>
import horseAPI from "@/services/HorseAPI.js";
import jsPDF from 'jspdf';
export default {
  data () {
    return {
      horses: [],
      headers: [
        { text: 'Naam', value: 'name', align: 'left', sortable: true, selected: true },
        { text: 'Brandnummer', value: 'surrogate_uid', align: 'left', sortable: false, selected: false },
        { text: 'Microchip', value: 'microchip', align: 'left', selected: false},
        { text: 'Locatie', value: 'location', align: 'left', sortable: true, selected: true},
        { text: 'Geboortedatum', value: 'date_of_birth', selected: false}
      ],
      loading: true,
      errored: false,
      errorMessage: '',
      URLParameters: {
        type: 'merrie',
        death: false,
        surrogate: true,
        location: true,
        date_of_birth: true,
        surrogate_uid: true,
        microchip: true
      }
    }
  },
  mounted () {
    this.getHorses()
  },
  methods: {
    async getHorses() {
      this.loading = true;
      try {
        const response = await horseAPI.getHorses(this.URLParameters);
        this.horses = response.data.horses;
        this.totalHorses = response.data.total
      } catch (e) {
        this.errored = true;
        this.errorMessage = e.response.data.message;
      } finally {
        this.loading = false;
      }
    },
    downloadResearchSheet () {
      const researchSheet = new jsPDF();
      // researchSheet.line(0, 30, 210, 30 );
      for (let i=0; i < this.horses.length; i++) {
        researchSheet.line(0, 30, 210, 30 );
        researchSheet.line(25, 0, 25, 297);
        researchSheet.setFontSize(14);
        researchSheet.text(new Date().getFullYear().toString(), 6, 26);
        researchSheet.text(new Date(this.horses[i].date_of_birth).getFullYear().toString(), 205, 10, {'align': 'right'});
        researchSheet.text(this.horses[i].microchip, 205, 18, {'align': 'right'});
        researchSheet.text(this.horses[i].surrogate_uid, 205, 26, {'align': 'right'});
        researchSheet.setFontSize(20);
        researchSheet.setFontStyle("bold");
        researchSheet.text(this.horses[i].name.toUpperCase(), 30, 26);
        researchSheet.setFontStyle("normal");
        researchSheet.addPage();
        researchSheet.line(0, 30, 210, 30 );
        researchSheet.line(25, 0, 25, 297);
        researchSheet.setFontSize(14);
        researchSheet.text(new Date().getFullYear().toString(), 6, 26);
        researchSheet.text(new Date(this.horses[i].date_of_birth).getFullYear().toString(), 205, 10, {'align': 'right'});
        researchSheet.text(this.horses[i].microchip, 205, 18, {'align': 'right'});
        researchSheet.text(this.horses[i].surrogate_uid, 205, 26, {'align': 'right'});
        researchSheet.setFontSize(20);
        researchSheet.setFontStyle("bold");
        researchSheet.text(this.horses[i].name.toUpperCase(), 30, 26);
        researchSheet.setFontStyle("normal");
        researchSheet.addPage();
      }
      researchSheet.save('onderzoeksfiches.pdf');
    }
  }
}
</script>
