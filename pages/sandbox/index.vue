<template>
  <v-container>
    <v-form ref="getDistortionsForm" v-model="valid">
      <v-card>
        <v-card-title>
          <span class="headline">Check Distortions</span>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-textarea
                v-model="text"
                outlined
                label="Text"
                required
                :errors="textErrors"
                :rules="textRules"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-row>
            <v-col align="center" justify="center">
              <v-btn class="mb-2" color="secondary" @click="clearData()"
                >Clear</v-btn
              >
              <v-btn
                class="mb-2"
                color="primary"
                :disabled="!valid"
                @click="getDistortions()"
                >Check Thought</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-form>
    <v-list>
      <v-list-item v-for="(score, distortion) in distortions" :key="distortion">
        <v-list-item-content>
          <v-list-item-title
            >{{ distortion }}: {{ score.toFixed(3) }}</v-list-item-title
          >
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<script>
export default {
  async asyncData({ store }) {
    await store.$axios.get('https://nlp.getclairity.io/healthcheck')
    return {}
  },

  data() {
    return {
      text: '',
      distortions: [],
      valid: false,
      textErrors: [],
      textRules: [(v) => !!v || 'Text is required.'],
    }
  },

  methods: {
    async getDistortions() {
      if (this.text === '') {
        this.textErrors.push('Text is required')
        return
      }
      const response = await this.$axios.post(
        'https://nlp.getclairity.io/v1/distortions/check',
        {
          text: this.text,
        }
      )
      this.distortions = response.data
    },
    clearData() {
      this.text = ''
      this.distortions = []
      this.$refs.getDistortionsForm.resetValidation()
    },
  },
}
</script>
