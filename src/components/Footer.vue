<template>
  <v-layout>
    <v-card width="100%" height="50px" style="position: fixed; bottom: 0; z-index: 999;">
      <v-footer absolute class="font-weight-medium">
        <span style="position: absolute; right: 100px; top: 10px;">
          <strong>© CODA Collaborative</strong>, 
          2020-{{ new Date().getFullYear() }}
        </span>
      </v-footer>
    </v-card>
  </v-layout>
</template>
