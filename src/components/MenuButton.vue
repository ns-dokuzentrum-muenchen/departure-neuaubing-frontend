<template>
  <button @click="toggleMenu" :aria-label="label" class="h-6 block">
    <div class="flex items-center relative">
      <div :class="pipes" class="w-2px mr-1.5 transition-all"></div>
      <div :class="{ '-mt-2px': menuOpen }" class="flex absolute left-1/2 transform -translate-x-px h-6 transition-all">
        <div :class="beamA" class="h-6 w-2px origin-center transition-all transform"></div>
        <div :class="beamB" class="h-6 w-2px origin-center transition-all transform -mx-2px"></div>
      </div>
      <div class="w-2px"></div>
      <div :class="pipes" class="w-2px ml-1.5 transition-all"></div>
    </div>
  </button>
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue'
  import { useStore } from '../store'

  export default defineComponent({
    name: 'MenuButton',
    setup () {
      const store = useStore()
      const menuOpen = computed(() => store.menuOpen)
      const toggleMenu = () => {
        store.menuOpen = !store.menuOpen
      }

      const label = computed(() => {
        return menuOpen.value ? 'Close the menu' : 'Open the menu'
      })

      const closedColors = 'bg-black dark:bg-white group-hover:bg-white'
      const pipes = computed(() => {
        return (menuOpen.value ? 'opacity-0 h-0 bg-theme-contrast ' : 'h-6 ' + closedColors)
      })
      const beamA = computed(() => {
        return (menuOpen.value ? 'rotate-45 h-7 bg-theme-contrast ' : closedColors)
      })
      const beamB = computed(() => {
        return (menuOpen.value ? '-rotate-45 h-7 bg-theme-contrast ' : closedColors)
      })

      return { menuOpen, label, toggleMenu, pipes, beamA, beamB }
    }
  })
</script>
