<template>
  <div ref="el" class="md:grid grid-cols-12 gap-4 px-4">
    <div :class="position" class="col-end-13 my-8 px-4 clearfix max-w-5xl">
      <div v-for="(row, i) in rows" :key="i" :class="itemStyle(row)">
        <div v-if="row.type === 'text'" class="bg-bg text-lg">
          <div v-html="row.text" @click="internalLinks" class="html max-w-prose"></div>
        </div>
        <figure v-else class="pb-8">
          <app-image-zoom :image="row.image"/>
          <figcaption v-if="row.image?.caption" class="py-2 bg-bg text-sm">
            <div v-html="row.image?.caption" class="html"></div>
          </figcaption>
        </figure>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, computed, onMounted } from 'vue'
  import { useStore } from '../../store'
  import { useRouter } from 'vue-router'
  import { fixLink, sideBarLink } from '../../utils'
  import AppImageZoom from '../AppImageZoom.vue'

  export default defineComponent({
    props: {
      block: Object,
      slug: String
    },
    setup (props) {
      const el = ref<HTMLElement|null>(null)
      const rows = computed(() => props.block?.items || [])
      const itemStyle = (item: any) => {
        return item.type === 'text' ? 'md:w-2/3 mb-8' : 'md:float-right md:max-w-96 md:pl-8 clear-right'
      }
      const position = computed(() => {
        return `col-start-${props.block?.position || '1'}`
      })

      const router = useRouter()
      const internalLinks = (event: Event ) => {
        const el = event.target as HTMLElement
        if (el && (el.tagName === 'A' || el.tagName === 'a')) {
          const path = el.getAttribute('href') || ''

          if (sideBarLink(path)) {
            event.preventDefault()
            router.push(`#kontext=${path}`)
          } else {
            const internal = fixLink(path)
            if (internal.charAt(0) === '/') {
              event.preventDefault()
              router.push(path)
            }
          }
        }
      }

      const store = useStore()
      onMounted(() => {
        if (el.value) {
          el.value.addEventListener('mouseover', tagListener)
        }
      })

      function tagListener (e: MouseEvent) {
        const target = e.target as HTMLElement
        if (!target || target.tagName !== 'A') return

        const href = target.getAttribute('href') || ''
        const inPanel = sideBarLink(href)

        if (store.metaPeek || !href || !inPanel) return
        store.metaPeek = true
        setTimeout(() => {
          store.metaPeek = false
        }, 1200)
      }

      return { el, rows, itemStyle, position, internalLinks }
    },
    components: { AppImageZoom }
  })
</script>
