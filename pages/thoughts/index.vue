<template>
  <v-data-table
    :headers="headers"
    :items="thoughts"
    :items-per-page="10"
    class="elevation-1"
  ></v-data-table>
</template>

<script>
export default {
  async asyncData({ store }) {
    const thoughtsResponse = await store.$axios.get('/v1/thoughts', {
      params: {
        order_by: 'created_at',
        limit: 10,
      },
    })
    const thoughtsRaw = thoughtsResponse.data
    const thoughts = thoughtsRaw.map(function (thought) {
      return {
        id: thought.id,
        text: thought.text,
        distortions: thought.distortions.map((distortion) => distortion.title),
        created_at: thought.created_at,
        updated_at: thought.updated_at,
      }
    })

    return {
      thoughts,
    }
  },

  data() {
    return {
      headers: [
        {
          text: 'ID',
          align: 'left',
          value: 'id',
        },
        {
          text: 'Text',
          align: 'left',
          value: 'text',
        },
        {
          text: 'Distortions',
          align: 'left',
          value: 'distortions',
        },
        {
          text: 'Created At',
          align: 'left',
          value: 'created_at',
          sortable: true,
        },
        {
          text: 'Updated At',
          align: 'left',
          value: 'updated_at',
          sortable: true,
        },
      ],
      thoughts: [],
    }
  },
}
</script>
