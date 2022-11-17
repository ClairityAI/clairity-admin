<template>
    <v-container>
      <v-form ref="createThoughtForm" v-model="valid">
        <v-card>
          <v-card-title>
            <span class="headline">Meditations</span>
          </v-card-title>
          <v-row>
              <v-col cols="12">
                <ul>
                    <v-li v-for="(item, index) in possibleMeditations" :key="item.id" class="flex-col">
                        <v-btn @click="toggleMeditation(item.id)">
                            <span style="display:inline-flex;flex-direction:row;column-gap: 10px;"><img v-if="item.icon.length" :src="item.icon" style="width:10px"  />{{ item.name }}</span>
                        </v-btn>
                      
                        <v-card v-if="item.isOpen">
                        <ul style="margin-top:10px;background-color: aliceblue; color:black" class="flex-col">
                            <span style="display:inline-flex;flex-direction:row;column-gap: 10px;"><b>ID</b>{{item.id}}</span>
                    <span style="display:inline-flex;flex-direction:row;column-gap: 10px;"><b>NAME </b><input v-model="item.name" placeholder="Edit Name" size=""/></span>
                    <span style="display:inline-flex;flex-direction:row;column-gap: 10px;"><b>ICON </b><input v-model="item.icon" placeholder="Edit ICON Url" size="100%" /></span>
                    <span style="display:inline-flex;flex-direction:row;column-gap: 10px;"><b>DESCRIPTION </b><textarea v-model="item.description" placeholder="Edit Description" size="100%" style="width:100%" /></span>
                    <span style="display:inline-flex;flex-direction:row;column-gap: 10px;"><b>AUDIO FILE </b><input v-model="item.audio_file" placeholder="Edit Audio Url" size="100%" /></span>
                    <span style="display:inline-flex;flex-direction:row;column-gap: 10px;"><b>(Introspective -- Grounding) SCORE </b>({{item.type.x}})<input v-model="item.type.x" min="-1" max="1" step="0.1" type="range"  size="100%" /></span>
                    <span style="display:inline-flex;flex-direction:row;column-gap: 10px;"><b>(Focus -- Open-Awareness) SCORE </b>({{item.type.y}})<input v-model="item.type.y" min="-1" max="1" step="0.1" type="range" size="100%" /></span>
                    <span style="display:inline-flex;flex-direction:row;column-gap: 10px;"><b>DIFFICULTY </b><input v-model="item.difficulty" min="100" max="300" step="100" type="range" size="100%" /></span>
                    <span style="display:inline-flex;flex-direction:row;column-gap: 10px;"><b>DURATION </b><input v-model="item.duration" placeholder="Edit Total Duration" size="100%" /></span>
                    <span style="display:inline-flex;flex-direction:row;column-gap: 10px;"><b>UNLOCK DURATION </b><input v-model="item.duration_until_continue" placeholder="Edit Duration To Unlock" size="100%" /></span>
                        </ul>
                        <v-btn v-if="JSON.stringify({...possibleMeditations[index], isOpen: false}) !== JSON.stringify({...ogMeditations[index], isOpen: false})" @click="updateMeditation(index)">
                        Save Changes
                        </v-btn>
                        <v-btn v-if="JSON.stringify({...possibleMeditations[index], isOpen: false}) !== JSON.stringify({...ogMeditations[index], isOpen: false})" @click="cancelEditing(item.id)">
                Reset
                        </v-btn>
                        <v-btn @click="deleteMeditation(item.id)">
                Delete Meditation
                        </v-btn>
                        <v-btn @click="duplicateMeditation(item)">
                Duplicate Meditation
                        </v-btn>
                        <v-btn @click="copyJSON(item)">
                Copy JSON
                        </v-btn>
                        </v-card>
