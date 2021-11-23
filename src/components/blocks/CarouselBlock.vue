<template>
  <div class="relative">
    <div ref="car" class="overflow-hidden outline-none">
      <div v-for="(group, i) in gallery" :key="i" class="flex space-x-4 md:space-x-8 px-4 md:px-8 lg:px-12 overflow-hidden">
        <figure v-for="img in group" :key="img.id" class="">
          <div class="relative w-max">
            <img :src="img.sizes?.large" :style="imgStyle(img.width, img.height)" :width="img.width" :height="img.height" :alt="img.alt" class="w-max" loading="lazy"/>
          </div>

          <figcaption v-if="img.caption" :class="{ 'opacity-0': slide !== i }" class="max-w-prose text-xs md:text-sm mt-2 transition-opacity">{{ img.caption }}</figcaption>
        </figure>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Image } from '../../store/types'
  import { defineComponent, ref, computed, onMounted, nextTick, onUnmounted } from 'vue'
  import Flickity from 'flickity'

  export default defineComponent({
    props: {
      block: Object,
      slug: String
    },
    setup (props) {
      const car = ref<HTMLElement | null>(null)

      const group = computed(() => {
        return window.innerWidth < 768 ? 1 : Number(props.block?.group || 1)
      })

      const gallery = computed(() => {
        const imgs: Image[] = props.block?.gallery || []
        const ordered = []

        for (let i = 0; i < imgs.length; i += group.value) {
          ordered.push(imgs.slice(i, i + group.value))
        }
        return ordered
      })

      const rowHeight = ref(window.innerHeight * 0.66)
      const imgStyle = (w: number, h: number) => {
        const scale = rowHeight.value / h
        return {
          width: `${w * scale}px`,
          height: `${rowHeight.value}px`
        }
      }

      const slide = ref(0)
      onMounted(async () => {
        calcRowHeight()

        await nextTick()
        if (!car.value) return

        const flkty = new Flickity(car.value, {
          cellAlign: 'center',
          setGallerySize: true,
          imagesLoaded: true,
          pageDots: false,
          prevNextButtons: false
        })

        flkty.on('select', (idx: number | undefined) => {
          slide.value = idx || 0
        })

        window.addEventListener('resize', calcRowHeight)
      })

      onUnmounted(() => {
        window.removeEventListener('resize', calcRowHeight)
      })

      function calcRowHeight () {
        const ratios: number[] = []

        // loop through groups, scale to same height,
        // scale that width to window
        gallery.value?.forEach((grp) => {
          const minH = Math.min(...grp.map(i => i.height))
          let maxW = 0
          grp.forEach((i: any) => {
            const scale = minH / i.height
            maxW += i.width * scale // 2rem * 2, for gaps
          })
          const groupScale = minH / maxW
          const h = minH * groupScale
          const w = maxW * groupScale

          ratios.push(h / w)
        })

        if (!ratios.length) return

        const h = Math.min(...ratios) * (window.innerWidth * 0.94)
        rowHeight.value = Math.min(h, window.innerHeight * 0.74)
      }

      return { car, gallery, rowHeight, imgStyle, slide }
    }
  })
</script>
