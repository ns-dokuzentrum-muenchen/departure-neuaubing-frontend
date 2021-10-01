<template>
  <div>
    <footer class="bg-blue-900 dark:bg-gray-800 text-white p-3">
      <div class="sm:flex font-medium my-4">
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
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    name: 'AppFooter'
  })
</script>
