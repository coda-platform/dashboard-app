<template>
  <v-container class="mainContainer">
    <div class="request">
      <h1>{{ $t("requestAccessTxt") }}</h1>
    </div>
    <div class="text">
      <p>{{ $t("requestAccessDescriptionTxt") }}</p>
      <a :href="$t('mailRequestAccessTxt')" target="_blank"
        >team@coda-platform.com</a
      >
    </div>
  </v-container>
</template>
<script>
export default {
  name: "ContactRequest",
  data() {
    return {};
  },
  methods: {},
};
</script>