<template>
  <div class="flex w-full -mx-4 text-xl">
    <div class="w-1/2 px-4">
      <switch-group>
        <switch-label passive class="sr-only">Webanalyse</switch-label>
        <Switch v-model="analytics" class="switch">
          <span :class="!analytics ? 'text-blue-900' : 'text-gray-400'" class="w-1/2 p-1 relative z-10 transition-colors">Aus</span>
          <span :class="analytics ? 'text-blue-900' : 'text-gray-400'" class="w-1/2 p-1 relative z-10 transition-colors">An</span>
          <span :class="analytics ? 'left-1/2' : 'left-0'" class="pill transition-all"></span>
        </Switch>
      </switch-group>
      <div class="text-sm mt-8">
        <p>Es werden keine Cookies generiert und keine Persönlichen Daten gespeichert. Weitere Informationen unter <router-link to="/impressum" class="underline">Impressum</router-link></p>
      </div>
    </div>

    <div class="w-1/2 px-4">
      <switch-group>
        <switch-label passive class="sr-only">Darstellung</switch-label>
        <Switch v-model="darkMode" class="switch">
          <span :class="!darkMode ? 'text-blue-900' : 'text-gray-400'" class="w-1/2 p-1 relative z-10 transition-colors">hell</span>
          <span :class="darkMode ? 'text-blue-900' : 'text-gray-400'" class="w-1/2 p-1 relative z-10 transition-colors">dunkel</span>
          <span :class="darkMode ? 'left-1/2' : 'left-0'" class="pill transition-all"></span>
        </Switch>
      </switch-group>

      <div class="mt-8">
        <div>
          <radio-group v-model="theme" class="flex justify-between">
            <radio-group-label class="sr-only">
              <p>Darstellung</p>
            </radio-group-label>

            <radio-group-option v-slot="{ checked }" value="theme-blau" class="bg-white rounded-full">
              <radio-group-label :class="{ 'bg-opacity-50': !checked }" class="w-10 h-10 border-2 border-white bg-blue-900 rounded-full block hover:ring-2 ring-yellow-200 cursor-pointer transition-all">
                <span class="sr-only">Blau</span>
              </radio-group-label>
            </radio-group-option>
            <radio-group-option v-slot="{ checked }" value="theme-gelb" class="bg-white rounded-full">
              <radio-group-label :class="{ 'bg-opacity-50': !checked }" class="w-10 h-10 border-2 border-white bg-yellow-200 rounded-full block hover:ring-2 ring-blue-600 cursor-pointer transition-all">
                <span class="sr-only">Gelb</span>
              </radio-group-label>
            </radio-group-option>
            <radio-group-option v-slot="{ checked }" value="theme-rosa" class="bg-white rounded-full">
              <radio-group-label :class="{ 'bg-opacity-50': !checked }" class="w-10 h-10 border-2 border-white bg-pink-300 rounded-full block hover:ring-2 ring-green-500 cursor-pointer transition-all">
                <span class="sr-only">Rosa</span>
              </radio-group-label>
            </radio-group-option>
            <radio-group-option v-slot="{ checked }" value="theme-gruen" class="bg-white rounded-full">
              <radio-group-label :class="{ 'bg-opacity-50': !checked }" class="w-10 h-10 border-2 border-white bg-green-500 rounded-full block hover:ring-2 ring-pink-300 cursor-pointer transition-all">
                <span class="sr-only">Grün</span>
              </radio-group-label>
            </radio-group-option>
          </radio-group>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue'
  import { useStore } from '../store'
  import {
    Switch,
    SwitchGroup,
    SwitchLabel,
    RadioGroup,
    RadioGroupLabel,
    RadioGroupOption
  } from '@headlessui/vue'

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

      const theme = computed({
        get: () => store.theme,
        set: (val) => {
          const oldVal = store.theme
          store.theme = val

          html.classList.remove(oldVal)
          html.classList.add(val)

          window.localStorage?.setItem('theme', val)
        }
      })

      return { analytics, darkMode, theme }
    },
    components: { Switch, SwitchGroup, SwitchLabel, RadioGroup, RadioGroupLabel, RadioGroupOption }
  })
</script>
