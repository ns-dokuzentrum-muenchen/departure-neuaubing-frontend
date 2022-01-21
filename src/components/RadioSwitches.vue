<template>
  <div class="md:flex lg:w-full md:-mx-4 md:text-lg lg:text-xl">
    <div class="w-full md:w-1/2 md:order-2 px-2 md:px-4 flex flex-wrap md:block">
      <switch-group>
        <switch-label passive class="md:sr-only w-1/2">
          <p>{{ lt('settings') }} &nbsp; <contrast-icon class="inline" width="16"/></p>
        </switch-label>
        <Switch v-model="darkMode" class="switch w-1/2 md:w-full text-sm lg:text-base">
          <span :class="!darkMode ? 'text-blue-900' : 'text-gray-400'" class="w-1/2 p-1 relative z-10 transition-colors">{{ lt('light') }}</span>
          <span :class="darkMode ? 'text-blue-900' : 'text-gray-400'" class="w-1/2 p-1 relative z-10 transition-colors">{{ lt('dark') }}</span>
          <span :class="darkMode ? 'left-1/2' : 'left-0'" class="pill transition-all"></span>
        </Switch>
      </switch-group>

      <div class="mt-3 mb-6 md:mt-8 md:mb-0 ml-auto md:ml-0 w-1/2 md:w-full">
        <div>
          <radio-group v-model="theme" class="flex justify-between">
            <radio-group-label class="sr-only">{{ lt('settings') }}</radio-group-label>

            <radio-group-option v-slot="{ checked }" value="theme-blau" class="bg-white rounded-full">
              <radio-group-label :class="{ 'bg-opacity-50': !checked }" class="w-8 h-8 md:w-10 md:h-10 border-2 border-white bg-blue-900 rounded-full block hover:ring-2 ring-yellow-200 cursor-pointer transition-all">
                <span class="sr-only">{{ lt('blue') }}</span>
              </radio-group-label>
            </radio-group-option>
            <radio-group-option v-slot="{ checked }" value="theme-gelb" class="bg-white rounded-full">
              <radio-group-label :class="{ 'bg-opacity-50': !checked }" class="w-8 h-8 md:w-10 md:h-10 border-2 border-white bg-yellow-200 rounded-full block hover:ring-2 ring-blue-600 cursor-pointer transition-all">
                <span class="sr-only">{{ lt('yellow') }}</span>
              </radio-group-label>
            </radio-group-option>
            <radio-group-option v-slot="{ checked }" value="theme-rosa" class="bg-white rounded-full">
              <radio-group-label :class="{ 'bg-opacity-50': !checked }" class="w-8 h-8 md:w-10 md:h-10 border-2 border-white bg-pink-300 rounded-full block hover:ring-2 ring-green-500 cursor-pointer transition-all">
                <span class="sr-only">{{ lt('pink') }}</span>
              </radio-group-label>
            </radio-group-option>
            <radio-group-option v-slot="{ checked }" value="theme-gruen" class="bg-white rounded-full">
              <radio-group-label :class="{ 'bg-opacity-50': !checked }" class="w-8 h-8 md:w-10 md:h-10 border-2 border-white bg-green-500 rounded-full block hover:ring-2 ring-pink-300 cursor-pointer transition-all">
                <span class="sr-only">{{ lt('green') }}</span>
              </radio-group-label>
            </radio-group-option>
          </radio-group>
        </div>
      </div>
    </div>

    <div class="w-full md:w-1/2 md:order-1 px-2 md:px-4 flex flex-wrap md:block">
      <switch-group>
        <switch-label passive class="md:sr-only w-1/2">
          <p>{{ lt('analytics') }} &nbsp; <analytics-icon class="inline" width="22"/></p>
        </switch-label>
        <Switch v-model="analytics" class="switch flex-auto w-1/2 md:w-full text-sm lg:text-base">
          <span :class="!analytics ? 'text-blue-900' : 'text-gray-400'" class="w-1/2 p-1 relative z-10 transition-colors">{{ lt('off') }}</span>
          <span :class="analytics ? 'text-blue-900' : 'text-gray-400'" class="w-1/2 p-1 relative z-10 transition-colors">{{ lt('on') }}</span>
          <span :class="analytics ? 'left-1/2' : 'left-0'" class="pill transition-all"></span>
        </Switch>
      </switch-group>
      <div class="text-xs md:text-sm mt-4 md:mt-8 font-light">
        <p>{{ lt('trackMsg') }} <router-link :to="lt('privLink')" class="underline">{{ lt('privacy') }}</router-link></p>
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
  import AnalyticsIcon from './svg/AnalyticsIcon.vue'
  import ContrastIcon from './svg/ContrastIcon.vue'

  export default defineComponent({
    name: 'RadioSwitches',
    setup () {
      const store = useStore()

      const html = document.documentElement

      const analytics = computed({
        get: () => store.analytics,
        set: (val) => {
          store.analytics = val

          window.localStorage?.setItem('analytics', val ? 'on' : 'off')
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

      return { analytics, darkMode, theme, lt: store.lt }
    },
    components: {
      Switch,
      SwitchGroup,
      SwitchLabel,
      RadioGroup,
      RadioGroupLabel,
      RadioGroupOption,
      AnalyticsIcon,
      ContrastIcon
    }
  })
</script>
