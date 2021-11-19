<template>
  <div class="md:grid grid-cols-12 gap-4 my-8 px-4">
    <div :class="[position]" class="col-span-7 bg-bg px-4 py-4">
      <p class="font-medium text-2xl mb-4">{{ title }}</p>
      <div v-html="content" @click="internalLinks" class="html max-w-prose-1 text-lg"></div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue'
  import { useRouter } from 'vue-router'

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
          event.preventDefault() // check first
          const path = el.getAttribute('href')
          console.log('go to', path)
          router.push(`#kontext=${path}`)
        }
      }

      return { position, title, content, internalLinks }
    }
  })
</script>
