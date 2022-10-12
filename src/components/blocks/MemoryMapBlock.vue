<template>
  <div>
    <div ref="map" class="relative hides-meta">
      <styled-map></styled-map>

      <!-- another layer -->
      <transition name="fade-right">
        <marker-panel v-if="markerLayer"/>
      </transition>
    </div>

    <div id="pagelist" class="px-4 scroll-m-8">
      <div class="max-w-6xl mx-auto my-8 md:my-12">
        <p class="text-2xl mb-2">{{ title }}</p>
        <div ref="texts" class="max-w-prose-1 html">
          <div v-html="description" @click="internalLinks"></div>
        </div>
      </div>

      <markers-list/>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, computed, ref, onUnmounted, defineAsyncComponent } from 'vue'
  import { useStore } from '../../store'
  import { useRoute, useRouter } from 'vue-router'
  import MarkersList from '../MarkersList.vue'
  import MarkerPanel from '../MarkerPanel.vue'
  // import bus from '../../eventBus'

  export default defineComponent({
    props: {
      block: Object,
      slug: String
    },
    setup (props) {
      const title = props.block?.title
      const description = props.block?.description
      const store = useStore()

      const map = ref<HTMLElement|null>(null)
      const texts = ref<HTMLElement|null>(null)

      onMounted(() => {
        store.getMarkers()

        window.addEventListener('scroll', scrollListener)
        if (texts.value) {
          texts.value.addEventListener('mouseover', tagListener)
        }
      })
      onUnmounted(() => {
        window.removeEventListener('scroll', scrollListener)
      })

      const route = useRoute()
      const router = useRouter()
      const internalLinks = (event: Event ) => {
        const el = event.target as HTMLElement
        if (el && (el.tagName === 'A' || el.tagName === 'a')) {
          event.preventDefault() // check first
          const path = el.getAttribute('href')
          console.log('go to', path)
          router.push({ path: route.path, query: route.query, hash: `#kontext=${path}`})
        }
      }

      const markerLayer = computed(() => {
        const { marker } = route.query
        return !!marker
      })

      function scrollListener () {
        if (!map.value) return

        const { top, bottom } = map.value.getBoundingClientRect()
        store.metaHidden = top < 150 && bottom > 50
      }

      function tagListener (e: MouseEvent) {
        const target = e.target as HTMLElement
        if (!target || target.tagName !== 'A') return

        // TODO check if META link
        // console.log('hover on <a>', target.getAttribute('href'))
        if (store.metaPeek) return
        store.metaPeek = true
        setTimeout(() => {
          store.metaPeek = false
        }, 1200)
      }

      return { title, description, internalLinks, markerLayer, map, texts }
    },
    components: {
      StyledMap: defineAsyncComponent(() => import('../StyledMap.vue')),
      MarkersList,
      MarkerPanel
     }
  })
</script>
