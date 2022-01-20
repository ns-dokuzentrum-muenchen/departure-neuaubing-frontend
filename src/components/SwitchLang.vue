<template>
  <a :href="url" :lang="lang" :class="{ underline: active }">{{ label }}</a>
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue'
  import { useStore } from '../store'

  export default defineComponent({
    props: {
      lang: String
    },
    setup (props) {
      const store = useStore()
      const locale = computed(() => store.locale)

      const label = computed(() => {
        return props.lang === 'en' ? 'English' : 'Deutsch'
      })
      const url = computed(() => {
        return props.lang === 'en' ? '/en' : '/'
      })
      const active = computed(() => locale.value === props.lang)

      return { label, url, active }
    }
  })
</script>
