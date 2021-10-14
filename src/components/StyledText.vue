<template>
  <span v-for="(letter, i) in spans" :key="i" :class="font(i)">{{ letter }}</span>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    name: 'StyledText',
    props: {
      text: String
    },
    computed: {
      spans () {
        return this.text?.split('') || []
      }
    },
    methods: {
      font (i = 0) {
        return i % 2 !== 0 ? 'font-sans font-extralight' : 'font-serif text-bump'
      }
    }
  })
</script>
