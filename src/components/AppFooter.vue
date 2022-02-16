<template>
  <div :class="{ hidden }" class="relative">
    <footer class="bg-theme text-theme px-4 md:px-8 py-3">
      <div class="sm:flex justify-between my-4 max-w-8xl mx-auto text-lg">
        <div class="sm:mr-12">
          <p>NS-Dokumentationszentrum München</p>
          <p>Max-Mannheimer-Platz 1 | 80333 München</p>
          <p>Telefon: +49 89 233-67000</p>
          <p>Fax: +49 89 233-67005</p>
        </div>

        <div>
          <ul>
            <li>
              <router-link :to="lt('aboutLink')">{{ lt('about') }}</router-link>
            </li>
            <!-- <li>
              <router-link :to="lt('sitemapLink')">Sitemap</router-link>
            </li> -->
            <li>
              <router-link :to="lt('imprLink')">{{ lt('impressum') }}</router-link>
            </li>
            <li>
              <router-link :to="lt('privLink')">{{ lt('privacy') }}</router-link>
            </li>
          </ul>
        </div>

        <div class="">
          <a href="https://www.ns-dokuzentrum-muenchen.de/home/" target="_blank" rel="noopener" class="hover:opacity-70 transition-opacity block">
            <ns-doku-logo class="max-w-40 block" title="NS-Dokumentationszentrum München"/>
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { useStore } from '../store'
  import NsDokuLogo from './svg/NsDokuLogo.vue'
  import LocaleLink from './LocaleLink.vue'

  export default defineComponent({
    name: 'AppFooter',
    setup () {
      const route = useRoute()
      const hidden = computed(() => route.meta?.nofooter)

      const store = useStore()

      return { hidden, lt: store.lt }
    },
    components: { NsDokuLogo, LocaleLink }
  })
</script>
