<template>
  <v-container>
    <v-form ref="createThoughtForm" v-model="valid">
      <v-card>
        <v-card-title>
          <span class="headline">Create Thought</span>
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
          <v-row>
            <v-card class="mx-auto" max-width="500" style="margin-top: -30px">
              <!-- <v-divider v-if="!allSelected"></v-divider> -->
              <v-row class="mb-6" no-gutters>
                <v-col
                  v-for="n in possibleDistortions"
                  :key="n.id"
                  :disabled="loading"
                  @click="handlePush(n)"
                >
                  <v-tooltip bottom>
                    <template #activator="{ on, attrs }">
                      <v-card
                        class="pa-2 ma-2"
                        tile
                        v-bind="attrs"
                        outlined
                        style="cursor: pointer; border-radius: 10px"
                        :color="distortions.includes(n) ? 'blue' : 'lightgray'"
                        v-on="on"
                      >
                        {{ n.title }}
                        <v-span style="font-weight: 200; opacity: 0.6">{{
                          distortionCount[n.title]
                        }}</v-span>
                      </v-card>
                    </template>
                    <span class="mw-50%">{{ n.description }}</span>
                  </v-tooltip>
                </v-col>
              </v-row>
            </v-card>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-row>
            <v-col align="center" justify="center">
              <v-btn
                class="mb-2"
                color="primary"
                :disabled="!valid"
                @click="createThought()"
                >Create Thought</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-container>
</template>

<script>
export default {
  async asyncData({ store }) {
    const distortionResponse = await store.$axios.get('/v1/distortions', {
      params: {
        order_by: 'title',
        order_direction: 'asc',
        limit: 100,
      },
    })
    const distortionCount = await store.$axios.get(
      '/v1/distortions/count_by_title',
      {
        params: {
          type: 'admin',
        },
      }
    )

    return {
      possibleDistortions: distortionResponse.data,
      distortionCount: distortionCount.data,
    }
  },

  data() {
    return {
      text: '',
      distortions: [],
      distortionErrors: [],
      possibleDistortions: [],
      valid: false,
      textErrors: [],
      textRules: [
        (v) => !!v || 'Text is required.',
        (v) => v.length > 20 || 'Text must be at least 20 characters.',
      ],
      distortionRules: [(v) => v.length !== 0 || 'Distortions are required.'],
      distortionCount: {},
    }
  },

  methods: {
    async createThought() {
      if (this.text === '') {
        this.textErrors.push('Text is required')
        return
      }
      if (this.distortions === []) {
        this.distortionErrors.push('Distortions are required')
        return
      }
      const response = await this.$axios.post('/v1/thoughts', {
        distortions: this.distortions,
        text: this.text,
        user_generated: false,
        model_distortions: {},
      })
      const thoughtData = response.data
      this.$toast.global.user_info(`Thought created: ${thoughtData.id}`)

      this.text = ''
      this.distortions = []
      this.$refs.createThoughtForm.resetValidation()
    },
    handlePush(n) {
      if (this.distortions.includes(n)) {
        this.distortions = this.distortions.filter((item) => item !== n)
      } else {
        this.distortions.push(n)
      }
    },
  },
}
</script>
