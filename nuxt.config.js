import colors from 'vuetify/es5/util/colors'

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s | Admin Portal for Clairity',
    title: 'Clairity Admin',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [
      {
        src: '//static.filestackapi.com/filestack-js/3.x.x/filestack.min.js',
      },
    ],
  },

  target: 'static',

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ['~/plugins/resize.js'],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    '@nuxtjs/toast',
  ],

  auth: {
    redirect: {
      login: '/login',
      home: '/',
      logout: '/login',
    },

    strategies: {
      local: {
        scheme: 'refresh',
        token: {
          property: 'id_token',
          maxAge: 3600,
          global: true,
          // type: 'Bearer'
        },
        refreshToken: {
          property: 'refresh_token',
          data: 'refresh_token',
          maxAge: false,
        },
        user: {
          property: false,
        },
        endpoints: {
          login: { url: '/v1/auth/login', method: 'post' },
          refresh: { url: '/v1/auth/refresh', method: 'post' },
          user: { url: '/v1/auth/me', method: 'get', propertyName: false },
          logout: {
            url: '/v1/auth/logout',
            method: 'post',
            propertyName: false,
          },
        },
        // autoLogout: false
      },
    },
  },

  router: {
    middleware: ['auth'],
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: 'https://api.getclairity.io',
    // baseURL: 'http://localhost:8000',
    credentials: false,
    proxyHeaders: false,
  },

  https: true,

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },

  toast: {
    theme: 'toasted-primary',
    position: 'top-center',
    duration: 3000,
    register: [
      {
        name: 'user_success',
        message: (message) => `✅ ${message}`,
        options: {
          type: 'success',
          action: {
            text: 'Close',
            onClick: (_, toastObject) => {
              toastObject.goAway(0)
            },
          },
        },
      },
      {
        name: 'user_info',
        message: (message) => `${message}`,
        options: {
          type: 'info',
          action: {
            text: 'Close',
            onClick: (_, toastObject) => {
              toastObject.goAway(0)
            },
          },
        },
      },
      {
        name: 'welcome',
        message: (message) => `👋 ${message}`,
        options: {
          position: 'top-right',
          action: {
            text: 'Close',
            onClick: (_, toastObject) => {
              toastObject.goAway(0)
            },
          },
        },
      },
    ],
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
}
