<template>
  <div class="">
    <styled-map></styled-map>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import StyledMap from '../StyledMap.vue'

  export default defineComponent({
    components: { StyledMap }
  })
</script>
