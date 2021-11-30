<template>
  <div class="">
    <styled-map></styled-map>

    <div class="px-4">
      <markers-list/>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted } from 'vue'
  import { useStore } from '../../store'
  import StyledMap from '../StyledMap.vue'
  import MarkersList from '../MarkersList.vue'

  export default defineComponent({
    props: {
      block: Object,
      slug: String
    },
    setup (props) {
      const store = useStore()

      onMounted(() => {
        store.getMarkers()
      })
    },
    components: { StyledMap, MarkersList }
  })
</script>
