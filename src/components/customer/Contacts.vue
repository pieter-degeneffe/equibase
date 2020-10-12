<template>
  <div>
    <v-data-table :headers="headers" :items="contacts" :loading="loading" loading-text="Bezig met laden...">
      <template v-slot:no-data>
          Geen klanten in de database
      </template>
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-spacer/>
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on }">
                <v-btn color="primary" dark class="mb-2" v-on="on">Contact toevoegen</v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field v-model="editedItem.first_name" label="Voornaam" outlined/>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field v-model="editedItem.last_name" label="Achternaam" outlined/>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field v-model="editedItem.telephone" label="Telefoon" outlined/>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field v-model="editedItem.email" label="Email" outlined/>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-select v-model="editedItem.role" :rules="required" :items="role" label="Rol" outlined/>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">Annuleer</v-btn>
                  <v-btn color="blue darken-1" text @click="save">Opslaan</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.action="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="deleteItem(item)">
            mdi-delete
          </v-icon>
        </template>
        <template v-slot:no-data>
          Deze klant heeft nog geen contacten
        </template>
      </v-data-table>
  </div>
</template>
<script>
import customerAPI from "@/services/CustomerAPI.js";
export default {
  props: ['customer'],
  data() {
    return {
      dialog: false,
      loading: true,
      role: ["Eigenaar bedrijf", "Boekhouder", "Transporteur", "Verantwoordelijke fokkerij"],
      headers: [
        { text: 'Voornaam', align: 'left', sortable: false, value: 'first_name' },
        { text: 'Achternaam', align: 'left', sortable: false, value: 'last_name' },
        { text: 'Telefoon', align: 'left', sortable: false, value: 'telephone' },
        { text: 'Email', align: 'left', sortable: false, value: 'email' },
        { text: 'Rol', align: 'left', sortable: false, value: 'role' },
        { text: 'Bewerken', align: 'right', value: 'action', sortable: false },
      ],
      contacts: [],
      editedIndex: -1,
      editedItem: {
        first_name: '',
        last_name: '',
        telephone: '',
        email: '',
        role: ''
      },
      required: [
        v => !!v || 'Dit veld is verplicht'
      ],
      defaultItem: {
        first_name: '',
        last_name: '',
        telephone: '',
        email: '',
        role: ''
      },
    };
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'Nieuw contact' : 'Contact bewerken'
    },
  },
  watch: {
    dialog (val) {
      val || this.close()
    },
  },
  created () {
    this.initialize()
  },
  methods: {
    initialize () {
      this.contacts = this.customer.contacts;
      this.loading = false;
    },
    editItem (item) {
      this.editedIndex = this.contacts.indexOf(item);
      this.editedItem = item;
      this.dialog = true;
    },
    deleteItem (item) {
      const index = this.contacts.indexOf(item);
      confirm('Are you sure you want to delete this item?') && this.contacts.splice(index, 1);
    },
    close () {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = this.defaultItem;
        this.editedIndex = -1;
      }, 300)
    },
    async save() {
      try {
        this.loading = true;
        if (this.editedIndex > -1) {
          Object.assign(this.contacts[this.editedIndex], this.editedItem)
          await customerAPI.updateContact(this.customer, this.editedItem);
        } else {
          this.contacts.push(this.editedItem)
          await customerAPI.addContact(this.customer, this.editedItem);
        }
      } catch (e) {
        this.errored = true;
      } finally {
        this.close()
        this.loading = false;
        this.snackbar = true;
      }
    },
  },
}
</script>
