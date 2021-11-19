<template>
  <div class="-mx-4 md:-mx-8">
    <div ref="car" class="overflow-hidden outline-none">
      <div v-for="(group, i) in gallery" :key="i" class="flex space-x-8 px-12 overflow-hidden">
        <figure v-for="img in group" :key="img.id" class="">
          <div class="relative w-max">
            <img :src="img.sizes?.large" :style="imgStyle(img.width, img.height)" :width="img.width" :height="img.height" :alt="img.alt" class="w-max" loading="lazy"/>
          </div>

          <figcaption v-if="img.caption" :class="{ 'opacity-0': slide !== i }" class="max-w-prose text-sm mt-2 transition-opacity">{{ img.caption }}</figcaption>
        </figure>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, computed, onMounted, nextTick } from 'vue'
  import Flickity from 'flickity-imagesloaded'

  export default defineComponent({
    props: {
      block: Object,
      slug: String
    },
    setup (props) {
      const car = ref<HTMLElement | null>(null)

      const gallery = computed(() => {
        const imgs = props.block?.gallery || []
        const group = Number(props.block?.group || 1)
        const ordered = []

        for (let i = 0; i < imgs.length; i += group) {
          ordered.push(imgs.slice(i, i + group))
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

        flkty.on('select', (idx: number) => {
          slide.value = idx
        })
      })

      function calcRowHeight () {
        const heights: number[] = []
        const widths: number[] = []
        const ratios: number[] = []

        gallery.value?.forEach((group) => {
          const minH = Math.min(...group.map(i => i.height))
          let maxW = 0
          group.forEach((i: any) => {
            const scale = minH / i.height
            maxW += (i.width * scale) + 60
            // maxW = Math.max(maxW, i.width * scale)
          })
          const groupScale = minH / maxW
          const h = minH * groupScale
          const w = maxW * groupScale
          heights.push(h)
          widths.push(w)
          ratios.push(h / w)
        })

        if (!ratios.length) return

        const h = Math.min(...ratios) * (window.innerWidth - 20)
        rowHeight.value = Math.min(h, window.innerHeight * 0.74)
      }

      return { car, gallery, rowHeight, imgStyle, slide }
    }
  })
</script>
