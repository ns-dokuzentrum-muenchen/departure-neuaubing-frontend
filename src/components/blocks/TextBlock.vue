<template>
  <div class="md:grid grid-cols-12 gap-4 py-16">
    <div :class="[position, size]" class="col-span-7 max-w-prose">
      <div v-html="content" class="html"></div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue'

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

      return { position, size, content }
    }
  })
</script>
