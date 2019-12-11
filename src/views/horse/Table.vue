<template>
  <v-card class="ma-5" outlined>
    <horse-table :horses="horses" :loading="loading" :tableName="tableName"></horse-table>
  </v-card>
</template>
<script>
import horseAPI from "@/services/HorseAPI.js";
import horseTable from "@/components/horse/Table";
export default {
  data() {
    return {
      errored: false,
      loading: true,
      horses: [],
    };
  },
  computed: {
    tableName () {
      if (this.$route.name === 'hengst') {
        return "Hengsten"
      } else {
        return "Merries"
      }
    }
  },
  created() {
    this.loadHorses();
  },
  watch: {
    '$route': 'loadHorses'
  },
  methods: {
    async loadHorses() {
      try {
        const response = await horseAPI.getHorses(this.$route.name);
        this.horses = response.data;
      } catch (e) {
        this.errored = true;
      } finally {
        this.loading = false;
      }
    },
  },
  components: {
    horseTable
  },
};
</script>
