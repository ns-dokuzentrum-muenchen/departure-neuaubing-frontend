<template>
  <div class="my-8 sm:my-12 lg:my-16 relative">
    <div ref="car" class="overflow-hidden outline-none">
      <div v-for="(group, i) in gallery" :key="i" :class="slideClass(i)" class="flex px-4 overflow-hidden slide-width transition-all">
        <div class="space-l"></div>
        <figure v-for="(img, j) in group" :key="img.id" :class="{ 'mr-4 md:mr-8': j < group.length - 1 }">
          <div class="relative w-max">
            <app-image :image="img" :style="imgStyle(img.width, img.height)" class="w-max"/>
          </div>

          <figcaption v-if="img.caption" :style="captionStyle(img.width, img.height)" :class="{ 'opacity-0': slide !== i }" class="text-xs md:text-sm mt-2 transition-opacity">{{ img.caption }}</figcaption>
        </figure>
        <div class="space-r"></div>
      </div>
    </div>

    <div v-if="gallery.length">
      <button v-if="slide > 0" @click="prevSlide" class="absolute top-0 left-0 bottom-1/4 w-8 sm:w-16 md:w-20 cursor-left"></button>
      <button v-if="slide < gallery.length - 1" @click="nextSlide" class="absolute top-0 right-0 bottom-1/4 w-8 sm:w-16 md:w-20 cursor-right"></button>
    </div>
  </div>
</template>

<script lang="ts">
  import type { Image } from '../../store/types'
  import { defineComponent, ref, computed, onMounted, nextTick, onUnmounted } from 'vue'
  import Flickity from 'flickity'
  import AppImage from '../AppImage.vue'

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
      const captionStyle = (w: number, h: number) => {
        return {
          maxWidth: imgStyle(w, h).width
        }
      }

      const slide = ref(0)
      let flkty: Flickity | null = null
      onMounted(async () => {
        calcRowHeight()

        await nextTick()
        if (!car.value) return

        flkty = new Flickity(car.value, {
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

        const h = Math.min(...ratios) * (window.innerWidth * 0.8)
        rowHeight.value = Math.min(h, window.innerHeight * 0.74)
      }

      const nextSlide = () => {
        if (!flkty) return
        flkty.next()
      }
      const prevSlide = () => {
        if (!flkty) return
        flkty.previous()
      }

      const slideClass = (i: number) => {
        const cur = slide.value
        if (i === cur) return 'shift-center'
        else if (i < cur) return 'shift-right'
        else return 'shift-left'
      }

      return { car, gallery, rowHeight, imgStyle, captionStyle, slide, nextSlide, prevSlide, slideClass }
    },
    components: { AppImage }
  })
</script>
