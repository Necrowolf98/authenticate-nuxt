// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      appUrl: process.env.NUXT_PUBLIC_APP_URL,
      apiUrl: process.env.NUXT_PUBLIC_API_URL
    }
  },
  devtools: { enabled: true },
  app: {
    head: {
      title: 'Anthony S.A',
      link: [
        {
          id: 'theme-css',
          rel: 'stylesheet',
          type: 'text/css',
          href: '/themes/saga-blue/theme.css'          
        }
      ]
    }
  },
  modules: [
    '@pinia/nuxt',
    'nuxt-primevue',
    '@nuxtjs/tailwindcss',
  ],
  css: [
    './assets/css/app.css',
    'primeicons/primeicons.css',
    'primevue/resources/primevue.min.css',
  ],
})
