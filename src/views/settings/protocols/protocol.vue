<template>
  <protocol-form
      :protocol="protocol"
      :loading="loading"
      callbackURL="/settings/protocols"
      :disabled="disabled"
      @update-protocol="updateProtocol"
  />
</template>

<script>
import protocolAPI from '@/services/ProtocolAPI';
import protocolForm from '@/components/protocols/Form';

export default {
  components: {protocolForm},
  props: ['id'],
  data() {
    return {
      disabled: false,
      protocol: {},
      loading: null,
      errored: false,
      errorMessage: '',
    }
  },
  beforeMount() {
    if (this.id !== 'undefined') {
      this.getProtocol(this.id);
    }
  },
  methods: {
    async getProtocol(id) {
      try {
        this.loading = true;
        const { data } = await protocolAPI.getProtocol(id);
        this.protocol = data;
      } catch (err) {
        this.errored = true;
        this.errorMessage = err.response.data.message;
      } finally {
        this.loading = false
      }
    },
    updateProtocol(protocol) {
      this.protocol = protocol;
    }
  }
}
</script>
