import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#314d9e',
        secondary: '#e9622c',
        // succes: '',
        // accent: '#8c9eff',
        // error: '#b71c1c',
      },
    },
  },
});
