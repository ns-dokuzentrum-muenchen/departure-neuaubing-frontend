<template>
  <header class="fixed top-0 left-0 right-0 text-white group">
    <div :class="barHeight" class="absolute top-0 left-0 right-0 pointer-events-none transition-all z-0">
      <div class="w-full h-full bg-blue-900 dark:bg-gray-800"></div>
    </div>

    <div class="flex relative items-center p-3">
      <div class="w-20 flex justify-center">
        <menu-button/>
      </div>
      <div :class="menuOpen ? 'opacity-100' : 'opacity-0'" class="group-hover:opacity-100 transition-opacity flex-auto">
        <p class="text-lg lg:text-2xl font-extralight">
          <router-link to="/">{{ pretitle }}</router-link>
        </p>
      </div>
      <div>
        Webanalyse
      </div>
      <div class="mx-6">
        Darstellung
      </div>
    </div>

    <transition @enter="slideOpen" @leave="slideClose">
      <div v-if="menuOpen" data-fade="true" class="overflow-hidden px-3 relative flex">
        <div class="w-20"></div>

        <div class="flex-auto">
          <ul class="text-2xl">
            <li>
              <router-link to="/">Start</router-link>
            </li>
            <li>
              <p>Projekte</p>
              <ul class="pl-4">
                <li>Zeutnisse „Heute kaum etwas besonderes“</li>
                <li>Mapping Memory</li>
                <li>Portraits of Jewminka</li>
                <li>Filmische Spurensache Neuaubing</li>
                <li>„italienische Militärinternierte“</li>
                <li>Mind the Memory Gap</li>
              </ul>
            </li>
            <li>Über</li>
            <li>Impressum</li>
          </ul>

          <div class="my-12">
            nsdokuzentrum <br>münchen logo
          </div>
        </div>

        <div>
          <div class="flex mb-4 items-center">
            <p class="font-medium">Kontrast</p>
            <div class="flex ml-2">
              <label :class="{ ring: !darkMode }" class="ml-2 px-6 py-1 bg-white text-blue-900 rounded-full cursor-pointer font-medium">
                <input type="radio" v-model="darkMode" :value="false" hidden/>
                Hell
              </label>
              <label :class="{ ring: darkMode }" class="ml-2 px-6 py-1 bg-black text-white rounded-full cursor-pointer font-medium">
                <input type="radio" v-model="darkMode" :value="true" hidden/>
                Dunkel
              </label>
            </div>
          </div>

          <div class="">
            <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
              <font-logo/>
            </h1>
          </div>
        </div>
      </div>
    </transition>
  </header>
</template>

<script lang="ts">
  import { defineComponent, computed, ref, watchEffect } from 'vue'
  import { useStore } from '../store'
  import FontLogo from './FontLogo.vue'
  import MenuButton from './MenuButton.vue'

  export default defineComponent({
    name: 'AppHeader',
    setup () {
      const store = useStore()

      const menuOpen = computed(() => store.menuOpen)

      const pretitle = store.pretitle
      const title = store.title
      const description = store.description

      const html = document.documentElement
      const darkMode = ref(store.darkMode)
      watchEffect(() => {
        if (darkMode.value) {
          html.classList.add('dark')
          window.localStorage?.setItem('cssMode', 'dark')
        } else {
          html.classList.remove('dark')
          window.localStorage?.setItem('cssMode', 'light')
        }
      })

      const barHeight = computed(() => {
        return menuOpen.value ? 'h-full' : 'h-2 group-hover:h-full'
      })

      return { menuOpen, pretitle, title, description, darkMode, barHeight }
    },
    components: { FontLogo, MenuButton }
  })
</script>
