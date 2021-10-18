<template>
  <div class="flex w-full -mx-6">
    <div class="w-1/2 px-6">
      <switch-group>
        <switch-label passive class="sr-only">Darstellung</switch-label>
        <Switch v-model="analytics" class="switch">
          <span :class="!analytics ? 'text-blue-900' : 'text-gray-400'" class="w-1/2 p-1 relative z-10 transition-colors">Aus</span>
          <span :class="analytics ? 'text-blue-900' : 'text-gray-400'" class="w-1/2 p-1 relative z-10 transition-colors">An</span>
          <span :class="analytics ? 'left-1/2' : 'left-0'" class="pill transition-all"></span>
        </Switch>
      </switch-group>
      <div class="text-sm mt-4">
        <p>Es werden keine Cookies generiert und keine Persönlichen Daten gespeichert. Weitere Informationen unter <router-link to="/impressum" class="underline">Impressum</router-link></p>
      </div>
    </div>

    <div class="w-1/2 px-6">
      <switch-group>
        <switch-label passive class="sr-only">Darstellung</switch-label>
        <Switch v-model="darkMode" class="switch">
          <span :class="!darkMode ? 'text-blue-900' : 'text-gray-400'" class="w-1/2 p-1 relative z-10 transition-colors">hell</span>
          <span :class="darkMode ? 'text-blue-900' : 'text-gray-400'" class="w-1/2 p-1 relative z-10 transition-colors">dunkel</span>
          <span :class="darkMode ? 'left-1/2' : 'left-0'" class="pill transition-all"></span>
        </Switch>
      </switch-group>
    </div>
  </div>
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

      const analytics = computed({
        get: () => store.analytics,
        set: (val) => {
          store.analytics = val
        }
      })

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

      return { analytics, darkMode }
    },
    components: { Switch, SwitchGroup, SwitchLabel }
  })
</script>
