<template>
  <v-card flat>
    <v-form ref="form" v-model="valid">
      <v-container>
        <v-row dense>
          <v-col cols="12" md="4">
            <v-text-field
                :rules="[(v) => !!v || 'Dit veld is verplicht']"
                v-model="icsi.code" label="Code ICSI"
                :disabled="icsi.active" :loading="loading" outlined/>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
                :rules="[(v) => v>0  || 'Dit veld is verplicht en moet groter zijn dan 0']"
                v-model="icsi.amount" label="Aantal embryos" outlined type="number" :loading="loading"/>
          </v-col>
          <v-col cols="12" md="4">
            <select-customer :owner="icsi.owner" @update-customer="updateCustomer" :loading="loading" label="Eigenaar"/>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12" md="4">
            <v-select
                v-model="icsi.donor_mare"
                :items="mares"
                item-value="_id"
                item-text="name"
                label="Donor merrie"
                :loading="loading"
                :rules="[(v) => !!v || 'Dit veld is verplicht']"
                required
                outlined
                clearable
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-select
                v-model="icsi.donor_stallion"
                :items="stallions"
                item-value="_id"
                item-text="name"
                label="Donor hengst"
                :loading="loading"
                :rules="[(v) => !!v || 'Dit veld is verplicht']"
                required
                outlined
                clearable
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-select v-model="icsi.collectionColor" :items="collectionColors" label="Kleur rietjes"
                      outlined/>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12" md="4">
            <v-menu
                v-model="collectionDateMenu" :close-on-content-click="false" :nudge-right="40"
                transition="scale-transition" offset-y min-width="290px">
              <template v-slot:activator="{ on }">
                <v-text-field
                    :rules="[(v) => !!v || 'Dit veld is verplicht']"
                    v-model="computedCollectionDateFormatted"
                    label="Datum import"
                    v-on="on"
                    readonly
                    outlined
                    :loading="loading"
                />
              </template>
              <v-date-picker
                  required
                  v-model="icsi.collectionDate"
                  locale="nl"
                  first-day-of-week="1"
                  no-title
                  @input="collectionDateMenu = false"
              />
            </v-menu>
          </v-col>
          <v-col cols="12" md="4">
            <v-select v-if="icsi.location" v-model="icsi.location.container"
                      :items="nitrogenContainers" item-text="name" item-value="_id" label="Locatie - stikstof vat"
                      outlined return-object required :rules="[(v) => !!v || 'Dit veld is verplicht']"/>
          </v-col>
          <v-col cols="12" md="4">
            <v-select
                outlined
                required
                v-if="icsi.location.container"
                v-model="icsi.location.tube"
                :items="tubesAvailable(icsi.location.container)"
                label="Locatie - stikstof vat - koker"
                :rules="[(v) => !!v || 'Dit veld is verplicht']"
            />
          </v-col>
        </v-row>
        <v-alert type="error" v-if="errored">
          {{ errorMessage }}
        </v-alert>
        <v-row justify="end" dense>
          <v-btn v-if="!icsi._id" :disabled="!valid" color="success" class="mr-4" @click="createICSI()" depressed>
            ICSI opslaan
          </v-btn>

          <v-btn v-if="icsi._id" :disabled="!valid" color="success" depressed class="mr-4" @click="updateICSI()">
            {{ icsi.type }} bijwerken
          </v-btn>
          <v-btn v-if="icsi._id" color="warning" depressed @click="deleteDialog = true">
            {{ icsi.type }} verwijderen
          </v-btn>
          <v-dialog v-model="deleteDialog" persistent max-width="350">
            <v-card>
              <v-card-title class="headline">ICSI verwijderen?</v-card-title>
              <v-card-text>Ben je zeker dat je het lot {{ icsi.code }} wilt verwijderen? Dit kan niet meer ongedaan
                gemaakt worden
              </v-card-text>
              <v-card-actions>
                <v-spacer/>
                <v-btn color="success" depressed @click="deleteDialog = false">Annuleren</v-btn>
                <v-btn color="error" depressed @click="deleteICSI()">Verwijderen</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
        <v-snackbar v-model="snackbar">
          ICSI is succesvol opgeslaan
          <v-btn color="pink" text @click="snackbar = false">
            sluiten
          </v-btn>
        </v-snackbar>
      </v-container>
    </v-form>
  </v-card>
</template>
<script>
  import selectCustomer from '@/components/customer/SelectCustomer';
  import { colors } from '@/consts';
  import { horseAPI, icsiAPI, locationAPI, nitrogenContainerAPI } from '@/services/';

  export default {
    props: ['icsi', 'loading'],
    data() {
      return {
        errored: false,
        deleteDialog: false,
        errorMessage: '',
        valid: false,
        snackbar: false,
        locations: null,
        mares: [],
        stallions: [],
        required: [
          v => !!v || 'Dit veld is verplicht'
        ],
        nitrogenContainers: [],
        collectionDateMenu: false,
        collectionColors: colors,
        search: null,
        owner: '',
      };
    },
    mounted() {
      this.getLocations();
      this.getHorses();
      this.getNitrogenContainers();
    },
    methods: {
      tubesAvailable(container) {
        if (container) {
          let tubesAvailable = [];
          for (let i = 1; i <= container.available_places; i++) {
            tubesAvailable.push({
              text: `koker ${ i }`,
              value: i
            });
          }
          return tubesAvailable;
        }
      },
      async getNitrogenContainers() {
        try {
          const response = await nitrogenContainerAPI.getNitrogenContainers();
          this.nitrogenContainers = response.data;
        } catch (err) {
          this.errored = true;
          this.errorMessage = err.response.data.message;
        }
      },
      async getLocations() {
        try {
          const response = await locationAPI.getLocations();
          this.locations = response.data;
        } catch (e) {
          this.errored = true;
        }
      },
      async getHorses() {
        try {
          const response = await horseAPI.getHorses();
          response.data.horses.forEach(horse => horse.type === 'merrie' ? this.mares.push(horse) : this.stallions.push(horse));
        } catch (e) {
          this.errored = true;
          this.errorMessage = e.errorMessage;
        }
      },
      async createICSI() {
        this.errored = false;
        try {
          await icsiAPI.postICSI(this.icsi);
          this.snackbar = true;
          await this.$router.push(`/icsi`);
          this.errored = false;
        } catch (err) {
          this.errored = true;
          this.errorMessage = err.response.data.message;
        }
      },
      async updateICSI() {
        this.errored = false;
        try {
          await icsiAPI.putICSI(this.icsi);
          await this.$router.push('/icsi');
          this.snackbar = true;
        } catch (e) {
          this.errored = true;
          this.errorMessage = e.response.data.message;
        }
      },
      async deleteICSI() {
        try {
          await icsiAPI.deleteICSI(this.icsi._id);
        } catch (e) {
          this.errored = true;
          this.errorMessage = e.response.data.message;
        } finally {
          this.$router.go(-1);
          this.dialog = false;
        }
      },
      updateCustomer(customer) {
        this.icsi.owner = customer._id;
      },
      formatDate(date) {
        if (!date) return null;
        date = new Date(date).toISOString().substr(0, 10);
        const [year, month, day] = date.split('-');
        return `${ day }/${ month }/${ year }`;
      },
      validate() {
        if (this.$refs.form.validate()) {
          this.snackbar = true;
        }
      },
    },
    computed: {
      computedCollectionDateFormatted() {
        return this.formatDate(this.icsi.collectionDate);
      },
    },
    components: {
      selectCustomer
    },
  };
</script>
