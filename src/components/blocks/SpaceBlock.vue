<template>
  <div :style="style" :class="classes"></div>
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue'

  export default defineComponent({
    props: {
      block: Object
    },
    setup (props) {
      const style = computed(() => {
        const flex = props.block?.height
        const min = props.block?.min

        return {
          height: flex ? `${flex}vh` : min,
          minHeight: flex ? min : '0'
        }
      })
      const classes = computed(() => props.block?.background ? 'bg-bg' : '')

      return { style, classes }
    }
  })
</script>
