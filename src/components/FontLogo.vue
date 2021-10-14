<template>
  <div class="font-extralight tracking-tighter leading-less">
    <p><span v-for="(letter, i) in dep" :key="i" :class="font(i)">{{ letter }}</span></p>
    <p class="ml-logo"><span v-for="(letter, i) in neu" :key="i" :class="font(i + 1)">{{ letter }}</span></p>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    name: 'FontLogo',
    setup () {
      const dep = 'DEPARTURE'.split('')
      const neu = 'NEUAUBING'.split('')

      function font (i = 0) {
        return i % 2 === 0 ? 'font-sans' : 'font-serif text-bump'
      }

      return { dep, neu, font }
    }
  })
</script>
