<template>
  <div>
    <header class="p-3 bg-blue-900 dark:bg-black text-white">
      <div class="flex">
        <div class="border-l w-2"></div>
        <div class="border-l w-2"></div>
        <div class="border-l w-2"></div>
        <p class="ml-4">{{ pretitle }}</p>
      </div>

      <div class="mx-12 lg:mx-32 my-12">
        <h1 class="font-light text-3xl sm:text-4xl md:text-6xl lg:text-8xl">
          <span>DEPARTURE</span><br>
          <span class="pl-20">NEUAUBING</span>
        </h1>
      </div>

      <div class="flex items-start">
        <div class="font-mono border rounded-full px-1.5">i</div>
        <div class="max-w-prose ml-4">{{ description }}</div>
      </div>

      <div class="border-b mt-8 mb-4">
        <p class="font-medium mb-2">Darstellung</p>
      </div>
      <div class="flex mb-4 items-center">
        <p class="font-medium">Kontrast</p>
        <div class="flex ml-2">
          <label :class="{ ring: !mode }" class="ml-2 px-6 py-1 bg-white text-blue-900 rounded-full cursor-pointer font-medium">
            <input type="radio" v-model="mode" :value="false" hidden/>
            Hell
          </label>
          <label :class="{ ring: mode }" class="ml-2 px-6 py-1 bg-black text-white rounded-full cursor-pointer font-medium">
            <input type="radio" v-model="mode" :value="true" hidden/>
            Dunkel
          </label>
        </div>
      </div>
    </header>

    <main class="p-3">
      <router-view/>
    </main>

    <footer class="p-3 hidden">
      <small class="text-gray-500 text-2xs">Work in progress</small>
    </footer>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, watchEffect } from 'vue'
  import { useStore } from './store'

  export default defineComponent({
    name: 'App',
    setup () {
      const store = useStore()

      const pretitle = store.pretitle
      const title = store.title
      const description = store.description

      const html = document.documentElement
      const mode = ref(store.mode)
      watchEffect(() => {
        if (mode.value) {
          html.classList.add('dark')
        } else {
          html.classList.remove('dark')
        }
      })

      return { pretitle, title, description, mode }
    }
  })
</script>

<style>
  @import './style.css';
</style>
