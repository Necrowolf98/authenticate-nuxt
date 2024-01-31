// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      appUrl: process.env.NUXT_PUBLIC_APP_URL,
      apiUrl: process.env.NUXT_PUBLIC_API_URL
    }
  },
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
  ]
})