<template>
  <div class="md:flex md:space-x-12 items-start">
    <div class="md:w-2/3 md:sticky top-1/4">
      <div class="aspect-w-16 aspect-h-9">
        <canvas ref="can" class="absolute inset-0 bg-blue-200">
          stuff in here
        </canvas>
      </div>
    </div>
    <div ref="txts" class="md:w-1/3 m-6 md:m-0">
      <div v-for="(frame, i) in frames" :key="i" class="h-block">
        <div :ref="setItem" class="text-lg md:text-xl lg:text-2xl max-w-full md:max-w-xl md:mt-48">
          <div v-html="frame.content" class="html theme-bold break-words"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Image as Img } from '../store/types'
  import { defineComponent, ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
  import { useStore } from '../store'

  export default defineComponent({
    props: {
      block: Object
    },
    setup (props) {
      const can = ref<HTMLCanvasElement|null>(null)
      const ctx = ref<CanvasRenderingContext2D|null>(null)
      const txts = ref<HTMLElement|null>(null)

      const block = computed(() => props.block)
      const images = computed(() => (props.block?.imgs || []) as Img[])

      const store = useStore()
      const location = computed(() => store.visitorDistance)

      const frames = computed<any[]>(() => {
        return block.value?.frames.map((f: any) => {
          return {
            content: f.content.replace('[location]', location.value.city)
              .replace('[distance]', location.value.distance)
          }
        }) || []
      })

      const height = computed(() => (frames.value.length + 1) * (window.innerHeight * 0.6))

      const inView = ref(0)
      let items: HTMLElement[] = []
      const setItem = (el: HTMLElement) => {
        if (el) {
          items.push(el)
        }
        return '' // :ref="" typing
      }

      watch(inView, (idx) => {
        requestAnimationFrame(() => {
          // console.log('update the image', idx)
          updateImage(idx)
        })
      })

      const IMG = new Image()

      // TODO preload images
      // https://css-tricks.com/lets-make-one-of-those-fancy-scrolling-animations-used-on-apple-product-pages/
      onMounted(async () => {
        store.getVisitorDistance()
        await nextTick()

        const canvas = can.value
        if (!canvas) return

        canvas.width = canvas.offsetWidth
        canvas.height = canvas.offsetHeight

        ctx.value = canvas.getContext('2d')

        IMG.src = currentFrame(inView.value)
        IMG.onload = () => {
          ctx.value?.drawImage(IMG, 0, 0, canvas.width, canvas.height)
        }

        window.addEventListener('scroll', observe)

        setTimeout(() => {
          if (!images.value?.length) return

          // preload the images
          // TODO save list of <img>, draw them to canvas?
          for (let i = 0; i < images.value.length; i++) {
            const el = new Image()
            el.src = currentFrame(i)
          }
        }, 1234)
      })
      onUnmounted(() => {
        window.removeEventListener('scroll', observe)
      })

      // TODO get correct size
      function currentFrame (idx: number) {
        const post = images.value[idx]
        if (!post) return ''

        return post.url
      }

      function updateImage (idx: number) {
        IMG.src = currentFrame(idx)
      }

      function observe () {
        if (!txts.value || !images.value.length) return

        const st = window.innerHeight / 4
        const col = txts.value.getBoundingClientRect()

        if (col.top > st) return

        const h = col.height - (col.height / frames.value.length)
        const pxPerImg = h / images.value.length
        const step = Math.floor((st - col.top) / pxPerImg)

        inView.value = Math.min(step, images.value.length)
      }

      return { can, txts, block, frames, height, setItem }
    },
    components: {}
  })
</script>