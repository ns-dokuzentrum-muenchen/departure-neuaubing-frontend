<template>
  <switch-group>
    <switch-label passive class="sr-only">Darstellung</switch-label>
    <Switch v-model="darkMode" class="switch">
      <span :class="!darkMode ? 'text-blue-900' : 'text-gray-400'" class="w-1/2 p-1 relative z-10 transition-colors">hell</span>
      <span :class="darkMode ? 'text-blue-900' : 'text-gray-400'" class="w-1/2 p-1 relative z-10 transition-colors">dunkel</span>
      <span :class="darkMode ? 'left-1/2' : 'left-0'" class="pill transition-all"></span>
    </Switch>
  </switch-group>
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue'
  import { useStore } from '../store'
  import { Switch, SwitchGroup, SwitchLabel } from '@headlessui/vue'

  export default defineComponent({
    name: 'RadioSwitches',
    setup () {
      const store = useStore()

      const html = document.documentElement

      const darkMode = computed({
        get: () => store.darkMode,
        set: (val) => {
          store.darkMode = val

          if (val) {
            html.classList.add('dark')
            window.localStorage?.setItem('cssMode', 'dark')
          } else {
            html.classList.remove('dark')
            window.localStorage?.setItem('cssMode', 'light')
          }
        }
      })

      return { darkMode }
    },
    components: { Switch, SwitchGroup, SwitchLabel }
  })
</script>