</v-li>
                </ul>
              </v-col>
            </v-row>
          <!-- <v-card-text>
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
              <v-col cols="12">
                <v-select
                  v-model="distortions"
                  outlined
                  multiple
                  chips
                  label="Distortions"
                  :items="possibleDistortions"
                  item-text="title"
                  item-value="title"
                  required
                  :errors="distortionErrors"
                  :rules="distortionRules"
                ></v-select>
              </v-col>
            </v-row>
          </v-card-text> -->
          <v-card-actions>
            <v-row>
              <v-col align="center" justify="center">
                <v-btn
                  class="mb-2"
                  color="primary"
                  :disabled="!valid"
                  @click="createNewMeditation()"
                  >Create New Meditation</v-btn
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
      const meditationResponse = await store.$axios.get('/v1/meditations', {
        params: {
          order_by: 'name',
          order_direction: 'asc',
          limit: 100,
        },
      })

  
      return {
        possibleMeditations: meditationResponse.data.map(x => ({...x,isOpen: false})),
        ogMeditations: meditationResponse.data
      }
    },
  
    data() {
      return {
        text: '',
        distortions: [],
        distortionErrors: [],
        ogMeditations: [],
        possibleMeditations: [],
        templateMeditation: {
  "name": "Unnamed Meditation",
  "icon": "",
  "description": "",
  "audio_file": "",
  "type": {
    "x": 0,
    "y": 0,
  },
  "difficulty": 100,
  "duration": 0,
  "strict_timing": false,
  "duration_until_continue": 0,
},
        valid: false,
        textErrors: [],
        textRules: [
          (v) => !!v || 'Text is required.',
          (v) => v.length > 20 || 'Text must be at least 20 characters.',
        ],
        distortionRules: [(v) => v.length !== 0 || 'Distortions are required.'],
      }
    },
  
    methods: {
      async updateMeditation(index) {
        if (this.possibleMeditations[index].name === '') {
          this.textErrors.push('Name is required')
          return
        }
        if (this.possibleMeditations[index].icon === '') {
          this.textErrors.push('Icon URL is required')
          return
        }
        if (this.possibleMeditations[index].description === '') {
          this.textErrors.push('Description is required')
          return
        }
        if (this.possibleMeditations[index].audio_file === '') {
          this.textErrors.push('Audio File URL is required')
          return
        }
        if (this.possibleMeditations[index].duration === '') {
          this.textErrors.push('Duration is required')
          return
        }
        if (this.possibleMeditations[index].duration_until_continue === '') {
          this.textErrors.push('Unlock Duration is required')
          return
        }

        const toUploadData = this.possibleMeditations[index]
        delete toUploadData.isOpen

        const response = await this.$axios.patch(`/v1/meditations/` + this.possibleMeditations[index].id, {
         ...toUploadData
        })
        const thoughtData = response.data
        this.$toast.global.user_info(`Meditation updated: ${thoughtData.name}`)
  
        this.ogMeditations[index] = response.data
        window.location.reload()
      },
      async createNewMeditation() {
        const response = await this.$axios.post(`/v1/meditations`, {
            ...this.templateMeditation
        })
        const thoughtData = response.data
        this.$toast.global.user_info(`Meditation created: ${thoughtData.name}`)
        window.location.reload()
      },
      async duplicateMeditation(item) {
        const obj = item;
        delete obj.id;
        const response = await this.$axios.post(`/v1/meditations`, {
            ...obj
        })
        const thoughtData = response.data
        this.$toast.global.user_info(`Meditation created: ${thoughtData.name}`)
        window.location.reload()
      },
      async deleteMeditation(id){
        const confirm = window.confirm('Are you sure you want to delete this meditation?')
        if (!confirm) return this.$toast.global.user_info(`Meditation not deleted`)
        await this.$axios.delete(`/v1/meditations/` + id)
        window.location.reload()
      },
        toggleMeditation(id) {
            const meditation = this.possibleMeditations.find(x => x.id === id)
            meditation.isOpen = !meditation.isOpen
        },
        cancelEditing(id) {
            const meditation = {...this.ogMeditations.find(x => x.id === id), isOpen: true}
            const currentMeditation = this.possibleMeditations.find(x => x.id === id)
            Object.assign(currentMeditation, meditation)
        },
        copyJSON(item){
            const obj = item;
            delete obj.id;
            const el = document.createElement('textarea');
            el.value = JSON.stringify(obj, null, 2);
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            this.$toast.global.user_info(`Meditation copied to clipboard`)
        },
    },
  }
  </script>
  <style lang="css">
  .flex-col {
    display: flex;
    flex-direction: column;
    width: 100%;
}

</style>
  