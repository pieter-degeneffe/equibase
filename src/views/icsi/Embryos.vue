<template>
    <EmbryoTable :id="$route.params.id"/>
</template>

<script>
  import EmbryoTable from '@/components/icsi/EmbryoTable';

  export default {
    components: {
      EmbryoTable
    }
  };
</script>

<style scoped>

</style>
