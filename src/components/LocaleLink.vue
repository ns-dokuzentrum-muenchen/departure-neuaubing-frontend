<template>
  <router-link :to="to">
    <slot/>
  </router-link>
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue'
  import { useStore } from '../store'

  export default defineComponent({
    props: {
      to: String
    },
    setup (props) {
      const store = useStore()
      const to = computed(() => {
        if (store.locale !== 'de') {
          const tmp = props.to === '/' ? '' : props.to
          return `/${store.locale}${tmp}`
        } else {
          return props.to
        }
      })

      return { to }
    }
  })
</script>
