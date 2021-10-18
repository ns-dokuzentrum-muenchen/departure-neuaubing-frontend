<template>
  <header ref="header" class="fixed top-0 left-0 right-0 text-white group">
    <div :class="barHeight" class="absolute top-0 left-0 right-0 pointer-events-none transition-all z-0">
      <div class="w-full h-full bg-blue-900 dark:bg-gray-800"></div>
    </div>

    <div class="flex relative items-center p-3">
      <div class="w-20 flex justify-center">
        <menu-button/>
      </div>
      <div :class="menuOpen ? 'opacity-100' : 'opacity-0'" class="group-hover:opacity-100 transition-opacity flex-auto">
        <p @click="toggleMenu" class="text-lg lg:text-2xl font-light cursor-pointer">
          <span>{{ pretitle }}</span>
        </p>
      </div>
      <div :class="menuOpen ? 'opacity-100' : 'opacity-0'" class="w-2/5 flex items-center transition-opacity">
        <div class="w-1/2">
          Webanalyse &nbsp; <img src="~../assets/analytics.svg" width="29" height="22" class="inline align-top pt-0.5"/>
        </div>
        <div class="w-1/2">
          Darstellung &nbsp; <img src="~../assets/contrast.svg" width="21" height="27" class="inline"/>
        </div>
      </div>
    </div>

    <transition @enter="slideOpen" @leave="slideClose">
      <div v-if="menuOpen" data-fade="true" class="overflow-hidden px-3 relative flex">
        <div class="w-20"></div>

        <div class="flex-auto mt-2">
          <ul class="text-2xl font-light">
            <li>
              <router-link to="/" class="hover:underline">Start</router-link>
            </li>
            <li>
              <p>Projekte</p>
              <ul class="pl-8">
                <li v-for="project in projects" :key="project.id">
                  <router-link :to="`/projekte/${project.slug}`" class="hover:underline">{{ project.title?.rendered }}</router-link>
                </li>
              </ul>
            </li>
            <li><router-link to="/ueber" class="hover:underline">Über</router-link></li>
            <li><router-link to="/impressum" class="hover:underline">Impressum</router-link></li>
          </ul>

          <div class="my-12">
            <img src="~../assets/nsdoku-muenchen.svg" width="228" height="67" alt="NS-Dokumentationszentrum München logo">
          </div>
        </div>

        <div class="w-2/5 flex flex-wrap mt-2">
          <radio-switches/>

          <div class="mt-16 w-full">
            <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-7xl">
              <font-logo/>
            </h1>
          </div>
        </div>
      </div>
    </transition>
  </header>
</template>

<script lang="ts">
  import { defineComponent, computed, ref, watchEffect, watch } from 'vue'
  import { useStore } from '../store'
  import { useRoute } from 'vue-router'
  import FontLogo from './FontLogo.vue'
  import MenuButton from './MenuButton.vue'
  import RadioSwitches from './RadioSwitches.vue'
  import { onClickOutside } from '@vueuse/core'

  export default defineComponent({
    name: 'AppHeader',
    setup () {
      const header = ref(null)
      const store = useStore()

      const menuOpen = computed(() => store.menuOpen)
      function toggleMenu () {
        store.menuOpen = !store.menuOpen
      }

      onClickOutside(header, () => {
        if (store.menuOpen) {
          store.menuOpen = false
        }
      })

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

      const route = useRoute()

      watch(() => route.path, async () => {
        store.menuOpen = false
      })

      const projects = computed(() => store.projects)

      return {
        header,
        menuOpen,
        toggleMenu,
        pretitle,
        title,
        description,
        darkMode,
        barHeight,
        projects
      }
    },
    components: { FontLogo, MenuButton, RadioSwitches }
  })
</script>
