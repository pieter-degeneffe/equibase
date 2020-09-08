<template>
  <v-card class="ma-5">
    <v-toolbar flat color="primary" dark>
      <v-toolbar-title>{{ product }}</v-toolbar-title>
    </v-toolbar>
    <v-data-table :headers="headers" :items="batches">
      <template v-slot:no-data>
        Geen batches gevonden
      </template>
      <template v-slot:item="props">
        <tr>
          <td>{{ props.item.lotNumber }}</td>
          <td>{{ new Date(props.item.expirationDate) | dateFormat('DD/MM/YY') }}</td>
          <td>{{ new Date(props.item.deliveryDate) | dateFormat('DD/MM/YY') }}</td>
          <td>{{ props.item.supplier }}</td>
          <td>{{ new Date(props.item.updatedAt) | dateFormat('DD/MM/YY') }}</td>
          <td>{{ props.item.initialAmount }}</td>
          <td>{{ props.item.remainingAmount }}</td>
        </tr>
      </template>
    </v-data-table>
    <v-alert type="error" v-if="errored">
      {{ errorMessage }}
    </v-alert>
  </v-card>
</template>

<script>
  import { stockAPI } from "@/services";

  export default {
    props: ['id', 'headers'],
    data() {
      return {
        batches: [],
        product: '',
        errored: false,
        errorMessage: '',
        loading: false,
      };
    },
    mounted() {
      this.getStockProduct(this.id);
    },
    methods: {
      async getStockProduct(id) {
        this.loading = true;
        try {
          const { data: { batches, name} } = await stockAPI.getStockProduct(id);
          this.batches = batches;
          this.product = name
        } catch (err) {
          this.errored = true;
          this.errorMessage = err.response.data.message;
        } finally {
          this.loading = false;
        }
      }
    },
  }
</script>