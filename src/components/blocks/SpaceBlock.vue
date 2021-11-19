<template>
  <div :style="style"></div>
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

      return { style }
    }
  })
</script>
