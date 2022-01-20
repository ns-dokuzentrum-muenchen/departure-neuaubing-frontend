<template>
  <div class="scroll-mt-18">
    <p class="font-medium text-lg mb-1">{{ person.post_title }}</p>
    <div ref="txt" :class="{ 'line-clamp-2': truncated }" class="overflow-hidden">
      <div v-html="person.acf?.biographie" class="contents html"></div>
    </div>
    <div v-if="!expanded" class="html">
      <router-link :to="`\#kontext=${target}`" class="">{{ lt('more') }}</router-link>
    </div>
  </div>
</template>

<script lang="ts">
  import type { Post } from '../store/types'
  import type { ComputedRef } from 'vue'
  import { defineComponent, ref, inject, computed, watch, nextTick } from 'vue'
  import { useStore } from '../store'
  import { fixLink } from '../utils'

  export default defineComponent({
    props: {
      person: Object
    },
    setup (props) {
      const person = props.person as Post
      const txt = ref<HTMLElement|null>(null)

      const ctx = inject<ComputedRef<string>>('ctx')
      const target = computed<string|undefined>(() => {
        const self = person.permalink || person.link || ''
        return fixLink(self)
      })

      const expanded = computed(() => {
        if (!target.value || !ctx) return false
        return target.value === ctx.value
      })
      const truncated = ref(!expanded.value)

      watch(expanded, (val) => {
        if (val) {
          expand()
        } else {
          contract()
        }
      })

      async function expand () {
        if (!txt.value) return
        const from = `${txt.value.getBoundingClientRect().height}px`
        truncated.value = false
        await nextTick()
        const to = `${txt.value.getBoundingClientRect().height}px`

        txt.value.animate({
          height: [from, to]
        }, { duration: 250, easing: 'ease-out' })

        setTimeout(() => {
          txt.value?.parentElement?.scrollIntoView?.({
            block: 'start',
            behavior: 'smooth'
          })
        }, 300)
      }

      async function contract () {
        if (!txt.value) return
        const from = `${txt.value.getBoundingClientRect().height}px`
        truncated.value = true
        await nextTick()
        const to = `${txt.value.getBoundingClientRect().height}px`

        txt.value.animate({
          height: [from, to]
        }, { duration: 250, easing: 'ease-out' })
      }

      const store = useStore()

      return { person, txt, target, expanded, truncated, lt: store.lt }
    }
  })
</script>
