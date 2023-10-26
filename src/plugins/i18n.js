import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueI18n from "@intlify/vite-plugin-vue-i18n";
import { en } from "./lang/en";
import { fr } from "./lang/fr";

export default defineConfig({
  plugins: [
    vue(),
    vueI18n({
      locale: "en",
      fallbackLocale: "fr",
      messages: { en, fr },
      runtimeOnly: false,
    }),
  ],
});
