import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router'
import { Auth0Plugin } from "./auth";
import { domain, clientId } from "../auth_config.json";

//instance properties
Vue.prototype.$appName = 'Equibase'

Vue.config.productionTip = false

Vue.use(Auth0Plugin, {
  domain,
  clientId,
  onRedirectCallback: appState => {
    router.push(
      appState && appState.targetUrl
        ? appState.targetUrl
        : window.location.pathname
    );
  }
});

Vue.filter('capitalize', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
