<template>
  <div ref="header" :class="{ hidden }">
    <header @click="maybeOpen" :class="{ 'cursor-pointer': !menuOpen, attop }" :aria-hidden="!menuOpen" id="main-menu" aria-labelledby="menubutton" class="fixed top-0 left-0 right-0 text-highlight group z-30 max-h-screen overflow-auto">
      <div :class="barHeight" class="absolute top-0 left-0 right-0 pointer-events-none transition-all z-0">
        <div class="w-full h-full bg-theme dark:bg-black"></div>
      </div>

      <div class="flex relative items-center p-1 md:p-3">
        <div class="w-12 md:w-20"></div>
        <div :class="menuOpen || attop ? 'opacity-100' : 'opacity-0'" class="notouch:group-hover:opacity-100 transition-opacity flex-auto">
          <p v-html="lt('pretitle')" class="max-w-64 md:max-w-none sm:text-lg md:text-xl xl:text-2xl font-light leading-tight"></p>
        </div>
        <div :class="menuOpen ? 'opacity-100' : 'opacity-0'" class="hidden lg:flex w-2/5 items-center transition-opacity">
          <div class="w-1/2">
            {{ lt('analytics') }} &nbsp; <analytics-icon class="inline"/>
          </div>
          <div class="w-1/2">
            {{ lt('settings') }} &nbsp; <contrast-icon class="inline"/>
          </div>
        </div>
      </div>

      <transition @enter="slideOpen" @leave="slideClose">
        <div v-if="menuOpen" data-fade="true" @click.stop class="px-4 md:px-8 lg:px-3 relative lg:flex bg-theme dark:bg-black">
          <div class="hidden lg:block w-16 lg:w-20"></div>

          <div class="flex-auto pt-6 md:pt-2 px-2 md:px-0">
            <ul role="menu" class="sm:text-lg lg:text-2xl font-light">
              <li class="my-1 md:my-0">
                <locale-link to="/" class="hover:underline">Start</locale-link>
              </li>
              <li class="my-1 md:my-0">
                <div>
                  <locale-link to="/#project-list" class="hover:underline">{{ lt('perspectives') }}</locale-link>
                </div>
                <ul class="pl-8">
                  <li v-for="project in projects" :key="project.id" class="my-1 md:my-0">
                    <router-link :to="fixLink(project.link)" class="hover:underline">{{ project.title?.rendered }}</router-link>
                  </li>
                </ul>
              </li>
              <li class="my-1 md:my-0"><locale-link to="/pages/ns-zwangsarbeit-und-neuaubing" class="hover:underline">{{ lt('pageZwang') }}</locale-link></li>
              <li class="my-1 md:my-0"><locale-link to="/glossar" class="hover:underline">{{ lt('glossar') }}</locale-link></li>
              <li class="my-1 md:my-0"><locale-link to="/forum" class="hover:underline">Forum</locale-link></li>
              <li class="my-1 md:my-0"><locale-link to="/suchen" class="hover:underline">{{ lt('search') }}</locale-link></li>
              <li class="my-1 md:my-0"><locale-link to="/pages/ueber" class="hover:underline">{{ lt('about') }}</locale-link></li>

              <li class="mt-4 lg:mt-8">
                <locale-link to="/konto" class="flex items-center">
                  <img src="~../assets/person.svg" class="w-6 lg:w-8 h-8 lg:h-8 mr-3"/>
                  <span>{{ lt('konto') }}</span> <span v-if="userName" class="opacity-60 ml-2">({{ userName }})</span>
                </locale-link>
              </li>
              <li class="md:mt-2 mb-4">
                <div class="hidden xflex items-center space-x-3">
                  <img src="~../assets/sprache.svg" class="w-6 lg:w-8 h-8 lg:h-8"/>
                  <switch-lang lang="en"/>
                  <span class="border-r self-stretch"></span>
                  <switch-lang lang="de"/>
                </div>
              </li>
            </ul>

            <div class=" mb-4 sm:text-lg lg:text-2xl font-light"></div>
          </div>

          <div class="lg:hidden mx-2 my-4 md:mx-0 border-b"></div>

          <div class="lg:w-2/5 flex flex-wrap mt-4">
            <radio-switches class="mb-2 md:mb-0"/>

            <div class="lg:hidden mx-2 my-4 md:mx-0 border-b w-full"></div>

            <div class="mx-2 md:ml-0 md:mr-8 mt-2 mb-6 md:mt-16 w-full flex items-end">
              <div class="w-full">
                <a href="https://www.ns-dokuzentrum-muenchen.de/home/" target="_blank" rel="noopener">
                  <ns-doku-logo class="max-w-24 h-auto" title="NS-Dokumentationszentrum München"/>
                </a>
              </div>
              <div class="w-auto">
                <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                  <locale-link to="/">
                    <font-logo class="w-full h-auto" title="Departure Neuaubing"/>
                  </locale-link>
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
  import LocaleLink from './LocaleLink.vue'
  import SwitchLang from './SwitchLang.vue'
  import { onClickOutside } from '@vueuse/core'
  import { slideOpen, slideClose, fixLink } from '../utils'
  import debounce from 'debounce'

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

      const barHeight = computed(() => {
        return menuOpen.value || attop.value ? 'h-full' : 'h-2 notouch:group-hover:h-full'
      })

      const route = useRoute()

      watch(() => route.fullPath, async () => {
        store.menuOpen = false
        // listener()
        onScroll()
      })

      const projects = computed(() => store.projects)

      async function maybeOpen (e: Event) {
        await nextTick()
        if (!store.menuOpen) {
          store.menuOpen = true
        }
      }

      const attop = ref(true)
      // const listener = () => { attop.value = window.scrollY < 60 && route.name ===  'index' }
      const listener = debounce(onScroll, 2)

      onMounted(() => {
        window.addEventListener('scroll', listener)
      })
      onUnmounted(() => {
        window.removeEventListener('scroll', listener)
      })

      let scrollPos = 0
      let tempPos = 0

      function onScroll () {
        if (route.name !== 'index') {
          attop.value = false
          return
        }

        const prevPos = scrollPos
        const pos = window.pageYOffset

        const dir = prevPos >= pos ? -1 : 1

        scrollPos = pos
        // attop.value = window.scrollY < 60
        if (pos < 60) {
          attop.value = true
        } else if (dir === 1 && pos - tempPos > 10) {
          attop.value = false
        } else if (tempPos - pos > 10) {
          attop.value = true
          tempPos = pos
        } else {
          tempPos = pos
        }
      }

      const hidden = computed(() => route.meta?.noheader)
      const userName = computed(() => store.user?.name)

      return {
        lt: store.lt,
        locale: store.locale,
        header,
        menuOpen,
        barHeight,
        projects,
        maybeOpen,
        slideOpen,
        slideClose,
        fixLink,
        attop,
        hidden,
        userName
      }
    },
    components: { FontLogo, MenuButton, RadioSwitches, NsDokuLogo, AnalyticsIcon, ContrastIcon, LocaleLink, SwitchLang }
  })
</script>
