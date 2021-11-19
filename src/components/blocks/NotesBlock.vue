<template>
  <div class="bg-bg p-4 md:p-8">
    <div class="max-w-prose-1 mx-auto my-8 md:my-12 text-lg">
      <p class="font-medium text-2xl md:text-3xl">{{ block?.titel }}</p>
      <div class="my-6">
        <div v-for="(section, i) in block?.sections" :key="i">
          <details>
            <summary class="text-2xl font-light cursor-pointer w-full border-b py-2">{{ section.title }}</summary>
            <div v-html="section.content" class="html py-4"></div>
          </details>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue'

  export default defineComponent({
    props: {
      block: Object
    },
    setup (props) {
      const block = computed(() => props.block)

      return { block }
    }
  })
</script>
