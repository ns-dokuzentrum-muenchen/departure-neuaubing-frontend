<template>
  <div>
    <figure>
      <img src="~../assets/home.jpg" alt="NS-Dokumentationszentrum München">
      <figcaption class="text-xs mt-1">NS-Dokumentationszentrum München, März 2015 | Foto: Jens Weber</figcaption>
    </figure>

    <div class="max-w-2xl mt-3">
      <styled-map/>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import StyledMap from '../components/StyledMap.vue'

  export default defineComponent({
    name: 'About',
    components: { StyledMap }
  })
</script>
