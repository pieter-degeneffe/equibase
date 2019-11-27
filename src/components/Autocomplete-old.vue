<template>
  <div>
    <v-autocomplete
      :items="items"
      label="Eigenaar"
      :placeholder="ownerFullName"
      outlined

      v-model="select"
      item-text="first_name"
      item-value="_id"
    ></v-autocomplete>
  </div>
</template>
// @change="updateOwner(owner)"
<script>
  export default {
    props: ['owner'],
    data() {
      return {
        customers: [
          {
              "horses": [
                  "5db7536c04be6e426adc0a62",
                  "5dc1351e27843ba38a96718c"
              ],
              "_id": "5dd64b110ec8902dba910d3e",
              "first_name": "wim",
              "last_name": "degeneffe",
              "language": "NL",
              "email": "wim@hofterleeuwe.be",
              "createdAt": "2019-11-21T08:30:09.335Z",
              "updatedAt": "2019-11-21T14:29:01.826Z",
              "__v": 0
          },
          {
              "horses": [],
              "_id": "5dd69f3ce68704449cf406c5",
              "first_name": "pieter",
              "last_name": "degeneffe",
              "language": "NL",
              "email": "pieter@design8.be",
              "createdAt": "2019-11-21T14:29:16.590Z",
              "updatedAt": "2019-11-21T14:29:16.590Z",
              "__v": 0
          }
        ],
        select: null
      };
    },
    watch: {
      select(value) {
        this.$emit('update-owner', value ? value.value : null);
      }
    },
    computed: {
      items () {
        return this.customers.map(customer => customer.first_name + ' ' + customer.last_name);
      },
      ownerFullName () {
        return this.owner.first_name + ' ' + this.owner.last_name;
      }
    },
    // methods: {
    //   updateOwner(owner) {
    //     console.log
    //     this.$emit('update-owner', owner)
    //   }
    // }
  }
</script>
