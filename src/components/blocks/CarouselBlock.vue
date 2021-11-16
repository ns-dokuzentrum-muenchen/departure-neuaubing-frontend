<template>
  <div class="-mx-4 md:-mx-8">
    <div id="carousel" :style="calcHeight" class="overflow-hidden outline-none">
      <div v-for="(group, i) in gallery" :key="i" class="flex space-x-8 h-full px-12">
        <figure v-for="img in group" :key="img.id" class="h-full w-max">
          <img :src="img.sizes?.large" :style="calcHeight" :width="img.width" :height="img.height" :alt="img.alt" class="h-full w-max" loading="lazy"/>
        </figure>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, computed, onMounted } from 'vue'
  import Flickity from 'flickity'

  export default defineComponent({
    props: {
      block: Object,
      slug: String
    },
    setup (props) {
      const imgHeight = ref(window.innerWidth / 1.8)

      const gallery = computed(() => {
        const imgs = props.block?.gallery || []
        const group = props.block?.group || 1
        const ordered = []

        for (let i = 0; i < imgs.length; i += group) {
          ordered.push(imgs.slice(i, i + group))
        }
        return ordered
      })
      const calcHeight = computed(() => {
        const max = Math.max(...gallery.value.map(g => g.reduce((a, c) => a += c.width, 0)))
        return {
          height: `calc(66vh * ${Math.min(window.innerWidth / (max + 132), 1)})`
        }
      })

      onMounted(() => {
        new Flickity('#carousel', {
          cellAlign: 'center',
          setGallerySize: false
        })
      })

      return { imgHeight, gallery, calcHeight }
    }
  })
</script>

<style>
</style>
