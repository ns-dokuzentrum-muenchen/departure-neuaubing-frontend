<template>
  <div ref="el" class="md:grid grid-cols-12 gap-4 my-8 px-4">
    <div :class="[position, size]" :style="nudge" class="col-span-7 bg-bg px-4 py-2 leftopen-nudge">
      <div v-html="content" @click="internalLinks" class="html max-w-prose"></div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, computed, onMounted } from 'vue'
  import { useStore } from '../../store'
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

        // TODO check if META link
        // console.log('hover on <a>', target.getAttribute('href'))
        if (store.metaPeek) return
        store.metaPeek = true
        setTimeout(() => {
          store.metaPeek = false
        }, 1200)
      }

      return { el, position, size, content, internalLinks, nudge }
    }
  })
</script>
