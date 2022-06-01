<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col :cols="colCount">
        <v-card>
          <v-toolbar color="primary" flat dark>
            <v-toolbar-title>Login</v-toolbar-title>
          </v-toolbar>
          <v-card-text class="pb-0">
            <v-form ref="regForm" v-model="valid" on-submit="return false;">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="email"
                    label="Email"
                    :rules="emailRules"
                    required
                    prepend-icon="mdi-email"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" class="pb-0">
                  <v-text-field
                    v-model="pwd"
                    label="Password"
                    :rules="passwordRules"
                    required
                    prepend-icon="mdi-lock"
                    :append-icon="hide ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="hide ? 'password' : 'text'"
                    @click="passwordError = []"
                    @keydown.enter="login"
                    @click:append="() => (hide = !hide)"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-row>
              <v-col align="center" justify="center">
                <v-btn
                  class="mb-2"
                  color="primary"
                  :disabled="!valid"
                  @click="login"
                  >Log In</v-btn
                >
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  auth: 'guest',
  layout: 'no-nav',

  async asyncData({ store }) {
    await store.$axios.get('/healthcheck')
    return {}
  },

  data: () => ({
    email: '',
    hide: true,
    username: '',
    pwd: '',
    usernameError: [],
    valid: false,

    emailRules: [
      (v) => !!v || 'E-mail is required',
      (v) => /.+@.+/.test(v) || 'E-mail must be valid',
    ],
    passwordRules: [(v) => !!v || 'Password is required.'],
  }),

  computed: {
    colCount() {
      return this.$mainCardColCount()
    },
  },

  methods: {
    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms))
    },
    async login() {
      try {
        const tokenInfo = await this.$axios.post('/v1/auth/login', {
          email: this.email,
          password: this.pwd,
        })
        await this.$auth.setUserToken(
          tokenInfo.data.id_token,
          tokenInfo.data.refresh_token
        )

        await this.sleep(500)
        await this.$router.push('/')
        this.$toast.global.welcome(`Welcome ${tokenInfo.data.email}!`)
      } catch (e) {
        alert(e)
      }
    },
  },
}
</script>
