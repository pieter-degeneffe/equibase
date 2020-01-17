<template>
  <div>
    <p>Sperma afname tabblad: {{ test }}</p>
  </div>
</template>
<script>
export default {
  data() {
    return {
      test: "test"
    };
  },
  mounted () {
    this.testfunction()
  },
  methods: {
    testfunction() {
      console.log("Sperma tab geladen")
    }
  }
}
</script>
