<template>
  <div ref="el" :class="{ 'md:grid grid-cols-12 gap-4 md:px-4': !noGrid }">
    <div :class="[position, size, { 'bg-bg px-4': !noGrid }]" :style="nudge" class="col-span-7 py-2 leftopen-nudge">
      <div v-html="content" @click="internalLinks" class="html max-w-prose"></div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, computed, onMounted } from 'vue'
  import { useStore } from '../../store'
  import { useRouter } from 'vue-router'
  import { fixLink, sideBarLink } from '../../utils'

  const txtSizes: { [key: string]: string } = {
    base : 'text-sm md:text-base',
    lg: 'md:text-lg',
    xl: 'text-lg md:text-xl',
    '2xl': 'text-xl md:text-2xl',
    '4xl': 'text-2xl md:text-4xl'
  }

  export default defineComponent({
    props: {
      block: Object,
      slug: String,
      noGrid: Boolean
    },
    setup (props) {
      const position = computed(() => {
        return `col-start-${props.block?.position || '1'}`
      })
      const size = computed(() => {
        return txtSizes[props.block?.size || 'lg']
      })

      const el = ref<HTMLElement|null>(null)

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

      return { el, position, size, content, internalLinks, nudge }
    }
  })
</script>
