<template>
  <div>
    <div :class="{ 'text-lg font-medium py-1': expanded, 'html': !expanded }" class="transition-all">
      <router-link :to="`\#kontext=${target}`">{{ title }}</router-link>
    </div>
    <transition @enter="slideOpen" @leave="slideClose">
      <div v-if="expanded" class="overflow-hidden">
        <div class="py-3 border-t border-b">
          <div v-html="post.acf?.description" class="html max-w-prose-1"></div>
        </div>
        <div class="h-2"></div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
  import { Post } from '../store/types'
  import { defineComponent, inject, computed, ComputedRef } from 'vue'
  import { slideOpen, slideClose } from '../utils'

  const base = import.meta.env.VITE_API_ENDPOINT as string

  export default defineComponent({
    props: {
      post: Object
    },
    setup (props) {
      const post = props.post as Post
      const title = post.post_title || post.title?.rendered

      const ctx = inject<ComputedRef<string>>('ctx')
      const target = computed<string|undefined>(() => {
        const self = post.permalink || post.link || ''
        return self.replace(base, '')
      })

      const expanded = computed(() => {
        if (!target.value || !ctx) return false
        return target.value === ctx.value
      })

      return { post, title, target, expanded, slideOpen, slideClose }
    }
  })
</script>
