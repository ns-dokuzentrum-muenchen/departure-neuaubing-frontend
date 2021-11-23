<template>
  <div ref="header">
    <header @click="maybeOpen" :class="{ 'cursor-pointer': !menuOpen, attop }" class="fixed top-0 left-0 right-0 text-highlight group z-30">
      <div :class="barHeight" class="absolute top-0 left-0 right-0 pointer-events-none transition-all z-0">
        <div class="w-full h-full bg-theme dark:bg-black"></div>
      </div>

      <div class="flex relative items-center p-1 md:p-3">
        <div class="w-12 md:w-20"></div>
        <div :class="menuOpen || attop ? 'opacity-100' : 'opacity-0'" class="notouch:group-hover:opacity-100 transition-opacity flex-auto">
          <p class="text-md md:text-lg lg:text-2xl font-light leading-tight">
            <span>{{ pretitle }}</span>
          </p>
        </div>
        <div :class="menuOpen ? 'opacity-100' : 'opacity-0'" class="hidden md:flex w-2/5 items-center transition-opacity">
          <div class="w-1/2">
            Webanalyse &nbsp; <analytics-icon class="inline"/>
          </div>
          <div class="w-1/2">
            Darstellung &nbsp; <contrast-icon class="inline"/>
          </div>
        </div>
      </div>

      <transition @enter="slideOpen" @leave="slideClose">
        <div v-if="menuOpen" data-fade="true" @click.stop class="overflow-hidden px-3 relative md:flex">
          <div class="w-16 md:w-20"></div>

          <div class="flex-auto pt-6 md:pt-2 px-2 md:px-0">
            <ul class="md:text-lg lg:text-2xl font-light">
              <li class="my-1 md:my-0">
                <router-link to="/" class="hover:underline">Start</router-link>
              </li>
              <li class="my-1 md:my-0">
                <p>Projekte</p>
                <ul class="pl-8">
                  <li v-for="project in projects" :key="project.id" class="my-1 md:my-0">
                    <router-link :to="`/projekte/${project.slug}`" class="hover:underline">{{ project.title?.rendered }}</router-link>
                  </li>
                </ul>
              </li>
              <li class="my-1 md:my-0"><router-link to="/ueber" class="hover:underline">Über</router-link></li>
              <li class="my-1 md:my-0"><router-link to="/impressum" class="hover:underline">Impressum</router-link></li>
            </ul>

            <div class="hidden md:block my-12">
              <a href="https://www.ns-dokuzentrum-muenchen.de/home/" target="_blank" rel="noopener" class="hover:opacity-70 transition-opacity block">
                <ns-doku-logo/>
              </a>
            </div>
          </div>

          <div class="md:hidden mx-2 my-4 border-b"></div>

          <div class="md:w-2/5 flex flex-wrap mt-4">
            <radio-switches class="mb-2 md:mb-0"/>

            <div class="md:hidden mx-2 my-4 border-b w-full"></div>

            <div class="mx-2 md:mx-0 mt-2 mb-6 md:mt-16 w-full flex items-end">
              <div class="md:hidden w-1/2">
                <ns-doku-logo class="max-w-24 h-auto"/>
              </div>
              <div class="w-2/3 md:w-full">
                <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                  <router-link to="/"><font-logo/></router-link>
                </h1>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </header>

    <div :class="{ 'notouch:pointer-events-none': !menuOpen }" class="flex justify-center w-12 md:w-24 fixed top-2.5 md:top-3.5 left-0 z-30 mix-blend-exclusionX text-whiteX">
      <menu-button :attop="attop" class="px-3.5 md:px-12"/>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed, ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
  import { useStore } from '../store'
  import { useRoute } from 'vue-router'
  import FontLogo from './FontLogo.vue'
  import MenuButton from './MenuButton.vue'
  import RadioSwitches from './RadioSwitches.vue'
  import NsDokuLogo from './svg/NsDokuLogo.vue'
  import AnalyticsIcon from './svg/AnalyticsIcon.vue'
  import ContrastIcon from './svg/ContrastIcon.vue'
  import { onClickOutside } from '@vueuse/core'
  import { slideOpen, slideClose } from '../utils'

  export default defineComponent({
    name: 'AppHeader',
    setup () {
      const header = ref(null)
      const store = useStore()

      const menuOpen = computed(() => store.menuOpen)
      onClickOutside(header, () => {
        if (store.menuOpen) {
          store.menuOpen = false
        }
      })

      const pretitle = store.pretitle

      const barHeight = computed(() => {
        return menuOpen.value || attop.value ? 'h-full' : 'h-2 notouch:group-hover:h-full'
      })

      const route = useRoute()

      watch(() => route.path, async () => {
        store.menuOpen = false
        listener()
      })

      const projects = computed(() => store.projects)

      async function maybeOpen (e: Event) {
        await nextTick()
        if (!store.menuOpen) {
          store.menuOpen = true
        }
      }

      const attop = ref(true)
      const listener = () => { attop.value = window.scrollY < 60 && route.name ===  'index' }

      onMounted(() => {
        window.addEventListener('scroll', listener)
      })
      onUnmounted(() => {
        window.removeEventListener('scroll', listener)
      })

      return {
        header,
        menuOpen,
        pretitle,
        barHeight,
        projects,
        maybeOpen,
        slideOpen,
        slideClose,
        attop
      }
    },
    components: { FontLogo, MenuButton, RadioSwitches, NsDokuLogo, AnalyticsIcon, ContrastIcon }
  })
</script>
