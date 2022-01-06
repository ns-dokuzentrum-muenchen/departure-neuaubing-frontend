<template>
  <div class="mx-6 md:mx-24 mb-8 overflow-hidden">
    <div class="mt-24 mb-16 md:my-24 lg:my-48">
      <p>Account :) <button @click="logout" class="btn-outline">abmelden</button></p>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import { useStore } from '../store'

  export default defineComponent({
    setup () {
      const store = useStore()

      return {
        logout: store.logout
      }
    }
  })
</script>
