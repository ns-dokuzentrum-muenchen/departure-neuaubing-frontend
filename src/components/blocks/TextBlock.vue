<template>
  <div class="md:grid grid-cols-12 gap-4 my-8 px-4">
    <div :class="[position, size]" :style="nudge" class="col-span-7 bg-bg px-4 py-2 leftopen-nudge">
      <div v-html="content" @click="internalLinks" class="html max-w-prose"></div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { fixLink, sideBarLink } from '../../utils'

  export default defineComponent({
    props: {
      block: Object,
      slug: String
    },
    setup (props) {
      const position = computed(() => {
        return `col-start-${props.block?.position || '1'}`
      })
      const size = computed(() => {
        return `text-${props.block?.size || 'lg'}`
      })

      const content = computed(() => props.block?.text || '')

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

      const nudge = computed(() => {
        const c = props.block?.position || 1
        const val = (12 - c) / 12
        return `--nudge:${val}`
      })

      return { position, size, content, internalLinks, nudge }
    }
  })
</script>
