// nuxt.config.ts
import pkg from "./package.json";

export default defineNuxtConfig({
  devtools: { enabled: false },

  modules: [
    "@vueuse/nuxt",
    "@nuxt/ui",
    "@nuxt/image",
    "notivue/nuxt",
    "@nuxtjs/i18n",
  ],

  i18n: {
    defaultLocale: "en",
    strategy: "prefix_except_default",
    langDir: "locales",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root",
      alwaysRedirect: true,
    },
    locales: [
      { code: "en", iso: "en-GB", file: "en-GB.json", name: "🇬🇧 English" },
      { code: "nb", iso: "nb-NO", file: "nb-NO.json", name: "🇳🇴 Norsk (Bokmål)" },
      { code: "nl", iso: "nl-NL", file: "nl-NL.json", name: "🇳🇱 Nederlands" },
      { code: "de", iso: "de-DE", file: "de-DE.json", name: "🇩🇪 Deutsch" },
    ],
  },

  notivue: {
    position: "top-center",
    limit: 3,
    notifications: {
      global: {
        duration: 3000,
      },
    },
  },

  css: ["~/assets/css/notivue.css"],

  runtimeConfig: {
    gqlHost: process.env.GQL_HOST || "",
    public: {
      version: pkg.version,
    },
  },

  nitro: {
    preset: "node-server",
    prerender: {
      routes: ["/sitemap.xml", "/robots.txt"],
    },
  },

  compatibilityDate: "2025-01-01",
});