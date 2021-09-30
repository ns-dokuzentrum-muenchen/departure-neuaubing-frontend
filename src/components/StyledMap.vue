<template>
  <div class="w-full aspect-w-6 aspect-h-4 relateive">
    <div ref="map" class="absolute inset-0 w-full h-full"></div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue'
  import L from 'leaflet'

  export default defineComponent({
    name: 'Map',
    setup () {
      const map = ref()
      const layer = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.png', {
        attribution: '<a href="http://stamen.com">Stamen</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: 'abcd',
        minZoom: 0,
        maxZoom: 20
      })

      return { map, layer }
    },
    mounted () {
      const el = this.$refs.map as HTMLElement
      if (!el) return // never?

      this.map = L.map(el).setView([48.1453673, 11.5655232], 13)
      this.layer.addTo(this.map)
    }
  })
</script>

<style>
  @import 'leaflet/dist/leaflet.css';
</style>
