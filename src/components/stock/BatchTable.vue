<template>
  <v-card flat>
    <v-data-table :headers="headers" :items="batches">
      <template v-slot:no-data>
        Geen batches gevonden
      </template>
      <template v-slot:top>
      <tr>
        <td>
          <v-edit-dialog @save="save" :return-value.sync="props.item.lotNumber">
            <div>{{ props.item.lotNumber }}</div>
            <template v-slot:input>
              <v-text-field
                  v-model="props.item.lotNumber"
                  label="Edit"
                  single-line
                  counter
                  autofocus
              ></v-text-field>
            </template>
          </v-edit-dialog>
        </td>
      </tr>
    </template>
      <template v-slot:item="props">
        <tr>
          <td>{{ props.item.lotNumber }}</td>
          <td>{{ new Date(props.item.expirationDate) | dateFormat('DD/MM/YY') }}</td>
          <td>{{ new Date(props.item.deliveryDate) | dateFormat('DD/MM/YY') }}</td>
          <td>{{ props.item.supplier }}</td>
          <td>{{ props.item.buyInPrice }}</td>
          <td>{{ props.item.initialAmount }}</td>
          <td>{{ props.item.remainingAmount }}</td>
          <td>{{ new Date(props.item.updatedAt) | dateFormat('DD/MM/YY') }}</td>
        </tr>
      </template>
    </v-data-table>
    <v-speed-dial v-model="fab" absolute left direction="right" :transition="transition">
      <template v-slot:activator>
        <v-btn v-model="fab" color="primary" dark fab>
          <v-icon v-if="fab">mdi-close</v-icon>
          <v-icon v-else>mdi-cog</v-icon>
        </v-btn>
      </template>
      <v-btn color="primary" fab dark small @click="makeRow">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <v-btn fab dark small color="green">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn fab dark small color="red">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-speed-dial>
    <v-alert type="error" v-if="errored">
      {{ errorMessage }}
    </v-alert>
  </v-card>
</template>

<script>
  import {stockAPI} from '@/services'

  export default {
    props: ['id', 'headers', 'batches', 'product', 'errored', 'errorMessage', 'loading'],
    data() {
      return {
        fab: false,
        tabs: null,
        direction: 'right',
        transition: 'slide-y-reverse-transition',
      };
    },
    methods: {
      save () {

      },
      mouseOver(hoverState) {
        hoverState ? document.body.style.cursor = 'default' : document.body.style.cursor = 'default';
      },
      async createBatch() {
        this.errored = false;
        try {
          const { data } = await stockAPI.postStock(this.product);
          this.batches = data;
        } catch (err) {
          this.errored = true;
          this.errorMessage = err.response.data.message;
        } finally {
          this.loading = false;
        }
      },
      makeRow() {
        this.batches.unshift({
          lotNumber: '',
          expirationDate: new Date(),
          deliveryDate: new Date(),
          supplier: '',
          buyInPrice : 0,
          initialAmount: 0,
          remainingAmount: 0,
          updatedAt: new Date()
        });
      }
    },
  }
</script>