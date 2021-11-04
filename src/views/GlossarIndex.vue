<template>
  <div class="dark:bg-gray-800 pl-12 md:pl-20 lg:pl-32">
    <div class="relative bg-black text-white pt-14 pr-12 md:pr-20 lg:pr-32">
      <div class="flex justify-end py-1 -mr-12">
        <div class="mr-4">
          <router-link to="/forum" class="btn text-lg block">Forum</router-link>
        </div>
        <div class="mr-4">
          <router-link to="/suche" class="btn text-lg whitespace-nowrap block">
            <search-icon class="inline-block w-5 h-5 mr-2"/>
            <span>Suchen</span>
          </router-link>
        </div>
      </div>

      <div class="px-8">
        <div class="max-w-3xl mx-auto mt-12 min-h-screen">
          <div class="absolute top-14">
            <p class="text-xl md:text-2xl lg:text-4xl font-medium">Glossar</p>
          </div>
        </div>
      </div>

      <div class="fixed top-0 p-1 mt-14 left-0 ml-14 transition-all duration-300">
        <router-link to="/" class="btn text-lg block">Zurück</router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import SearchIcon from '../components/svg/SearchIcon.vue'

  export default defineComponent({
    name: 'GlossarIndex',
    components: { SearchIcon }
  })
</script>
