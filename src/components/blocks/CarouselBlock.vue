<template>
  <div class="-mx-4 md:-mx-8">
    <div ref="car" class="overflow-hidden outline-none">
      <div v-for="(group, i) in gallery" :key="i" class="flex space-x-8 px-12 overflow-hidden">
        <figure v-for="img in group" :key="img.id" class="">
          <div class="relative w-max">
            <img :src="img.sizes?.large" :style="calcHeight" :width="img.width" :height="img.height" :alt="img.alt" class="w-max" loading="lazy"/>
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
      const calcHeight = computed(() => {
        const maxW = Math.max(
          ...gallery.value.map(g => g.reduce((a: number, c: any) => a += c.width, 0))
        )
        const maxH = Math.max(
          ...gallery.value.map(g => g.reduce((a: number, c: any) => a += c.height, 0))
        ) / Number(props.block?.group || 1)

        const ratio = maxW / maxH
        const scale = window.innerWidth / (maxW + 132)

        const dscale = window.innerHeight * ratio * scale
        const dratio = (window.innerHeight) * (maxH / maxW)

        const h = Math.min(dscale, dratio) //  === dratio ? dratio * wratio * scale : dscale

        // const vscale = (h / maxH) * maxW
        // const hscale = vscale / maxW
        // const rescale = (window.innerWidth - 132) / hscale

        // const height = window.innerWidth / (maxW - 132) * maxH // h // === dratio ? h * rescale : h

        // console.log('h', maxW, maxH, window.innerWidth, window.innerHeight)

        return {
          height: `${h}px`
        }
      })

      const slide = ref(0)

      onMounted(async () => {
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

      return { car, gallery, calcHeight, slide }
    }
  })
</script>
