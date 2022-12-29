<template>
  <v-app dark>
    <v-navigation-drawer v-model="drawer" clipped app>
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar clipped-left app color="primary">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-app-bar-title to="/">{{ title }}</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-menu bottom offset-y>
        <template #activator="{ attrs, on }">
          <v-btn class="mx-2" icon v-bind="attrs" v-on="on">
            <v-avatar color="secondary" v-text="initials()"></v-avatar>
          </v-btn>
        </template>
        <v-list nav dense>
          <v-list-item link>
            <v-list-item-icon>
              <v-icon v-text="signOutItem.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-title
              @click="signout"
              v-text="signOutItem.title"
            ></v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer :absolute="!fixed" app>
      <span>&copy; {{ title }} {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-home',
          title: 'Home',
          to: '/',
        },
        {
          icon: 'mdi-test-tube',
          title: 'Sandbox',
          to: '/sandbox',
        },
        {
          icon: 'mdi-thought-bubble',
          title: 'My Thoughts',
          to: '/thoughts',
        },
        {
          icon: 'mdi-meditation',
          title: 'Meditations',
          to: '/meditations',
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      signOutItem: {
        icon: 'mdi-launch',
        title: 'Sign Out',
      },
      title: 'Clairity Admin',
    }
  },
  methods: {
    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms))
    },
    initials() {
      const email = this.$auth.user.email
      if (email == null || email === 0) {
        return 'U'
      }
      return email.charAt(0).toUpperCase()
    },
    async signout() {
      await this.$auth.logout()
      await this.sleep(500)
      await this.$router.push('/')
    },
  },
}
</script>
