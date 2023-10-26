<template>
  <BNavbar id="nav" toggleable="lg" variant="faded" type="light">
    <BNavbarBrand href="/">
      <img alt="Vue logo" src="../assets/logo.png" width="30" height="30" class="d-inline-block align-top">
      CODA
    </BNavbarBrand>

    <BNavbarToggle target="nav-collapse"></BNavbarToggle>

    <BCollapse id="nav-collapse" class="mr-lg-5" is-nav>
      <BNavbarNav>
        <BNavItem>
          <router-link to="/" class="nav-link">{{ $t('homeTxt') }}</router-link>
        </BNavItem>
        <BNavItem>
          <router-link to="/stats" class="nav-link">{{ $t('statsTxt') }}</router-link>
        </BNavItem>
        <BNavItem>
          <router-link to="/learning" class="nav-link">{{ $t('learningTxt') }}</router-link>
        </BNavItem>
        <BNavItem>
          <router-link to="/connections" class="nav-link">{{ $t('activeConnectionsTxt') }}</router-link>
        </BNavItem>
        <BNavItem target="_blank" :href="goToApiDocs()">
          <span class="nav-link">{{ $t('docsApiTxt') }}</span>
        </BNavItem>
      </BNavbarNav>
    </BCollapse>

    <BNavbarNav right style="flex-direction: row; place-content: flex-end;flex: 1 1 auto;margin-top: 10px;">
      <BNavItem id="currentDate">
        {{ new Date().toLocaleDateString("en-US") }}
      </BNavItem>
      <BNavItem class="nav-link warn" v-if="!isHubConnected">{{ $t('hubNotConnectedTxt') }}</BNavItem>
      <BNavItem>
        <BButton variant="info" @click="keycloak.logout()">{{ $t('logoutTxt') }}</BButton>
      </BNavItem>
      <BNavItem id="langBtn" @click="toggleLocale">{{ $t('langTxt') }}</BNavItem>
    </BNavbarNav>
  </BNavbar>

</template>

<script>

import GeneralApi from "@/api/GeneralApi";

export default {
  name: "AppHeader",
  props: ['keycloak'],
  data() {
    return {
      isHubConnected: false,
      form: {
        id: null,
        passwd: null
      }
    };
  },
  created() {
    GeneralApi.isConnected()
      .then(() => this.isHubConnected = true)
      .catch(() => this.isHubConnected = false);


    // console.info('Component has been created!' + JSON.stringify(GeneralApi.isConnected()));
  },
  methods: {
    toggleLocale() {
      this.$i18n.locale = this.$i18n.locale === 'en' ? 'fr' : 'en';
    },
    goToApiDocs() {
      return 'https://coda-api-doc.netlify.app/';
    }
  }
}


</script>
