<template>
  <div class="md:grid grid-cols-12 gap-4 my-8 px-4">
    <div :class="[position]" :style="nudge" class="col-span-7 bg-bg px-4 py-4 leftopen-nudge group">
      <div class="relative">
        <div class="absolute left-0 whitespace-nowrap top-0.5 -translate-x-1/3 opacity-0 group-hover:opacity-100 transition-all">
          <button @click="openBegriffe" class="btn-sm"><chevron-left class="inline-block w-2 mr-1"/> Sprachanalyse Werkzeug</button>
        </div>
        <p class="font-medium text-2xl mb-4 group-hover:translate-x-48 transition-all">{{ title }}</p>
      </div>
      <div v-html="content" @click="internalLinks" class="html max-w-prose-1 text-lg"></div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { fixLink, sideBarLink } from '../../utils'
  import ChevronLeft from '../svg/ChevronLeft.vue'

  export default defineComponent({
    props: {
      block: Object,
      slug: String
    },
    setup (props) {
      const position = computed(() => {
        return `col-start-${props.block?.position || '1'}`
      })

      const title = computed(() => props.block?.title || '')
      const content = computed(() => props.block?.description || '')

      const router = useRouter()
      const internalLinks = (event: Event ) => {
        const el = event.target as HTMLElement
        if (el && (el.tagName === 'A' || el.tagName === 'a')) {
          const path = el.getAttribute('href') || ''

          if (sideBarLink(path)) {
            event.preventDefault()
            router.push(`#begriff=${path}`)
          } else {
            const internal = fixLink(path)
            if (internal.charAt(0) === '/') {
              event.preventDefault()
              router.push(path)
            }
          }
        }
      }

      const nudge = computed(() => {
        const c = props.block?.position || 1
        const val = (12 - c) / 12
        return `--nudge:${val}`
      })

      const openBegriffe = () => {
        router.replace({ hash: '#begriffe' })
      }

      return { position, title, content, internalLinks, nudge, openBegriffe }
    },
    components: { ChevronLeft }
  })
</script>
