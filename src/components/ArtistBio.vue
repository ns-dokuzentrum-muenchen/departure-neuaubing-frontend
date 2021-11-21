<template>
  <div>
    <p class="font-medium text-lg">{{ person.post_title }}</p>
    <div :class="{ 'line-clamp-2': !expanded }" class="html">
      <div v-html="person.acf?.biographie"></div>
    </div>
    <div v-if="!expanded" class="html">
      <router-link :to="`\#kontext=${target}`" class="">Weiterlesen</router-link>
    </div>
  </div>
</template>

<script lang="ts">
  import { Post } from '../store/types'
  import { defineComponent, inject, computed, ComputedRef} from 'vue'

  const base = import.meta.env.VITE_API_ENDPOINT as string

  export default defineComponent({
    props: {
      person: Object
    },
    setup (props) {
      const person = props.person as Post

      const ctx = inject<ComputedRef<string>>('ctx')
      const target = computed<string|undefined>(() => {
        const self = person.permalink || person.link || ''
        return self.replace(base, '')
      })

      const expanded = computed(() => {
        if (!target.value || !ctx) return false
        return target.value === ctx.value
      })

      return { person, target, expanded }
    }
  })
</script>
