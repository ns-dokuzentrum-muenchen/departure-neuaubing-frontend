<template>
  <button @click.stop="toggleMenu" :aria-label="label" :class="position" class="h-7 block transition-transform">
    <div class="flex items-center relative">
      <div :class="pipes" class="w-0 border-l-2 mr-1.5 transition-all"></div>
      <div :class="{ '-mt-2px': menuOpen }" class="flex absolute left-1/2 transform -translate-x-px h-7 transition-all">
        <div :class="beamA" class="h-7 w-0 border-l-2 origin-center transition-all transform"></div>
        <div :class="beamB" class="h-7 w-0 border-l-2 origin-center transition-all transform -mx-2px"></div>
      </div>
      <div class="w-0 border-l-2"></div>
      <div :class="pipes" class="w-0 border-l-2 ml-1.5 transition-all"></div>
    </div>
  </button>
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue'
  import { useStore } from '../store'

  export default defineComponent({
    name: 'MenuButton',
    props: {
      attop: Boolean
    },
    setup (props) {
      const store = useStore()
      const menuOpen = computed(() => store.menuOpen)
      const toggleMenu = () => {
        store.menuOpen = !store.menuOpen
      }

      const attop = computed(() => props.attop)
      const theme = computed(() => store.theme)

      const label = computed(() => {
        return menuOpen.value ? 'Menü schließen' : 'Menü öffnen'
      })

      const closedColors = computed(() => {
        return ''
        // const base = [attop.value && theme.value === 'theme-blau' ? 'text-white' : 'text-black', 'dark:text-white']
        // if (theme.value === 'theme-blau') {
        //   base.push('notouch:group-hover:text-white')
        // }
        // return base.join(' ')
      })
      const pipes = computed(() => {
        return (menuOpen.value ? 'opacity-0 h-0' : 'h-7 ' + closedColors.value)
      })
      const beamA = computed(() => {
        return (menuOpen.value ? 'rotate-45 h-7' : closedColors.value)
      })
      const beamB = computed(() => {
        return (menuOpen.value ? '-rotate-45 h-7' : closedColors.value)
      })

      const position = computed(() => {
        return menuOpen.value || attop.value ? '' : 'translate-y-1.5 md:translate-y-1 notouch:group-hover:translate-y-0'
      })

      return { menuOpen, label, toggleMenu, pipes, beamA, beamB, position }
    }
  })
</script>
