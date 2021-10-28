<template>
  <header ref="header" @click="maybeOpen" :class="{ 'cursor-pointer': !menuOpen }" class="fixed top-0 left-0 right-0 text-highlight group z-30">
    <div :class="barHeight" class="absolute top-0 left-0 right-0 pointer-events-none transition-all z-0">
      <div class="w-full h-full bg-theme dark:bg-black"></div>
    </div>

    <div class="flex relative items-center p-3">
      <div @click.stop class="w-20 flex justify-center">
        <menu-button/>
      </div>
      <div :class="menuOpen ? 'opacity-100' : 'opacity-0'" class="group-hover:opacity-100 transition-opacity flex-auto">
        <p class="text-lg lg:text-2xl font-light">
          <span>{{ pretitle }}</span>
        </p>
      </div>
      <div :class="menuOpen ? 'opacity-100' : 'opacity-0'" class="w-2/5 flex items-center transition-opacity">
        <div class="w-1/2">
          Webanalyse &nbsp; <analytics-icon class="inline"/>
        </div>
        <div class="w-1/2">
          Darstellung &nbsp; <contrast-icon class="inline"/>
        </div>
      </div>
    </div>

    <transition @enter="slideOpen" @leave="slideClose">
      <div v-if="menuOpen" data-fade="true" @click.stop class="overflow-hidden px-3 relative flex">
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
            <a href="https://www.ns-dokuzentrum-muenchen.de/home/" target="_blank" rel="noopener" class="hover:opacity-70 transition-opacity block">
              <ns-doku-logo/>
            </a>
          </div>
        </div>

        <div class="w-2/5 flex flex-wrap mt-4">
          <radio-switches/>

          <div class="mt-16 w-full">
            <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
              <router-link to="/"><font-logo/></router-link>
            </h1>
          </div>
        </div>
      </div>
    </transition>
  </header>
</template>

<script lang="ts">
  import { defineComponent, computed, ref, watch, nextTick } from 'vue'
  import { useStore } from '../store'
  import { useRoute } from 'vue-router'
  import FontLogo from './FontLogo.vue'
  import MenuButton from './MenuButton.vue'
  import RadioSwitches from './RadioSwitches.vue'
  import NsDokuLogo from './svg/NsDokuLogo.vue'
  import AnalyticsIcon from './svg/AnalyticsIcon.vue'
  import ContrastIcon from './svg/ContrastIcon.vue'
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

      const darkMode = ref(store.darkMode)

      const barHeight = computed(() => {
        return menuOpen.value ? 'h-full' : 'h-2 group-hover:h-full'
      })

      const route = useRoute()

      watch(() => route.path, async () => {
        store.menuOpen = false
      })

      const projects = computed(() => store.projects)

      async function maybeOpen () {
        await nextTick()
        if (!store.menuOpen) {
          toggleMenu()
        }
      }

      return {
        header,
        menuOpen,
        toggleMenu,
        pretitle,
        title,
        description,
        darkMode,
        barHeight,
        projects,
        maybeOpen
      }
    },
    components: { FontLogo, MenuButton, RadioSwitches, NsDokuLogo, AnalyticsIcon, ContrastIcon }
  })
</script>