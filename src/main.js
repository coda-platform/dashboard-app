import { createApp, h } from 'vue';
import App from './App.vue'
import router from './router/router'
import "./assets/scss/style.scss"
import underscore from 'vue-underscore';
import vuetify from './plugins/vuetify';
import VueLogger from 'vuejs-logger';
import { createI18n } from 'vue-i18n';
import keycloak from './keycloak';
import TokenContext from './api/TokenContext';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUserSecret } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import version from "./utils/version";
import publicRouter from './router/publicRouter'
import mitt from 'mitt';

import en from './plugins/lang/en'
import fr from './plugins/lang/fr'

const app = createApp(App)

import { configureCompat } from 'vue'
configureCompat({
  "MODE": 2,
  "RENDER_FUNCTION": false,
  "WATCH_ARRAY": false,
  "COMPONENT_ASYNC": false
});

app.mixin({
  data: function () {
    return {
      dashboardApiUrl: process.env.CODA_DASHBOARD_API_URL
    }
  }
})

app.use(publicRouter)
app.use(underscore)
app.use(VueLogger, { logLevel: 'debug' });
library.add(faUserSecret);

app.component('font-awesome-icon', FontAwesomeIcon);
app.config.productionTip = false

app.use();

console.log(`⚡️[coda-dashboard-frontend]: Running ${version.getBuildVersion()} version of build`);

export const bus = mitt()

keycloak.init({ onLoad: 'login-required' }).then(async (auth) => {

  if (!auth) {
    window.location.reload();
  } else {
    app.$log.info("Authenticated");

    TokenContext.setToken(keycloak.token);

    const i18n = createI18n({
      legacy: false,
      locale: "en",
      fallbackLocale: "fr",
      globalInjection: true,
      runtimeOnly: false,
      messages: { en, fr }
    })
    const loggedInApp = createApp(App)
    loggedInApp.use(i18n)
    loggedInApp.use(router)
    loggedInApp.use(vuetify)
    loggedInApp.render = () => h(App, { props: { keycloak: keycloak } })
    loggedInApp.mount('#app')

  }

  //Token Refresh
  setInterval(() => {
    keycloak.updateToken(70).then((refreshed) => {
      if (refreshed) {
        app.$log.info('Token refreshed' + refreshed);
        TokenContext.setToken(keycloak.token);
      } else {
        // We can re-enable this later if we need.
        //Vue.$log.warn('Token not refreshed, valid for ' + Math.round(keycloak.tokenParsed.exp + keycloak.timeSkew - new Date().getTime() / 1000) + ' seconds');
      }
    }).catch(() => {
      app.$log.error('Failed to refresh token');
    });
  }, 6000)

}).catch(() => {
  app.$log.error("Authenticated Failed");
})