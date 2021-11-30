<template>
  <div class="">
    <styled-map></styled-map>

    <div class="px-4">
      <div class="max-w-6xl mx-auto my-8 md:my-12">
        <p class="text-2xl mb-2">{{ title }}</p>
        <div class="max-w-prose-1 html">
          <div v-html="description"></div>
        </div>
      </div>

      <markers-list/>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted } from 'vue'
  import { useStore } from '../../store'
  import StyledMap from '../StyledMap.vue'
  import MarkersList from '../MarkersList.vue'

  export default defineComponent({
    props: {
      block: Object,
      slug: String
    },
    setup (props) {
      const title = props.block?.title
      const description = props.block?.description
      const store = useStore()

      onMounted(() => {
        store.getMarkers()
      })

      return { title, description }
    },
    components: { StyledMap, MarkersList }
  })
</script>
