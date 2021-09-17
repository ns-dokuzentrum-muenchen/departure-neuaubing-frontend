<template>
  <div>
    <header>
      <h1>Departure Neuaubing</h1>
    </header>

    <main>
      <router-view/>
    </main>

    <footer></footer>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    name: 'App'
  })
</script>

<style>
  @import './style.css';
</style>

