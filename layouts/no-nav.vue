<template>
  <v-app>
    <v-app-bar clipped-left color="primary" app>
      <v-app-bar-title>{{ title }}</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <nuxt />
    </v-main>

    <v-footer app>
      <span>&copy; {{ title }} {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      title: 'Clairity Admin',
    }
  },
}
</script>

<style scoped>
.nuxt-link-active {
  text-decoration: none;
  color: white;
}
</style>
