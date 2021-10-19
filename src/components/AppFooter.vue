<template>
  <div>
    <footer class="bg-theme dark:bg-gray-800 text-theme px-8 py-3">
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
              <router-link to="/ueber">Über</router-link>
            </li>
            <li>
              <router-link to="/sitemap">Sitemap</router-link>
            </li>
            <li>
              <router-link to="/impressum">Impressum</router-link>
            </li>
          </ul>
        </div>

        <div class="">
          <a href="https://www.ns-dokuzentrum-muenchen.de/home/" target="_blank" rel="noopener" class="hover:opacity-70 transition-opacity block">
            <ns-doku-logo class="max-w-40 block"/>
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import NsDokuLogo from './svg/NsDokuLogo.vue'

  export default defineComponent({
    name: 'AppFooter',
    components: { NsDokuLogo }
  })
</script>
