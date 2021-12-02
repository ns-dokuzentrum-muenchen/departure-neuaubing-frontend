<template>
  <div class="">
    <div class="relative">
      <styled-map></styled-map>

      <!-- another layer -->
      <transition name="fade">
        <marker-panel v-if="markerLayer"/>
      </transition>
    </div>

    <div class="px-4">
      <div class="max-w-6xl mx-auto my-8 md:my-12">
        <p class="text-2xl mb-2">{{ title }}</p>
        <div class="max-w-prose-1 html">
          <div v-html="description" @click="internalLinks"></div>
        </div>
      </div>

      <markers-list/>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, computed } from 'vue'
  import { useStore } from '../../store'
  import { useRoute, useRouter } from 'vue-router'
  import StyledMap from '../StyledMap.vue'
  import MarkersList from '../MarkersList.vue'
  import MarkerPanel from '../MarkerPanel.vue'

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

      const route = useRoute()
      const router = useRouter()
      const internalLinks = (event: Event ) => {
        const el = event.target as HTMLElement
        if (el && (el.tagName === 'A' || el.tagName === 'a')) {
          event.preventDefault() // check first
          const path = el.getAttribute('href')
          console.log('go to', path)
          router.push(`#kontext=${path}`)
        }
      }

      const markerLayer = computed(() => {
        const { marker } = route.query
        return !!marker
      })

      return { title, description, internalLinks, markerLayer }
    },
    components: { StyledMap, MarkersList, MarkerPanel }
  })
</script>
